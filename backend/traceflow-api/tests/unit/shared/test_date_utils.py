from datetime import date, timedelta
from src.shared.utils.dates import parse_relative_date


def test_parse_today():
    assert parse_relative_date("today") == date.today()


def test_parse_yesterday():
    assert parse_relative_date("yesterday") == date.today() - timedelta(days=1)


def test_parse_days_ago():
    assert parse_relative_date("3 days ago") == date.today() - timedelta(days=3)


def test_parse_weeks_ago():
    assert parse_relative_date("2 weeks ago") == date.today() - timedelta(weeks=2)


def test_parse_iso_format():
    assert parse_relative_date("2024-01-15") == date(2024, 1, 15)


def test_parse_invalid_defaults_today():
    assert parse_relative_date("gibberish") == date.today()
