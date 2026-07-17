from __future__ import annotations

from fastapi import Request, HTTPException
from app.schemas.chat import VerifiedUserContext, ToolName

TOOL_PERMISSION_MAP: dict[ToolName, list[str]] = {
    "fetch_employee_profile": ["employee", "admin"],
    "fetch_leave_balance": ["employee", "admin"],
    "fetch_attendance": ["employee", "admin"],
    "create_hrms_employee_profile": ["admin"],
    "create_m365_account": ["admin"],
    "schedule_joining_meeting": ["admin"],
    "order_laptop": ["admin"],
    "order_id_card": ["admin"],
    "query_knowledge_base": ["admin"],
}


async def extract_verified_context(request: Request) -> VerifiedUserContext:
    employee_id = request.headers.get("X-Employee-Id")
    role = request.headers.get("X-Role")

    if role not in ("employee", "admin"):
        raise HTTPException(status_code=401, detail="Invalid role")

    allowed_tools: list[ToolName] = [
        tool for tool, roles in TOOL_PERMISSION_MAP.items() if role in roles
    ]

    if not employee_id:
        raise HTTPException(status_code=401, detail="Missing Employee ID")

    return VerifiedUserContext(
        employee_id=employee_id,
        role=role,
        permissions=allowed_tools,
    )
