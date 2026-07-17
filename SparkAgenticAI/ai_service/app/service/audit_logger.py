from __future__ import annotations

import json
import logging
from datetime import datetime, timezone, timedelta
from typing import Any

import httpx
from app.config import settings
from app.schemas.audit import AuditLogEntry

logger = logging.getLogger("audit")
_file_handler = logging.FileHandler(settings.audit_log_file)
_file_handler.setFormatter(logging.Formatter("%(message)s"))
logger.addHandler(_file_handler)
logger.setLevel(logging.INFO)


async def log_audit_entry(
    who: str,
    what: str,
    tool: str,
    action: str,
    changed: bool,
    success: bool,
    error: str | None = None,
    data: dict[str, Any] | None = None,
) -> None:
    entry = AuditLogEntry(
        who=who,
        what=what,
        tool=tool,
        action=action,
        changed=changed,
        success=success,
        error=error,
        data=data,
        timestamp=datetime.now(timezone.utc),
    )

    log_line = entry.model_dump_json()
    logger.info(log_line)

    try:
        async with httpx.AsyncClient(timeout=5) as client:
            payload = entry.model_dump(mode="json")

            if isinstance(payload.get("timestamp"), str):
                payload["timestamp"] = (
                    payload["timestamp"].replace("T", " ").split(".")[0]
                )
            await client.post(
                f"{settings.hrms_api_base_url}/api/audit-logs",
                json=payload,
            )

    except Exception as e:
        logger.error(f"Failed to send audit log to backend: {e}")
