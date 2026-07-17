from __future__ import annotations

from typing import Any
import httpx
from app.config import settings
from app.schemas.tool_result import ToolResult
from app.service.agent_logger import async_http_call_timer


async def get_employee_profile(employee_id: str) -> ToolResult:
    url = f"{settings.hrms_api_base_url}/profile/{employee_id}"
    async with async_http_call_timer("GET", url) as timer:
        try:

            async with httpx.AsyncClient(timeout=20) as client:
                response = await client.get(url)
                timer["status"] = response.status_code
                response.raise_for_status()
                data = response.json()

            return ToolResult(
                status="success",
                tool_name="fetch_employee_profile",
                data=data,
                next_action=None,
            )
        except httpx.HTTPStatusError as e:
            timer["status"] = e.response.status_code
            return ToolResult(
                status="error",
                tool_name="fetch_employee_profile",
                error=f"HRMS returned {e.response.status_code}: {e.response.text[:200]}",
                next_action="contact_admin",
            )
        except httpx.TimeoutException:
            timer["status"] = "timeout"
            return ToolResult(
                status="error",
                tool_name="fetch_employee_profile",
                error=f"HRMS service timed out",
                next_action="retry_later",
            )
        except httpx.HTTPError as e:
            timer["status"] = "exception"
            return ToolResult(
                status="error",
                tool_name="fetch_employee_profile",
                error=f"HRMS connection error: {str(e)}",
                next_action="contact_admin",
            )


async def get_leave_balance(employee_id: str) -> ToolResult:
    url = f"{settings.hrms_api_base_url}/employees/{employee_id}/leave-balance"
    async with async_http_call_timer("GET", url) as timer:
        try:
            async with httpx.AsyncClient(timeout=20) as client:
                response = await client.get(url)
                timer["status"] = response.status_code
                response.raise_for_status()
                data = response.json()
            return ToolResult(
                status="success",
                tool_name="fetch_leave_balance",
                data=data,
                next_action=None,
            )
        except httpx.HTTPStatusError as e:
            timer["status"] = e.response.status_code
            return ToolResult(
                status="error",
                tool_name="fetch_leave_balance",
                error=f"HRMS returned {e.response.status_code}: {e.response.text[:200]}",
                next_action="contact_admin",
            )
        except httpx.TimeoutException:
            timer["status"] = "timeout"
            return ToolResult(
                status="error",
                tool_name="fetch_leave_balance",
                error=f"HRMS service timed out",
                next_action="retry_later",
            )
        except httpx.HTTPError as e:
            timer["status"] = "exception"
            return ToolResult(
                status="error",
                tool_name="fetch_leave_balance",
                error=f"HRMS connection error: {str(e)}",
                next_action="contact_admin",
            )


async def resolve_onboarding_references(payload: dict[str, Any]) -> dict[str, Any]:
    url = f"{settings.hrms_api_base_url}/api/resolve-onboarding-refs"
    async with async_http_call_timer("POST", url) as timer:
        try:
            async with httpx.AsyncClient(timeout=20) as client:
                response = await client.post(url, json=payload)
                timer["status"] = response.status_code
                response.raise_for_status()
                data = response.json()

            if not data.get("success"):
                raise ValueError(
                    data.get("error", "Could not resolve onboarding reference")
                )

            return data.get("data", {})

        except Exception:
            timer["status"] = "error"
            raise


async def create_employee_profile(payload: dict[str, Any]) -> ToolResult:
    try:
        url = f"{settings.hrms_api_base_url}/addNewEmployee"
        async with httpx.AsyncClient(timeout=30) as client:
            form_data = {}
            for key, value in payload.items():
                if value is not None:
                    form_data[key] = str(value)
            response = await client.post(url, data=form_data)
            data = response.json()
            if response.status_code == 200 and data.get("success"):
                return ToolResult(
                    status="success",
                    tool_name="create_hrms_employee_profile",
                    data=data,
                    next_action="assign_leave_balance",
                )
            return ToolResult(
                status="error",
                tool_name="create_hrms_employee_profile",
                error=data.get(
                    "message",
                    data.get("error", f"Backend returned {response.status_code}"),
                ),
                next_action="contact_admin",
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
            tool_name="create_hrms_employee_profile",
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
        url = f"{settings.hrms_api_base_url}/attendance/report/{employee_id}/{month}/{year}"
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
