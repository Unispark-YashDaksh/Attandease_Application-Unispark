from __future__ import annotations

from datetime import datetime
from typing import Literal, Any
from pydantic import BaseModel

WorkflowType = Literal["onboarding", "onboarding_v2"]


class WorkflowStep(BaseModel):
    step_name: str
    status: Literal[
        "pending", "in_progress", "completed", "failed", "waiting_for_input"
    ]
    started_at: datetime | None = None
    completed_at: datetime | None = None
    error: str | None = None


class WorkflowState(BaseModel):
    workflow_id: str
    workflow_type: WorkflowType
    current_step: str
    steps: list[WorkflowStep]
    status: Literal["in_progress", "completed", "failed", "waiting_for_input"]
    failed_step: str | None = None
    created_by: str
    created_at: datetime
    updated_at: datetime
    payload: dict[str, Any] | None = None
    pending_question: str | None = None
    agent_conversation: list[dict[str, Any]] | None = None


class WorkflowCreateRequest(BaseModel):
    workflow_type: WorkflowType
    created_by: str
    payload: dict[str, Any]


class WorkflowUpdateRequest(BaseModel):
    current_step: str
    status: Literal["in_progress", "completed", "failed"]
    steps: list[WorkflowStep]
    failed_step: str | None = None
    payload: dict[str, Any] | None = None


class AgentWorkflowContext:
    """Context passed to the agent so hooks can update workflow state."""

    def __init__(self, workflow_id: str | None = None):
        self.workflow_id = workflow_id
        self._llm_start_time: float | None = None
        self._tool_start_time: float | None = None
