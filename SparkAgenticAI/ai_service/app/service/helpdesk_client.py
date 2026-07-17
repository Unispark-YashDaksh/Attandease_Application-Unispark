from __future__ import annotations

import httpx
from app.config import settings
from app.schemas.tool_result import ToolResult
from app.service.agent_logger import async_http_call_timer


async def create_ticket(
    summary: str,
    description: str,
    requester_name: str,
    requester_email: str | None = None,
    category: str = "IT",
    subcategory: str | None = None,
) -> ToolResult:
    tool_name = "order_laptop" if category == "IT" else "order_id_card"
    url = f"{settings.hrms_api_base_url}/api/addTicket"
    async with async_http_call_timer("POST", url) as timer:
        try:
            fields: dict = {
                "category": category,
                "Title": summary,
                "IssueDescription": description,
            }
            if requester_email:
                fields["RequestedByEmail"] = requester_email
            if subcategory:
                fields["Subcategory"] = subcategory
            async with httpx.AsyncClient(timeout=30) as client:
                resp = await client.post(
                    url,
                    json=fields,
                )
                timer["status"] = resp.status_code
                if resp.status_code == 201:
                    data = resp.json().get("data", {})
                    return ToolResult(
                        status="success",
                        tool_name=tool_name,
                        data={
                            "ticket_id": data.get("id") or data.get("ticket_id"),
                            "status": "open",
                        },
                        next_action=None,
                    )
                error_data = resp.json()
                return ToolResult(
                    status="error",
                    tool_name=tool_name,
                    error=error_data.get(
                        "error", f"Backend returned {resp.status_code}"
                    ),
                    next_action="retry_or_escalate",
                )
        except httpx.TimeoutException:
            timer["status"] = "timeout"
            return ToolResult(
                status="error",
                tool_name=tool_name,
                error="Backend service timed out",
                next_action="retry_later",
            )

        except Exception as e:
            timer["status"] = "exception"
            return ToolResult(
                status="error",
                tool_name=tool_name,
                error=str(e),
                next_action="retry_or_escalate",
            )
