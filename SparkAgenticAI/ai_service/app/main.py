from __future__ import annotations

import logging
from datetime import datetime, timezone

from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware

from app.agents.workflow_agent import run_admin_workflow
from app.middleware.auth_context import extract_verified_context
from app.middleware.permissions import require_permission, require_role
from app.middleware.error_handler import safe_hrms_call
from app.router import classify_message
from app.schemas.chat import (
    ChatRequest,
    ChatResponse,
    OnboardingRequest,
    VerifiedUserContext,
)
from app.schemas.tool_result import ToolResult
from app.service.audit_logger import log_audit_entry
from app.service.groq_text import summarize_employee_answer
from app.service.hrms_client import (
    get_leave_balance,
    get_attendance,
    get_employee_profile,
)
from app.service.kb_client import query_knowledge_base
from app.service.workflow_manager import (
    advance_workflow,
    create_workflow,
    resume_workflow,
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Spark HRMS Agentic AI Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def _now() -> str:
    return datetime.now(timezone.utc).isoformat()


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/ai/chat", response_model=ChatResponse)
async def chat(
    request: ChatRequest,
    ctx: VerifiedUserContext = Depends(extract_verified_context),
) -> ChatResponse:

    user_message = request.message
    employee_id = request.employee_id or ctx.employee_id
    route = classify_message(user_message)

    try:
        if route == "onboarding_workflow":
            require_role(ctx, "admin")
            return await _handle_onboarding(
                user_message, ctx, employee_id, workflow_id=request.workflow_id
            )

        elif route == "leave_balance":
            require_permission(ctx, "fetch_leave_balance")
            return await _handle_leave_balance(user_message, ctx, employee_id)

        elif route == "employee_profile":
            require_permission(ctx, "fetch_employee_profile")
            return await _handle_employee_profile(user_message, ctx, employee_id)

        elif route == "attendance_query":
            require_permission(ctx, "fetch_attendance")
            return await _handle_attendance(user_message, ctx, employee_id)
        elif route == "kb_query":
            require_permission(ctx, "query_knowledge_base")
            return await _handle_kb_query(user_message, ctx)
        else:
            return ChatResponse(
                status="success",
                route="unsupported",
                answer=(
                    "I can currently help you with:\n"
                    "- Leave balance inquiry\n"
                    "- Employee profile details\n"
                    "- Attendance records\n"
                    "- Employee onboardings (admin only)\n\n"
                    "Please rephrase your question or ask one of the above."
                ),
            )
    except HTTPException:
        raise

    except Exception as e:
        logger.exception(f"Unhandled error in chat: {e}")
        return ChatResponse(
            status="error",
            route="unsupported",
            answer="Something went wrong. Please try again or contact support.",
        )


async def _handle_leave_balance(
    message: str,
    ctx: VerifiedUserContext,
    employee_id: str,
) -> ChatResponse:
    result = await get_leave_balance(employee_id)
    await log_audit_entry(
        who=ctx.employee_id,
        what=message,
        tool="fetch_leave_balance",
        action="read",
        changed=False,
        success=result.status == "success",
        error=result.error,
        data=result.data,
    )
    if result.status == "error":
        return ChatResponse(
            status="error",
            route="leave_balance",
            answer=f"I couldn't retrieve your leave balance. {result.error}",
            data={"next_action": result.next_action},
        )
    answer = await summarize_employee_answer(message, result.data or {})
    return ChatResponse(
        status="success",
        route="leave_balance",
        answer=answer,
        data=result.data,
    )


async def _handle_employee_profile(
    message: str,
    ctx: VerifiedUserContext,
    employee_id: str,
) -> ChatResponse:
    result = await get_employee_profile(employee_id)
    await log_audit_entry(
        who=ctx.employee_id,
        what=message,
        tool="fetch_employee_profile",
        action="read",
        changed=False,
        success=result.status == "success",
        error=result.error,
        data=result.data,
    )
    if result.status == "error":
        return ChatResponse(
            status="error",
            route="employee_profile",
            answer=f"I couldn't retrieve your profile. {result.error}",
            data={"next_action": result.next_action},
        )
    answer = await summarize_employee_answer(message, result.data or {})
    return ChatResponse(
        status="success",
        route="employee_profile",
        answer=answer,
        data=result.data,
    )


async def _handle_attendance(
    message: str,
    ctx: VerifiedUserContext,
    employee_id: str,
) -> ChatResponse:
    from dateutil import parser
    import re

    month_match = re.search(r"(\d{4})[-\s](\d{1,2})", message)
    if not month_match:
        from datetime import datetime as dt

        now = dt.now()
        month, year = now.month, now.year
    else:
        year, month = int(month_match.group(1)), int(month_match.group(2))

    result = await get_attendance(employee_id, month, year)
    await log_audit_entry(
        who=ctx.employee_id,
        what=message,
        tool="fetch_attendance",
        action="read",
        changed=False,
        success=result.status == "success",
        error=result.error,
        data=result.data,
    )

    if result.status == "error":
        return ChatResponse(
            status="error",
            route="attendance_query",
            answer=f"I couldn't retrieve your attendance. {result.error}",
            data={"next_action": result.next_action},
        )

    answer = await summarize_employee_answer(message, result.data or {})
    return ChatResponse(
        status="success",
        route="attendance_query",
        answer=answer,
        data=result.data,
    )


async def _handle_kb_query(
    message: str,
    ctx: VerifiedUserContext,
) -> ChatResponse:
    result = await query_knowledge_base(message)
    await log_audit_entry(
        who=ctx.employee_id,
        what=message,
        tool="query_knowledge_base",
        action="read",
        changed=False,
        success=result.status == "success",
        error=result.error,
        data=result.data,
    )

    if result.status == "error":
        return ChatResponse(
            status="error",
            route="kb_query",
            answer=f"I couldn't search the knowledge base. {result.error}",
            data={"next_action": result.next_action},
        )

    results = (result.data or {}).get("results", [])
    if not results:
        return ChatResponse(
            status="success",
            route="kb_query",
            answer=f"I searched the knowledge base but found nothing relevant to your query.",
            data=result.data,
        )

    lines = ["Here's what i found in the knowledge base:\n"]
    for r in results:
        lines.append(f"**{r['title']}** (from {r['source']})")
        lines.append(f"_{r['content'][:300]}..._\n")
    answer = "\n".join(lines)

    return ChatResponse(
        status="success",
        route="kb_query",
        answer=answer,
        data=result.data,
    )


async def _handle_onboarding(
    message: str,
    ctx: VerifiedUserContext,
    employee_id: str,
    workflow_id: str | None = None,
) -> ChatResponse:
    if workflow_id:
        state = await resume_workflow(workflow_id, message)
        if state and state.agent_conversation:
            answer = await run_admin_workflow(
                message,
                workflow_id=workflow_id,
                conversation_history=state.agent_conversation,
            )
            return ChatResponse(
                status="success",
                route="onboarding_workflow",
                answer=answer,
                workflow_id=workflow_id,
                data={"workflow_id": workflow_id},
            )
    workflow = await create_workflow(
        workflow_type="onboarding_v2",
        created_by=ctx.employee_id,
        payload={"message": message, "employee_id": employee_id},
        steps=[
            "validate_input",
            "create_m365_account",
            "create_hrms_profile",
            "schedule_joining_meeting",
            "order_laptop",
            "order_id_card",
        ],
    )

    if workflow and workflow.steps:
        workflow = await advance_workflow(
            workflow.workflow_id, "validate_input", "completed"
        )

    answer = await run_admin_workflow(
        message,
        workflow_id=workflow.workflow_id if workflow else None,
    )

    await log_audit_entry(
        who=ctx.employee_id,
        what=message,
        tool="create_hrms_employee_profile",
        action="create",
        changed=True,
        success=True,
        data={"workflow_id": workflow.workflow_id if workflow else None},
    )

    return ChatResponse(
        status="success",
        route="onboarding_workflow",
        answer=answer,
        data={"workflow_id": workflow.workflow_id if workflow else None},
    )


@app.post("/ai/workflows/onboarding", response_model=ChatResponse)
async def onboarding(
    request: OnboardingRequest,
    ctx: VerifiedUserContext = Depends(extract_verified_context),
) -> ChatResponse:
    require_role(ctx, "admin")

    workflow = await create_workflow(
        workflow_type="onboarding_v2",
        created_by=ctx.employee_id,
        payload=request.model_dump(mode="json"),
        steps=[
            "validate_input",
            "create_m365_account",
            "create_hrms_profile",
            "schedule_joining_meeting",
            "order_laptop",
            "order_id_card",
        ],
    )

    if workflow:
        await advance_workflow(workflow.workflow_id, "validate_input", "completed")

    prompt = (
        "Onboard this new employee with the following details. "
        "Execute all 5 onboarding steps in order:\n"
        f"- Employee Code: {request.employee_code}\n"
        f"- Employee Name: {request.employee_name}\n"
        f"- Email Id: {request.employee_email_id}\n"
        f"- Mobile: {request.employee_mobile_no}\n"
        f"- Joining Date: {request.employee_joining_date}\n"
        f"- Gender: {request.gender}\n"
        f"- Designation: {request.designation}\n"
        f"- Department: {request.department}\n"
        f"- Branch: {request.branch}\n"
        f"- Shift: {request.shift}\n"
        f"- Role: {request.role}\n\n"
        "For the joining meeting, schedule it for the employee's joining date at 11:00 AM IST "
        "for 1 hour. Include the HR manager."
    )

    answer = await run_admin_workflow(prompt)
    if workflow:
        await advance_workflow(
            workflow.workflow_id,
            "order_id_card",
            "completed",
            payload={"ai_output": answer},
        )

    await log_audit_entry(
        who=ctx.employee_id,
        what=f"onboarding: {request.employee_name} ({request.employee_code})",
        tool="create_hrms_employee_profile",
        action="create",
        changed=True,
        success=True,
        data={"workflow_id": workflow.workflow_id if workflow else None},
    )
    return ChatResponse(
        status="success",
        route="onboarding_workflow",
        answer=answer,
        data={"workflow_id": workflow.workflow_id if workflow else None},
    )


@app.get("/ai/workflow/{workflow_id}")
async def get_workflow_status(
    workflow_id: str,
    ctx: VerifiedUserContext = Depends(extract_verified_context),
) -> dict:
    from app.service.workflow_manager import get_workflow

    state = await get_workflow(workflow_id)
    if not state:
        raise HTTPException(status_code=404, detail="Workflow not found")
    return state.model_dump(mode="json")
