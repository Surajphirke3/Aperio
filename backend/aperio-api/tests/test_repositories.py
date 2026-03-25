import pytest
from unittest.mock import AsyncMock, patch, MagicMock
from src.domain.batches.services import BatchService


class TestBatchServiceAnomalies:
    def test_no_anomaly_low_loss(self):
        service = BatchService.__new__(BatchService)
        service.repo = MagicMock()
        batch = {"id": "b1", "quantity_kg": 1000, "loss_kg": 20, "stage": "processing"}
        anomalies = service.detect_anomalies(batch)
        assert len(anomalies) == 0

    def test_anomaly_high_loss(self):
        service = BatchService.__new__(BatchService)
        service.repo = MagicMock()
        batch = {"id": "b2", "quantity_kg": 1000, "loss_kg": 80, "stage": "sorting"}
        anomalies = service.detect_anomalies(batch)
        assert len(anomalies) == 1
        assert anomalies[0]["metric"] == "loss_percentage"
        assert anomalies[0]["value"] == 8.0

    def test_no_anomaly_zero_loss(self):
        service = BatchService.__new__(BatchService)
        service.repo = MagicMock()
        batch = {"id": "b3", "quantity_kg": 500, "loss_kg": 0, "stage": "collection"}
        anomalies = service.detect_anomalies(batch)
        assert len(anomalies) == 0

    def test_no_anomaly_none_loss(self):
        service = BatchService.__new__(BatchService)
        service.repo = MagicMock()
        batch = {"id": "b4", "quantity_kg": 500, "loss_kg": None, "stage": "dispatch"}
        anomalies = service.detect_anomalies(batch)
        assert len(anomalies) == 0


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

    def test_days_ago(self):
        from src.shared.utils.dates import parse_relative_date
        from datetime import datetime, timedelta
        result = parse_relative_date("3 days ago")
        expected = (datetime.utcnow() - timedelta(days=3)).date().isoformat()
        assert result == expected

    def test_no_date(self):
        from src.shared.utils.dates import parse_relative_date
        result = parse_relative_date("some random text")
        assert result is None