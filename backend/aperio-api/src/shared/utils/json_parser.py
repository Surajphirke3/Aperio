import json
import re


def extract_json(text: str) -> dict:
    """Robust JSON extraction from LLM output.
    
    Handles common LLM output patterns:
    1. Pure JSON string
    2. JSON wrapped in markdown code blocks
    3. JSON embedded in natural language text
    """
    text = text.strip()

    # Try direct parse first
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass

    # Try extracting from markdown code blocks
    code_block_match = re.search(r"```(?:json)?\s*\n?(.*?)\n?```", text, re.DOTALL)
    if code_block_match:
        try:
            return json.loads(code_block_match.group(1).strip())
        except json.JSONDecodeError:
            pass

    # Try finding JSON object in text
    brace_match = re.search(r"\{.*\}", text, re.DOTALL)
    if brace_match:
        try:
            return json.loads(brace_match.group(0))
        except json.JSONDecodeError:
            pass

    # Last resort: return empty dict
    return {}