from __future__ import annotations

from typing import Any
from pydantic import BaseModel


class M365UserCreateRequest(BaseModel):
    display_name: str
    given_name: str
    surname: str
    user_principal_name: str
    mail_nickname: str
    password: str
    department: str | None = None
    job_title: str | None = None
    manager: str | None = None
    usage_location: str = "IN"


class M365UserCreateResponse(BaseModel):
    employee_id: str
    user_principal_name: str
    display_name: str
    mail: str | None = None


class CalendarEventRequest(BaseModel):
    subject: str
    start_datetime: str
    end_datetime: str
    timezone: str = "Asia/Kolkata"
    attendees: list[str] = []
    body: str | None = None
    location: str | None = None


class CalendarEventResponse(BaseModel):
    event_id: str
    web_link: str | None = None
