from __future__ import annotations

import httpx
from app.config import settings
from app.schemas.tool_result import ToolResult
from app.service.agent_logger import async_http_call_timer


async def create_m365_user(
    display_name: str,
    given_name: str,
    surname: str,
    department: str | None = None,
    job_title: str | None = None,
    manager: str | None = None,
) -> ToolResult:
    url = f"{settings.hrms_api_base_url}/api/m365/users"
    async with async_http_call_timer("POST", url) as timer:
        try:
            async with httpx.AsyncClient(timeout=30) as client:
                resp = await client.post(
                    url,
                    json={
                        "displayName": display_name,
                        "givenName": given_name,
                        "surname": surname,
                        "userPrincipalName": f"{given_name.lower()}.{surname.lower()}{settings.m365_user_principal_suffix}",
                        "mailNickname": f"{given_name.lower()}.{surname.lower()}",
                        "password": f"{settings.user_m365_password}",
                        "department": department or "",
                        "jobTitle": job_title or "",
                        "manager": manager or "",
                    },
                )
                timer["status"] = resp.status_code
                if resp.status_code == 201:
                    data = resp.json().get("data", {})
                    if not data.get("mail"):
                        data["mail"] = data.get("user_principal_name", "")
                        data["_mail_warning"] = (
                            "Mailbox not yet provisioned. "
                            "Meeting invite may bounce until Exchange license is assigned."
                        )
                    return ToolResult(
                        status="success",
                        tool_name="create_m365_account",
                        data=data,
                        next_action="create_hrms_profile",
                    )
                error_data = resp.json()
                return ToolResult(
                    status="error",
                    tool_name="create_m365_account",
                    error=error_data.get(
                        "error", f"Backend returned {resp.status_code}"
                    ),
                    next_action="retry_or_escalate",
                )

        except httpx.TimeoutException:
            timer["status"] = "timeout"
            return ToolResult(
                status="error",
                tool_name="create_m365_account",
                error="Backend service timed out",
                next_action="retry_later",
            )

        except Exception as e:
            timer["status"] = "exception"
            return ToolResult(
                status="error",
                tool_name="create_m365_account",
                error=str(e),
                next_action="retry_or_escalate",
            )


async def schedule_calendar_event(
    subject: str,
    start_datetime: str,
    end_datetime: str,
    attendee_emails: list[str],
    body: str | None = None,
    location: str | None = None,
) -> ToolResult:
    url = f"{settings.hrms_api_base_url}/api/calendar/events"
    async with async_http_call_timer("POST", url) as timer:
        try:
            async with httpx.AsyncClient(timeout=30) as client:
                resp = await client.post(
                    url,
                    json={
                        "subject": subject,
                        "startDateTime": start_datetime,
                        "endDateTime": end_datetime,
                        "attendees": attendee_emails,
                        "body": body or "",
                        "location": location or "",
                        "organizerId": settings.hr_manager_email,
                    },
                )
                timer["status"] = resp.status_code
                if resp.status_code == 201:
                    data = resp.json().get("data", {})
                    return ToolResult(
                        status="success",
                        tool_name="schedule_joining_meeting",
                        data=data,
                        next_action="order_laptop",
                    )

                error_data = resp.json()
                return ToolResult(
                    status="error",
                    tool_name="schedule_joining_meeting",
                    error=error_data.get(
                        "error", f"Backend returned {resp.status_code}"
                    ),
                    next_action="retry_or_escalate",
                )
        except httpx.TimeoutException:
            timer["status"] = "timeout"
            return ToolResult(
                status="error",
                tool_name="schedule_joining_meeting",
                error="Backend service timed out",
                next_action="retry_later",
            )
        except Exception as e:
            timer["status"] = "exception"
            return ToolResult(
                status="error",
                tool_name="schedule_joining_meeting",
                error=str(e),
                next_action="retry_or_escalate",
            )
