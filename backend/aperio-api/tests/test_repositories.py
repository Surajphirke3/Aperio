import pytest
from src.shared.utils.json_parser import extract_json


class TestDateParser:
    def test_yesterday(self):
        from src.shared.utils.dates import parse_relative_date
        from datetime import datetime, timedelta
        result = parse_relative_date("yesterday")
        expected = (datetime.utcnow() - timedelta(days=1)).date().isoformat()
        assert result == expected

    def test_today(self):
        from src.shared.utils.dates import parse_relative_date
        from datetime import datetime
        result = parse_relative_date("today")
        expected = datetime.utcnow().date().isoformat()
        assert result == expected

    def test_last_week(self):
        from src.shared.utils.dates import parse_relative_date
        result = parse_relative_date("last week")
        assert result is not None

    def test_2_days_ago(self):
        from src.shared.utils.dates import parse_relative_date
        from datetime import datetime, timedelta
        result = parse_relative_date("2 days ago")
        expected = (datetime.utcnow() - timedelta(days=2)).date().isoformat()
        assert result == expected


class TestJSONParser:
    def test_direct_json(self):
        text = '{"intent": "purchase", "material": "PET"}'
        result = extract_json(text)
        assert result["intent"] == "purchase"
        assert result["material"] == "PET"

    def test_markdown_code_block(self):
        text = '```json\n{"intent": "query"}\n```'
        result = extract_json(text)
        assert result["intent"] == "query"

    def test_embedded_json(self):
        text = 'Here is the result: {"intent": "dispatch"} thanks'
        result = extract_json(text)
        assert result["intent"] == "dispatch"

    def test_invalid_json_fallback(self):
        text = "This is not JSON at all"
        result = extract_json(text)
        assert result == {}
