from __future__ import annotations

from datetime import datetime
from typing import Literal, Any
from pydantic import BaseModel


class WorkflowStep(BaseModel):
    step_name: str
    status: Literal["pending", "in_progress", "completed", "failed"]
    started_at: datetime | None = None
    completed_at: datetime | None = None
    error: str | None = None


class WorkflowState(BaseModel):
    workflow_id: str
    workflow_type: Literal["onboarding"]
    current_step: str
    steps: list[WorkflowStep]
    status: Literal["in_progress", "completed", "failed"]
    failed_step: str | None = None
    created_by: str
    created_at: datetime
    updated_at: datetime
    payload: dict[str, Any] | None = None

class WorkflowCreateRequest(BaseModel):
    workflow_type: Literal["onboarding"]
    created_by: str
    payload: dict[str, Any]

class WorkflowUpdateRequest(BaseModel):
    current_step: str
    status: Literal["in_progress", "completed", "failed"]
    steps: list[WorkflowStep]
    failed_step: str | None = None
    payload: dict[str, Any] | None = None