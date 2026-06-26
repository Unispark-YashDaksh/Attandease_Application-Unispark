from __future__ import annotations

from typing import Any
from agents import function_tool
from app.service import hrms_client

@function_tool
async def fetch_employee_profile(employee_id: str) -> dict[str, Any]:
  result = await hrms_client.get_employee_profile(employee_id)
  return result.model_dump()

@function_tool
async def fetch_leave_balance(employee_id: str) ->dict[str, Any]:
  result = await hrms_client.get_leave_balance(employee_id)
  return result.model_dump()

@function_tool
async def create_hrms_employee_profile(
  employee_code: str,
  employee_name: str,
  employee_email_id: str,
  employee_mobile_no: str | None = None,
  employee_joining_date: str | None = None,
  gender: str | None = None,
  designation_id: int | None = None,
  department_id: int | None = None,
  branch_id: int | None = None,
  shift_id: int | None = None,
  role_id: int | None = None,
) -> dict[str, Any]:
  payload = {
    "employee_code": employee_code,
    "employee_name": employee_name,
    "employee_email_id": employee_email_id,
    "employee_mobile_no": employee_mobile_no,
    "employee_joining_date": employee_joining_date,
    "gender": gender,
    "designation_id": designation_id,
    "department_id": department_id,
    "branch_id": branch_id,
    "shift_id": shift_id,
    "role_id": role_id,
    "employeement_status": "ACTIVE",
  }
  result = await hrms_client.create_employee_profile(payload)
  return result.model_dump()