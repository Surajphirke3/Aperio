from typing import Any, Optional
import re


def validate_positive_number(value: Any, field_name: str = "value") -> float:
    """Validate that a value is a positive number."""
    try:
        num = float(value)
    except (TypeError, ValueError):
        raise ValueError(f"{field_name} must be a number, got: {value}")
    if num <= 0:
        raise ValueError(f"{field_name} must be positive, got: {num}")
    return num


def validate_non_empty_string(value: Any, field_name: str = "value") -> str:
    """Validate that a value is a non-empty string."""
    if not isinstance(value, str) or not value.strip():
        raise ValueError(f"{field_name} must be a non-empty string")
    return value.strip()


def validate_enum_value(value: str, allowed: list[str], field_name: str = "value") -> str:
    """Validate that a value is one of the allowed enum values."""
    normalized = value.strip().upper()
    allowed_upper = [a.upper() for a in allowed]
    if normalized not in allowed_upper:
        raise ValueError(f"{field_name} must be one of {allowed}, got: {value}")
    return allowed[allowed_upper.index(normalized)]


def sanitize_input(text: str, max_length: int = 1000) -> str:
    """Sanitize user input for safe processing.
    
    - Strips control characters
    - Limits length
    - Removes potential prompt injection patterns
    """
    if not isinstance(text, str):
        raise ValueError("Input must be a string")
    
    # Limit length
    text = text[:max_length]
    
    # Remove control characters except newlines and tabs
    text = "".join(char for char in text if char == "\n" or char == "\t" or (ord(char) >= 32 and ord(char) <= 126) or ord(char) > 127)
    
    # Remove common prompt injection patterns
    dangerous_patterns = [
        r"ignore previous instructions",
        r"ignore all prior",
        r"system prompt",
        r"you are now",
        r"DAN mode",
        r"developer mode",
    ]
    for pattern in dangerous_patterns:
        text = re.sub(pattern, "[REMOVED]", text, flags=re.IGNORECASE)
    
    return text.strip()
