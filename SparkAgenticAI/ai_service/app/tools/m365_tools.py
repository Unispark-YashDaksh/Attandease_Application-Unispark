from __future__ import annotations

from typing import Any

from agents import function_tool
from app.service import m365_client


@function_tool
async def create_m365_account(
    display_name: str,
    given_name: str,
    surname: str,
    department: str | None = None,
    job_title: str | None = None,
    manager: str | None = None,
) -> dict[str, Any]:
    result = await m365_client.create_m365_user(
        display_name=display_name,
        given_name=given_name,
        surname=surname,
        department=department,
        job_title=job_title,
    )
    return result.model_dump()


@function_tool
async def schedule_joining_meeting(
    subject: str,
    start_datetime: str,
    end_datetime: str,
    attendee_email: list[str],
    body: str | None = None,
    location: str | None = None,
) -> dict[str, Any]:
    result = await m365_client.schedule_calendar_event(
        subject=subject,
        start_datetime=start_datetime,
        end_datetime=end_datetime,
        attendee_emails=attendee_email,
        body=body,
        location=location,
    )
    return result.model_dump()
