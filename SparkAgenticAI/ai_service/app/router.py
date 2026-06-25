from __future__ import annotations
from typing import Literal

from app.schemas.chat import RouteName


def classify_message(message: str, role: str) -> RouteName:
    normalized = message.lower()
    onboarding_keyboards = [
        "onboard",
        "create employee",
        "add employee",
        "new hier",
    ]
    leave_keywords = [
        "leave_balance",
        "leave",
        "remaining leaves",
        "leave available",
    ]
    profile_keywords = [
        "my details",
        "my profile",
        "profile",
        "my info",
        "employee info",
    ]
    attendance_keyords = [
        "attendance",
        "punch",
        "present",
        "absent",
        "work from home",
        "wfh",
    ]

    if any(term in normalized for term in onboarding_keyboards):
        return "onboarding_workflow"

    if any(term in normalized for term in leave_keywords):
        return "leave_balance"
    if any(term in normalized for term in profile_keywords):
        return "employee_profile"
    if any(term in normalized for term in attendance_keyords):
        return "attendance_query"
    return "unsupported"
