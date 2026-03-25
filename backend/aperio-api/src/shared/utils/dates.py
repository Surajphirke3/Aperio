from datetime import date, timedelta


def parse_relative_date(value: str) -> date:
    """Parse relative date strings like 'today', 'yesterday', '3 days ago' into ISO dates."""
    value = value.strip().lower()

    if value == "today":
        return date.today()
    elif value == "yesterday":
        return date.today() - timedelta(days=1)
    elif value.endswith("days ago"):
        try:
            days = int(value.split()[0])
            return date.today() - timedelta(days=days)
        except (ValueError, IndexError):
            pass
    elif value.endswith("week ago") or value.endswith("weeks ago"):
        try:
            weeks = int(value.split()[0])
            return date.today() - timedelta(weeks=weeks)
        except (ValueError, IndexError):
            pass

    # Try ISO format parse
    try:
        return date.fromisoformat(value)
    except ValueError:
        return date.today()
