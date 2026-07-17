from __future__ import annotations

from pydantic import BaseModel


class KBSearchRequest(BaseModel):
    query: str
    max_results: int = 5


class KBSearchResult(BaseModel):
    title: str
    content: str
    source: str
    relevance_score: float = 0.0


class KBSearchResponse(BaseModel):
    results: list[KBSearchResult]
    total_found: int
