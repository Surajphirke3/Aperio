from typing import Any, Optional


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
