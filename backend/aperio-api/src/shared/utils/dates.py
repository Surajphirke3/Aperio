from datetime import datetime, timedelta, date
import re


def today_iso() -> str:
    return datetime.utcnow().date().isoformat()


def parse_relative_date(text: str) -> str | None:
    """Convert relative date expressions to ISO 8601 date strings.
    
    Handles: "yesterday", "today", "last week", "2 days ago", "last month", etc.
    Returns ISO date string or None if no date expression found.
    """
    text = text.lower().strip()
    now = datetime.utcnow()

    if "today" in text:
        return now.date().isoformat()

    if "yesterday" in text:
        return (now - timedelta(days=1)).date().isoformat()

    if "last week" in text:
        return (now - timedelta(weeks=1)).date().isoformat()

    if "last month" in text:
        if now.month == 1:
            return now.replace(year=now.year - 1, month=12, day=1).date().isoformat()
        return now.replace(month=now.month - 1, day=1).date().isoformat()

    days_ago = re.search(r"(\d+)\s*days?\s*ago", text)
    if days_ago:
        return (now - timedelta(days=int(days_ago.group(1)))).date().isoformat()

    weeks_ago = re.search(r"(\d+)\s*weeks?\s*ago", text)
    if weeks_ago:
        return (now - timedelta(weeks=int(weeks_ago.group(1)))).date().isoformat()

    return None
