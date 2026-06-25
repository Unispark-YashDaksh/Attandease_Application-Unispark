from typing import Any
import httpx
from app.config import settings


async def get_employee_profile(employee_id: str) -> dict[str, Any]:
    url = f"{settings.hrms_api_base_url}/profile/{employee_id}/"
    async with httpx.AsyncClient(timeout=20) as client:
        response = await client.get(url)
        response.raise_for_status()
        return response.json()


async def get_leave_balance(employee_id: str) -> dict[str, Any]:
    url = f"{settings.hrms_api_base_url}/employees/{employee_id}/leave-balance"
    async with httpx.AsyncClient(timeout=20) as client:
        response = await client.get(url)
        response.raise_for_status()
        return response.json()


async def create_employee_profile(payload: dict[str, Any]) -> dict[str, Any]:
    url = f"{settings.hrms_api_base_url}/addNewEmployee"
    async with httpx.AsyncClient(timeout=30) as client:
        response = await client.post(url, json=payload)
        response.raise_for_status()
        return response.json()
