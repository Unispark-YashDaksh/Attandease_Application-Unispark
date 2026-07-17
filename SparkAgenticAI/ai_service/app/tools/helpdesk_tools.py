from __future__ import annotations

from typing import Any

from agents import function_tool
from app.service import helpdesk_client


@function_tool
async def order_laptop(
    requester_name: str,
    requester_email: str,
    employee_name: str,
    department: str | None = None,
    delivery_date: str | None = None,
) -> dict[str, Any]:
    summary = f"IT Asset Request - Laptop for {employee_name}"
    description = (
        f"New laptop required for {employee_name}.\n"
        f"Department: {department or 'TBD'}\n"
        f"Requested delivery: {delivery_date or 'ASAP'}\n"
        f"Requested by: {requester_name}."
    )
    result = await helpdesk_client.create_ticket(
        summary=summary,
        description=description,
        requester_name=requester_name,
        requester_email=requester_email,
        category="IT",
        subcategory="Laptop Request",
    )
    return result.model_dump()


@function_tool
async def order_id_card(
    requester_name: str,
    requester_email: str,
    employee_name: str,
    employee_code: str,
    department: str | None = None,
) -> dict[str, Any]:
    summary = f"HR Request - ID Card for {employee_name}"
    description = (
        f"New ID card required for {employee_name} (Code: {employee_code}).\n"
        f"Department: {department or 'TBD'}\n"
        f"Requested by: {requester_name}"
    )
    result = await helpdesk_client.create_ticket(
        summary=summary,
        description=description,
        requester_name=requester_name,
        requester_email=requester_email,
        category="HR",
        subcategory="ID Card Request",
    )
    return result.model_dump()
