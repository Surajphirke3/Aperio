import json
import re
from typing import Any


def extract_json(raw: str) -> dict[str, Any]:
    """
    Robustly extract JSON from LLM output.
    Handles: plain JSON, JSON in markdown code blocks, JSON with trailing text.
    """
    # Strategy 1: Direct parse
    try:
        return json.loads(raw.strip())
    except json.JSONDecodeError:
        pass

    # Strategy 2: Extract from markdown code block
    code_block = re.search(r"```(?:json)?\s*([\s\S]*?)\s*```", raw)
    if code_block:
        try:
            return json.loads(code_block.group(1))
        except json.JSONDecodeError:
            pass

    # Strategy 3: Find first {...} block
    brace_match = re.search(r"\{[\s\S]*\}", raw)
    if brace_match:
        try:
            return json.loads(brace_match.group(0))
        except json.JSONDecodeError:
            pass

    # Fallback: return empty dict — caller handles missing fields
    return {}
