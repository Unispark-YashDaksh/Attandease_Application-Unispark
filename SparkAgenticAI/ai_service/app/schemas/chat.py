from __future__ import annotations

from typing import Any, Literal
from pydantic import BaseModel, Field


RouteName = Literal[
    "leave_balance",
    "employee_profile",
    "attendance_query",
    "onboarding_workflow",
    "unsupported",
]
ToolName = Literal[
    "fetch_employee_profile",
    "fetch_leave_balance",
    "create_hrms_employee_profile",
    "fetch_attendance",
    "none",
]

class VerifiedUserContext(BaseModel):
    user_id: str
    employee_id: str
    role: Literal["employee", "admin"]
    permissions: list[ToolName]

class ChatRequest(BaseModel):
    user_id: str
    message: str = Field(min_length=2)
    employee_id: str | None = None


class ChatResponse(BaseModel):
    status: Literal["success", "blocked", "error"]
    route: RouteName
    answer: str
    data: dict[str, Any] | None = None


class OnboardingRequest(BaseModel):
    employee_name: str
    employee_email_id: str
    employee_mobile_no: str | None = None
    employee_code: str
    employee_joining_date: str | None = None
    gender: str | None = None
    designation_id: int | None = None
    department_id: int | None = None
    branch_id: int | None = None
    shift_id: int | None = None
    role_id: int | None = None
