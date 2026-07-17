from __future__ import annotations

from typing import Any, Literal
from pydantic import BaseModel


class ToolResult(BaseModel):
    status: Literal["success", "error", "pending"]
    tool_name: str
    data: dict[str, Any] | None = None
    error: str | None = None
    next_action: str | None = None
