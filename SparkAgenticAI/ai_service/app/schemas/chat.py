from __future__ import annotations

from typing import Any, Literal
from pydantic import BaseModel, Field

RouteName = Literal[
    "leave_balance",
    "employee_profile",
    "attendance_query",
    "onboarding_workflow",
    "kb_query",
    "unsupported",
]
ToolName = Literal[
    "fetch_employee_profile",
    "fetch_leave_balance",
    "create_hrms_employee_profile",
    "fetch_attendance",
    "create_m365_account",
    "schedule_joining_meeting",
    "order_laptop",
    "order_id_card",
    "query_knowledge_base",
    "none",
]


class VerifiedUserContext(BaseModel):
    employee_id: str
    role: Literal["employee", "admin"]
    permissions: list[ToolName]


class ChatRequest(BaseModel):
    message: str = Field(min_length=2)
    employee_id: str
    workflow_id: str | None = None


class ChatResponse(BaseModel):
    status: Literal["success", "blocked", "error"]
    route: RouteName
    answer: str
    data: dict[str, Any] | None = None
    workflow_id: str | None = None


class OnboardingRequest(BaseModel):
    employee_name: str
    employee_email_id: str
    employee_mobile_no: str | None = None
    employee_code: str
    employee_joining_date: str | None = None
    gender: str | None = None
    designation: str | None = None
    department: str | None = None
    branch: str | None = None
    shift: str | None = None
    role: str | None = None
    reporting_manager: str | None = None
