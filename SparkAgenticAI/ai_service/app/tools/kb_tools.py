from __future__ import annotations

from typing import Any
from agents import function_tool
from app.service import kb_client


@function_tool
async def query_knowledge_base(
    query: str,
    max_results: int = 5,
) -> dict[str, Any]:
    result = await kb_client.query_knowledge_base(
        query=query,
        max_results=max_results,
    )
    return result.model_dump()
