from __future__ import annotations

import json
import os
from pathlib import Path
from typing import Any

from app.config import settings
from app.schemas.kb import KBSearchResult
from app.schemas.tool_result import ToolResult


def _load_kb_documents() -> list[dict[str, Any]]:
    data_dir = Path(settings.kb_data_dir)
    docs: list[dict[str, Any]] = []
    if not data_dir.exists():
        return docs
    for fpath in data_dir.glob("*.json"):
        try:
            with open(fpath, encoding="utf-8") as f:
                content = json.load(f)
                if isinstance(content, list):
                    docs.extend(content)
                else:
                    docs.append(content)
        except Exception:
            pass

    return docs


async def query_knowledge_base(query: str, max_results: int = 5) -> ToolResult:
    docs = _load_kb_documents()

    if not docs:
        return ToolResult(
            status="success",
            tool_name="query_knowledge_base",
            data={
                "results": [],
                "total_found": 0,
                "message": "No KB document loaded. Add markdown or JSON files to kb_data/.",
            },
        )

    query_lower = query.lower()
    query_terms = query_lower.split()
    scored: list[tuple[float, dict[str, Any]]] = []

    for doc in docs:
        title = doc.get("title", "")
        content = doc.get("content", "")
        combined = (title + " " + content).lower()
        score = sum(1 for term in query_terms if term in combined) / max(
            len(query_terms), 1
        )
        if score > 0:
            scored.append((score, doc))

    scored.sort(key=lambda x: x[0], reverse=True)
    results = scored[:max_results]

    return ToolResult(
        status="success",
        tool_name="query_knowledge_base",
        data={
            "results": [
                {
                    "title": r[1].get("title", "Untitled"),
                    "content": r[1].get("content", "")[:1000],
                    "source": r[1].get("source", ""),
                    "relevance_score": r[0],
                }
                for r in results
            ],
            "total_found": len(results),
        },
    )
