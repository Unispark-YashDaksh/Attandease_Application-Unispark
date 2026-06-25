from fastapi import FastAPI, HTTPException

from app.agents.workflow_agent import run_admin_workflow
from app.router import classify_message
from app.schemas.chat import ChatRequest, ChatResponse, OnboardingRequest
from app.service.groq_text import summarize_employee_answer
from app.service.hrms_client import get_leave_balance

app = FastAPI(title="Spark HRMS Agentic AI Service")


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/ai/chat", response_model=ChatResponse)
async def chat(request: ChatRequest) -> ChatResponse:
    route = classify_message(request.message, request.role)

    if route == "employee_query":
        employee_id = request.employee_id or request.user_id
        hrms_data = await get_leave_balance(employee_id)
        answer = await summarize_employee_answer(request.message, hrms_data)

        return ChatResponse(
            status="success",
            route="employee_query",
            answer=answer,
            data={"source": "hrms_leave_balance"},
        )

    if route == "admin_workflow":
        if request.role != "admin":
            return ChatResponse(
                status="blocked",
                route="unsupported",
                answer="Only admins can run HRMS workflows.",
            )

        answer = await run_admin_workflow(request.message)
        return ChatResponse(
            status="success",
            route="admin_workflow",
            answer=answer,
        )

    return ChatResponse(
        status="blocked",
        route="unsupported",
        answer=(
            "I can currently help with leave balance queries and basic admin "
            "employee workflow. Policy Q&A will be enabled after policy documents exist."
        ),
    )


@app.post("/ai/workflows/onboarding", response_model=ChatResponse)
async def onboarding(request: OnboardingRequest) -> ChatResponse:
    if request.role != "admin":
        raise HTTPException(status_code=403, detail="Only admins can onboard employees")

    prompt = (
        "Create a new HRMS employee profile with these exact details: "
        f"employee_code={request.employee_code}, "
        f"employee_name={request.employee_name}, "
        f"employee_email_id={request.employee_email_id}, "
        f"employee_mobile_no={request.employee_mobile_no}, "
        f"employee_joining_date={request.employee_joining_date}, "
        f"gender={request.gender}, "
        f"designation_id={request.designation_id}, "
        f"department_id={request.department_id}, "
        f"branch_id={request.branch_id}, "
        f"shift_id={request.shift_id}, "
        f"role_id={request.role_id}."
    )

    answer = await run_admin_workflow(prompt)
    return ChatResponse(status="success", route="admin_workflow", answer=answer)
