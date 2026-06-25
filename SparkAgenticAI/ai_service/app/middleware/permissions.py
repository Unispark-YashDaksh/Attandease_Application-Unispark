from __future__ import annotations

from fastapi import HTTPException
from app.schemas.chat import VerifiedUserContext, ToolName
from app.middleware.auth_context import TOOL_PERMISSION_MAP


def require_permission(ctx: VerifiedUserContext, tool: ToolName) -> None:
    allowed_roles = TOOL_PERMISSION_MAP.get(tool, [])
    if ctx.role not in allowed_roles:
        raise HTTPException(
            status_code=403,
            detail=f"Role '{ctx.role}' does not have permission to use '{tool}'",
        )


def require_role(ctx: VerifiedUserContext, requried_role: str) -> None:
    if ctx.role != require_role:
        raise HTTPException(
            status_code=403,
            detail=f"Required role '{requried_role}', got '{ctx.role}'",
        )
