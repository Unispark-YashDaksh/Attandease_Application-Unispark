from __future__ import annotations

import logging
import time
from contextlib import asynccontextmanager, contextmanager
from typing import AsyncIterator, Iterator

from app.config import settings

TRACE_LOG = logging.getLogger("agent_trace")


def setup_agent_logging() -> None:
    if not settings.agent_debug_logging:
        TRACE_LOG.setLevel(logging.WARNING)
        return
    TRACE_LOG.setLevel(logging.DEBUG)
    if not TRACE_LOG.handlers:
        handler = logging.StreamHandler()
        handler.setFormatter(
            logging.Formatter(
                "%(asctime)s | %(levelname)-5s | %(message)s",
                datefmt="%Y-%m-%d %H:%M:%S",
            )
        )
        TRACE_LOG.addHandler(handler)
        TRACE_LOG.propagate = False


def log_start(tag: str, msg: str) -> None:
    TRACE_LOG.debug(f"[{tag}] >>> {msg}")


def log_done(tag: str, msg: str) -> None:
    TRACE_LOG.debug(f"[{tag}] <<< {msg}")


@contextmanager
def http_call_timer(method: str, url: str) -> Iterator[dict]:
    label = f"{method} {url}"
    log_start("HTTP", f"{label} starting")
    start = time.monotonic()
    result: dict = {"status": None}
    try:
        yield result
    finally:
        elapsed_ms = round((time.monotonic() - start) * 1000)
        status = result.get("status", "error")
        log_done("HTTP", f"{label} done | {elapsed_ms}ms | {status}")


@asynccontextmanager
async def async_http_call_timer(method: str, url: str) -> AsyncIterator[dict]:
    label = f"{method} {url}"
    log_start("HTTP", f"{label} starting")
    start = time.monotonic()
    result: dict = {"status": None}
    try:
        yield result
    finally:
        elapsed_ms = round((time.monotonic() - start) * 1000)
        status = result.get("status", "error")
        log_done("HTTP", f"{label} done | {elapsed_ms}ms | {status}")


setup_agent_logging()
