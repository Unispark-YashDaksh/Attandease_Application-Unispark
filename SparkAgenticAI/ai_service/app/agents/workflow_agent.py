from __future__ import annotations

from openai import AsyncOpenAI
import json
import time
from typing import Any, cast

from agents import (
    Agent,
    Runner,
    SQLiteSession,
    TResponseInputItem,
    OpenAIChatCompletionsModel,
)

from app.config import settings
from app.service.agent_hooks import AgentDebugHooks
from app.service.agent_logger import log_done, log_start
from app.service.workflow_manager import save_workflow_conversation
from app.schemas.workflow import AgentWorkflowContext
from app.tools.hrms_tools import (
    create_hrms_employee_profile,
    fetch_employee_profile,
    fetch_leave_balance,
)
from app.tools.m365_tools import (
    create_m365_account,
    schedule_joining_meeting,
)
from app.tools.helpdesk_tools import (
    order_laptop,
    order_id_card,
)
from app.tools.kb_tools import query_knowledge_base

groq_client = AsyncOpenAI(
    api_key=settings.groq_api_key,
    base_url=settings.groq_base_url,
)

groq_model = OpenAIChatCompletionsModel(
    model="llama-3.3-70b-versatile",
    openai_client=groq_client,
)

workflow_agent = Agent(
    name="HRMS Workflow Agent",
    model=groq_model,
    instructions=(
        "You are an autonomous employee onboarding agent.\n"
        "Your GOAL is to fully onboard a new employee across all systems.\n"
        "Do not stop until all 5 steps are completed or one irrecoverably fails.\n\n"
        "## STEP 0: EXTRACT PARAMETERS FROM THE USER MESSAGE\n"
        "Extract the admin email from [Admin: ...] prefix. Use it as the requester_email for Steps 4 and 5.\n"
        "Before calling ANY tool, scan the user's message and extract every available parameter:\n"
        "- employee name → employee_name, given_name, surname\n"
        "- employee code → employee_code\n"
        "- department → department (e.g., 'Engineering')\n"
        "- designation → designation (e.g., 'Software Engineer')\n"
        "- mobile number → employee_mobile_no\n"
        "- joining date → employee_joining_date\n"
        "- gender → gender\n"
        "- manager name → manager\n"
        "NEVER skip a parameter that was clearly stated in the message.\n"
        "Do NOT look for email in the user's message. Email is created by M365 in Step 1\n"
        "and will be automatically used for all subsequent steps.\n\n"
        "## THE 5-STEP ONBOARDING WORKFLOW\n"
        "Execute these steps in strict order. Each depends on the previous:\n\n"
        "1. CREATE M365 ACCOUNT (create_m365_account)\n"
        "   - Create the user in Microsoft 365 (Azure AD / Entra ID)\n"
        "   - This creates their email, mailbox, Teams, and calendar\n"
        "   - Inputs: display_name, given_name, surname, department, job_title, manager\n"
        "   - The response returns a 'mail' field with the created email address.\n"
        "   - SAVE this email. You will need it for steps 2 and 3.\n"
        "   - If '_mail_warning' is present, note it in your summary. Proceed anyway.\n\n"
        "2. CREATE HRMS PROFILE (create_hrms_employee_profile)\n"
        "   - Store employee info in the HRMS system\n"
        "   - Inputs: employee_code, employee_name, employee_email_id, employee_mobile_no,\n"
        "     employee_joining_date, gender, designation_name, department_name, branch_name,\n"
        "     shift_name, role_name\n"
        "   - CRITICAL: Use the 'mail' value from Step 1 as employee_email_id.\n"
        "     Do NOT use any email from the user's message. Only use the M365-created email.\n"
        "   - If the admin gives names (not IDs), pass the names to the tool.\n"
        "     Do not ask for numeric IDs unless the name cannot be resolved.\n\n"
        "3. SCHEDULE JOINING MEETING (schedule_joining_meeting)\n"
        "   - Now that the employee has a mailbox, schedule an orientation meeting\n"
        "   - Use the M365-created email as the attendee\n"
        "   - Inputs: subject, start_datetime, end_datetime, attendee_email, body\n\n"
        "4. ORDER LAPTOP (order_laptop)\n"
        "   - Raise an IT asset request\n"
        "   - Inputs: requester_name, requester_email, employee_name, department\n\n"
        "5. ORDER ID CARD (order_id_card)\n"
        "   - Raise an HR request for access and identification\n"
        "   - Inputs: requester_name, requester_email, employee_name, employee_code\n\n"
        "## AUTONOMOUS DECISION MAKING\n"
        "- If a tool call fails (returns error status), check the next_action field:\n"
        "  - 'retry_later' or 'retry_or_escalate' -> retry once after a brief pause\n"
        "  - 'contact_admin' -> stop and tell the user which step failed\n"
        "  - If retry also fails, notify the user and continue if possible\n"
        "- Use query_knowledge_base to look up HR policies, compliance, rules,\n"
        "  or procedures when needed during onboarding.\n\n"
        "## RULES\n"
        "- NEVER ask the user for the email address. M365 creates it in Step 1.\n"
        "- NEVER skip a parameter that was provided in the user's message.\n"
        "- For Steps 4 and 5, always pass your requester_email (the admin who initiated this onboarding).\n"
        "- Report a clear summary of what was accomplished at each step.\n"
        "- If M365 is not configured, the system will simulate account creation\n"
        "  for development - note this in your summary.\n"
    ),
    tools=[
        create_m365_account,
        create_hrms_employee_profile,
        schedule_joining_meeting,
        order_laptop,
        order_id_card,
        query_knowledge_base,
        fetch_employee_profile,
        fetch_leave_balance,
    ],
    hooks=AgentDebugHooks(),
)


async def run_admin_workflow(
    message: str,
    workflow_id: str | None = None,
    conversation_history: list[dict[str, Any]] | None = None,
) -> str:
    log_start(
        "AGENT", f"=== Starting onboarding workflow run | prompt={message[:100]}..."
    )
    start = time.monotonic()
    ctx = AgentWorkflowContext(workflow_id=workflow_id)

    session = None
    if workflow_id:
        session = SQLiteSession(
            session_id=f"onboarding_{workflow_id}",
            db_path="./agent_session.db",
        )
        if conversation_history:
            await session.clear_session()
            typed_history = cast(list[TResponseInputItem], conversation_history)
            await session.add_items(typed_history)
    result = await Runner.run(
        workflow_agent,
        message,
        context=ctx,
        session=session,
    )
    elapsed_ms = round((time.monotonic() - start) * 1000)
    log_done(
        "AGENT",
        f"=== Workflow run completed | total={elapsed_ms}ms | "
        f"output_len={len(result.final_output)}",
    )

    if workflow_id and session:
        full_history = cast(list[dict[str, Any]], await session.get_items())
        answer = result.final_output
        is_question = any(
            word in answer.lower()
            for word in ["which", "what", "how", "please", "?", "could you"]
        )
        if is_question:
            await save_workflow_conversation(
                workflow_id=workflow_id,
                pending_question=answer,
                conversation=full_history,
            )
    return result.final_output
