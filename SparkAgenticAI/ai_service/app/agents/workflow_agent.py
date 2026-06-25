from agents import Agent, Runner

from app.tools.hrms_tools import (
    create_hrms_employee_profile,
    fetch_employee_profile,
    fetch_leave_balance,
)

workflow_agent = Agent(
  name="HRMS Workflow Agent",
  instructions=(
    "You are an HRMS workflow assisstant for admin. "
    "Use only the provided tools. "
    "For write actions, summarize exactly what succeeded or failed. "
    "If required data is missing, ask for the missing fields instead of guessing"
  ),
  tools=[
    fetch_leave_balance,
    fetch_employee_profile,
    create_hrms_employee_profile
  ],
)

async def run_admin_workflow(message: str) -> str:
  result = await Runner.run(workflow_agent, message)
  return result.final_output