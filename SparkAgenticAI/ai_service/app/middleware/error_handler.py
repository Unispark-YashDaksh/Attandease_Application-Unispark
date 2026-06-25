from __future__ import annotations

from fastapi import HTTPException
from fastapi.responses import JSONResponse
from httpx import HTTPError
from app.schemas.chat import ChatResponse


async def safe_hrms_call(coro, fallback_message: str):
    try:
        return await coro
    except HTTPError as e:
        return {"error": f"HRMS service error: {str(e)}", "fallback": fallback_message}
    except Exception as e:
        return {"error": f"Unexpected error: {str(e)}", "fallback": fallback_message}
