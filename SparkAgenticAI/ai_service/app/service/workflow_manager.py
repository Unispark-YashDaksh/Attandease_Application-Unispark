from __future__ import annotations

import json
import uuid
from datetime import datetime, timezone
from typing import Any, Literal

import httpx
from app.config import settings
from app.schemas.workflow import (
    WorkflowCreateRequest,
    WorkflowState,
    WorkflowStep,
    WorkflowUpdateRequest,
)

_active_workflows: dict[str, WorkflowState] = {}

WorkflowType = Literal["onboarding", "onboarding_v2"]

StepStatus = Literal[
    "pending", "in_progress", "completed", "failed", "waiting_for_input"
]


async def create_workflow(
    workflow_type: WorkflowType,
    created_by: str,
    payload: dict[str, Any],
    steps: list[str],
) -> WorkflowState:
    workflow_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc)
    state = WorkflowState(
        workflow_id=workflow_id,
        workflow_type=workflow_type,
        current_step=steps[0] if steps else "",
        steps=[WorkflowStep(step_name=s, status="pending") for s in steps],
        status="in_progress",
        failed_step=None,
        created_by=created_by,
        created_at=now,
        updated_at=now,
        payload=payload,
    )
    _active_workflows[workflow_id] = state

    try:
        async with httpx.AsyncClient(timeout=5) as client:
            req = WorkflowCreateRequest(
                workflow_type=workflow_type, created_by=created_by, payload=payload
            )
            await client.post(
                f"{settings.hrms_api_base_url}/api/workflows",
                json=req.model_dump(mode="json"),
            )
    except Exception:
        pass

    return state


async def advance_workflow(
    workflow_id: str,
    step_name: str,
    step_status: StepStatus,
    error: str | None = None,
    payload: dict[str, Any] | None = None,
) -> WorkflowState | None:
    state = _active_workflows.get(workflow_id)
    if not state:
        return None

    now = datetime.now(timezone.utc)
    for step in state.steps:
        if step.step_name == step_name:
            step.status = step_status
            step.completed_at = now if step_status in ("completed", "failed") else None
            step.error = error
    all_done = all(s.status == "completed" for s in state.steps)
    any_failed = any(s.status == "failed" for s in state.steps)

    state.status = (
        "completed" if all_done else ("failed" if any_failed else "in_progress")
    )
    state.failed_step = step_name if step_status == "failed" else state.failed_step
    state.updated_at = now
    if payload:
        state.payload = {**(state.payload or {}), **payload}

    current_idx = -1
    for i, s in enumerate(state.steps):
        if s.step_name == step_name:
            current_idx = i
            break
    if current_idx < len(state.steps) - 1 and step_status == "completed":
        state.current_step = state.steps[current_idx + 1].step_name
        state.steps[current_idx + 1].status = "in_progress"
        state.steps[current_idx + 1].started_at = now

    try:
        async with httpx.AsyncClient(timeout=5) as client:
            req = WorkflowUpdateRequest(
                current_step=state.current_step,
                status=state.status,
                steps=state.steps,
                failed_step=state.failed_step,
                payload=state.payload,
            )
            await client.put(
                f"{settings.hrms_api_base_url}/api/updateWorkflow/{workflow_id}",
                json=req.model_dump(mode="json"),
            )
    except Exception:
        pass

    return state


async def save_workflow_conversation(
    workflow_id: str,
    pending_question: str,
    conversation: list[dict[str, Any]],
) -> WorkflowState | None:
    state = _active_workflows.get(workflow_id)
    if not state:
        return None
    now = datetime.now(timezone.utc)
    state.pending_question = pending_question
    state.agent_conversation = conversation
    state.status = "in_progress"
    state.updated_at = now
    try:
        async with httpx.AsyncClient(timeout=5) as client:
            await client.put(
                f"{settings.hrms_api_base_url}/api/updateWorkflow/{workflow_id}",
                json={
                    "current_step": state.current_step,
                    "status": state.status,
                    "failed_step": None,
                    "payload": state.payload,
                    "pending_question": pending_question,
                    "agent_conversation": json.dumps(conversation),
                },
            )
    except Exception:
        pass
    return state


async def resume_workflow(
    workflow_id: str,
    admin_reply: str,
) -> WorkflowState | None:
    state = _active_workflows.get(workflow_id)
    if not state:
        try:
            async with httpx.AsyncClient(timeout=5) as client:
                resp = await client.get(
                    f"{settings.hrms_api_base_url}/api/workflows/{workflow_id}"
                )
                if resp.status_code == 200:
                    data = resp.json()
                    state = WorkflowState(**data)
                    _active_workflows[workflow_id] = state
        except Exception:
            pass

    if not state:
        return None

    state.pending_question = None
    state.status = "in_progress"
    state.updated_at = datetime.now(timezone.utc)

    return state


async def get_workflow(workflow_id: str) -> WorkflowState | None:
    state = _active_workflows.get(workflow_id)
    if state:
        return state

    try:
        async with httpx.AsyncClient(timeout=5) as client:
            resp = await client.get(
                f"{settings.hrms_api_base_url}/api/workflows/{workflow_id}"
            )
            if resp.status_code == 200:
                data = resp.json()
                state = WorkflowState(**data)
                _active_workflows[workflow_id] = state
                return state
    except Exception:
        pass

    return None
