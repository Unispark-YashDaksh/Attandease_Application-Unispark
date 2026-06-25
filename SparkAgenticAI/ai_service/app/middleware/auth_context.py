from __future__ import annotations

from fastapi import Request, HTTPException
from app.schemas.chat import VerifiedUserContext, ToolName

TOOL_PERMISSION_MAP: dict[ToolName, list[str]] = {
    "fetch_employee_profile": ["employee", "admin"],
    "fetch_leave_balance": ["employee", "admin"],
    "fetch_attendance": ["employee", "admin"],
    "create_hrms_employee_profile": ["admin"],
}


async def extract_verfied_context(request: Request) -> VerifiedUserContext:
    user_id = request.headers.get("X-User_Id")
    employee_id = request.headers.get("X-Employee_Id")
    role = request.headers.get("X-Role")

    if not user_id or not employee_id or not role:
        raise HTTPException(status_code=401, detail="Missing auth context headers")

    if role not in ("employee", "admin"):
        raise HTTPException(status_code=401, detail="Invalid role")

    allowed_tools: list[ToolName] = [
        tool for tool, roles in TOOL_PERMISSION_MAP.items() if role in roles
    ]

    return VerifiedUserContext(
        user_id=user_id,
        employee_id=employee_id,
        role=role,
        permissions=allowed_tools,
    )
