from __future__ import annotations
from datetime import datetime
from typing import Any
from pydantic import BaseModel


class AuditLogEntry(BaseModel):
    who: str
    what: str
    tool: str
    action: str
    changed: bool
    success: bool
    error: str | None = None
    data: dict[str, Any] | None = None
    timestamp: datetime
