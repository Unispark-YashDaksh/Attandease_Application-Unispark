from __future__ import annotations
from typing import Literal

from app.schemas.chat import RouteName


def classify_message(
    message: str,
) -> RouteName:
    normalized = message.lower()
    onboarding_keywords = [
        "onboard",
        "create employee",
        "add employee",
        "new heir",
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
    attendance_keywords = [
        "attendance",
        "punch",
        "present",
        "absent",
        "work from home",
        "wfh",
    ]
    kb_keywords = [
        "policy",
        "policies",
        "hr policies",
        "company rule",
        "compliance",
        "employee manual",
        "sop",
        "procedure",
        "knowledge base",
        "kb",
    ]

    if any(term in normalized for term in onboarding_keywords):
        return "onboarding_workflow"
    if any(term in normalized for term in leave_keywords):
        return "leave_balance"
    if any(term in normalized for term in profile_keywords):
        return "employee_profile"
    if any(term in normalized for term in attendance_keywords):
        return "attendance_query"
    if any(term in normalized for term in kb_keywords):
        return "kb_query"
    return "unsupported"
