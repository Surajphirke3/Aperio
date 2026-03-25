from src.domain.chat.intent_classifier import classify_intent_from_keywords
from src.domain.chat.models import IntentType


def test_purchase_intent():
    assert classify_intent_from_keywords("Bought 300kg PET from Vendor A") == IntentType.PURCHASE


def test_processing_intent():
    assert classify_intent_from_keywords("Processed 200kg through washing") == IntentType.PROCESSING


def test_dispatch_intent():
    assert classify_intent_from_keywords("Dispatched 150kg to warehouse") == IntentType.DISPATCH


def test_query_intent():
    assert classify_intent_from_keywords("How much PET was processed?") == IntentType.QUERY


def test_report_intent():
    assert classify_intent_from_keywords("Give me a monthly summary") == IntentType.REPORT


def test_unknown_returns_none():
    assert classify_intent_from_keywords("hello world") is None
