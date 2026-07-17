from __future__ import annotations

import time
from typing import Any

from agents import AgentHooks, ModelResponse, RunContextWrapper
from agents.agent import Agent
from agents.tool import Tool

from app.service.agent_logger import log_done, log_start
from app.service.workflow_manager import advance_workflow

TOOL_TO_STEP: dict[str, str] = {
    "create_m365_account": "create_m365_account",
    "create_hrms_employee_profile": "create_hrms_employee_profile",
    "schedule_joining_meeting": "schedule_joining_meeting",
    "order_laptop": "order_laptop",
    "order_id_card": "order_id_card",
}


def _truncate(text: Any, max_len: int = 120) -> str:
    s = str(text)
    return s[:max_len] + "..." if len(s) > max_len else s


class AgentDebugHooks(AgentHooks):
    _turn_counter: int = 0

    async def on_start(self, context: RunContextWrapper, agent: Agent) -> None:
        self._turn_counter = 0
        log_start("AGENT", f">>> Agent '{agent.name}' starting")

    async def on_end(
        self, context: RunContextWrapper, agent: Agent, output: Any
    ) -> None:
        log_done(
            "AGENT", f"<<< Agent '{agent.name}' completed | output={_truncate(output)}"
        )

    async def on_llm_start(
        self,
        context: RunContextWrapper,
        agent: Agent,
        system_prompt: str | None,
        input_items: list,
    ) -> None:
        self._turn_counter += 1
        log_start(
            "LLM",
            f">>> OpenAI call starting (turn {self._turn_counter}) | "
            f"prompt={_truncate(system_prompt, 80)}",
        )
        context.context._llm_start_time = time.monotonic()

    async def on_llm_end(
        self, context: RunContextWrapper, agent: Agent, response: Any
    ) -> None:
        start = getattr(context.context, "_llm_start_time", None)

        if start is not None:
            elapsed = (
                f"{round((time.monotonic() - start) * 1000)}ms" if start else "?ms"
            )
            usage = getattr(response, "usage", None)
            usage_str = ""
            if usage:
                usage_str = (
                    f" | token_in={getattr(usage, 'input_token', '?')}"
                    f"tokens_out={getattr(usage, 'output_tokens', '?')}"
                )
            log_done(
                "LLM",
                f"<<< OpenAI call done (turn {self._turn_counter}) | {elapsed}{usage_str}",
            )

        else:
            elapsed = "unknown"

    async def on_tool_start(
        self,
        context: RunContextWrapper,
        agent: Agent,
        tool: Tool,
    ) -> None:
        tool_name = getattr(tool, "name", str(tool))
        log_start("TOOL", f">>> {tool_name} starting")
        context.context._tool_start_time = time.monotonic()

        workflow_id = getattr(context.context, "workflow_id", None)
        step_name = TOOL_TO_STEP.get(tool_name)

        if workflow_id and step_name:
            try:
                await advance_workflow(workflow_id, step_name, "in_progress")
            except Exception:
                pass

    async def on_tool_end(
        self, context: RunContextWrapper, agent: Agent, tool: Tool, result: Any
    ) -> None:
        tool_name = getattr(tool, "name", str(tool))
        start = getattr(context.context, "_tool_start_time", None)
        if start is not None:
            elapsed = (
                f"{round((time.monotonic() - start) * 1000)}ms" if start else "?ms"
            )
            status = "unknown"
            if isinstance(result, dict):
                status = result.get("status", "unknown")
            log_done("TOOL", f"<<< {tool_name} done | {elapsed} | status={status}")

            workflow_id = getattr(context.context, "workflow_id", None)
            step_name = TOOL_TO_STEP.get(tool_name)
            if workflow_id and step_name:
                step_status = "completed" if status == "success" else "failed"
                error_msg = None
                if status != "success" and isinstance(result, dict):
                    error_msg = result.get("error")
                try:
                    await advance_workflow(
                        workflow_id, step_name, step_status, error=error_msg
                    )
                except Exception:
                    pass

        else:
            elapsed = "unknown"
