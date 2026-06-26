from __future__ import annotations

from typing import Any
import httpx
from app.config import settings
from app.schemas.tool_result import ToolResult


async def get_employee_profile(employee_id: str) -> ToolResult:
    try:
        url = f"{settings.hrms_api_base_url}/profile/{employee_id}/"
        async with httpx.AsyncClient(timeout=20) as client:
            response = await client.get(url)
            response.raise_for_status()
            data = response.json()

        return ToolResult(
            status="success",
            tool_name="fetch_employee_profile",
            data=data,
            next_action=None,
        )
    except httpx.HTTPStatusError as e:
        return ToolResult(
            status="error",
            tool_name="fetch_employee_profile",
            error=f"HRMS returned {e.response.status_code}: {e.response.text[:200]}",
            next_action="contact_admin",
        )
    except httpx.TimeoutException:
        return ToolResult(
            status="error",
            tool_name="fetch_employee_profile",
            error=f"HRMS service timed out",
            next_action="retry_later",
        )
    except httpx.HTTPError as e:
        return ToolResult(
            status="error",
            tool_name="fetch_employee_profile",
            error=f"HRMS connection error: {str(e)}",
            next_action="contact_admin",
        )


async def get_leave_balance(employee_id: str) -> ToolResult:
    try:
        url = f"{settings.hrms_api_base_url}/employees/{employee_id}/leave-balance"
        async with httpx.AsyncClient(timeout=20) as client:
            response = await client.get(url)
            response.raise_for_status()
            data = response.json()
        return ToolResult(
            status="success",
            tool_name="fetch_leave_balance",
            data=data,
            next_action=None,
        )
    except httpx.HTTPStatusError as e:
        return ToolResult(
            status="error",
            tool_name="fetch_leave_balance",
            error=f"HRMS returned {e.response.status_code}: {e.response.text[:200]}",
            next_action="contact_admin",
        )
    except httpx.TimeoutException:
        return ToolResult(
            status="error",
            tool_name="fetch_leave_balance",
            error=f"HRMS service timed out",
            next_action="retry_later",
        )
    except httpx.HTTPError as e:
        return ToolResult(
            status="error",
            tool_name="fetch_leave_balance",
            error=f"HRMS connection error: {str(e)}",
            next_action="contact_admin",
        )


async def create_employee_profile(payload: dict[str, Any]) -> ToolResult:
    try:
        url = f"{settings.hrms_api_base_url}/addNewEmployee"
        async with httpx.AsyncClient(timeout=30) as client:
            response = await client.post(url, json=payload)
            response.raise_for_status()
            data = response.json()
        return ToolResult(
            status="success",
            tool_name="create_hrms_employee_profile",
            data=data,
            next_action="assign_leave_balance",
        )
    except httpx.HTTPStatusError as e:
        return ToolResult(
            status="error",
            tool_name="create_hrms_employee_profile",
            error=f"HRMS returned {e.response.status_code}: {e.response.text[:300]}",
            next_action="contact_admin",
        )
    except httpx.TimeoutException:
        return ToolResult(
            status="error",
            tool_name="create_hrms_employee_profilee",
            error=f"HRMS service timed out",
            next_action="retry_later",
        )
    except httpx.HTTPError as e:
        return ToolResult(
            status="error",
            tool_name="create_hrms_employee_profile",
            error=f"HRMS connection error: {str(e)}",
            next_action="contact_admin",
        )
    
async def get_attendance(employee_id: str, month: int, year: int) -> ToolResult:
    try:
        url = f"{settings.hrms_api_base_url}/attendance/{employee_id}/{month}/{year}"
        async with httpx.AsyncClient(timeout=20) as client:
            response = await client.get(url)
            response.raise_for_status()
            data = response.json()
        return ToolResult(
            status="success",
            tool_name="fetch_attendance",
            data=data,
            next_action=None,
        )
    except httpx.HTTPStatusError as e:
        return ToolResult(
            status="error",
            tool_name="fetch_attendance",
            error=f"HRMS returned {e.response.status_code}: {e.response.text[:200]}",
            next_action="contact_admin",
        )
    except httpx.TimeoutException:
        return ToolResult(
            status="error",
            tool_name="fetch_attendance",
            error=f"HRMS service timed out",
            next_action="retry_later",
        )
    except httpx.HTTPError as e:
        return ToolResult(
            status="error",
            tool_name="fetch_attendance",
            error=f"HRMS connection error: {str(e)}",
            next_action="contact_admin",
        )
