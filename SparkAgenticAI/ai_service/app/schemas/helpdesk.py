from __future__ import annotations

from typing import Any
from pydantic import BaseModel


class HelpdeskTicketRequest(BaseModel):
    summary: str
    description: str
    requester_name: str
    category: str = "IT Support"
    priority: str = "Medium"
    custom_fields: dict[str, Any] | None = None


class HelpdeskTicketResponse(BaseModel):
    ticket_id: str
    status: str
    url: str | None = None
