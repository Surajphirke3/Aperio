from .models import IntentType


def classify_intent_from_keywords(message: str) -> IntentType | None:
    """Pure keyword-based intent classification fallback.
    Used when LLM classification fails or for quick local classification.
    """
    message_lower = message.lower()

    purchase_keywords = ["bought", "purchased", "received", "procured", "sourced"]
    processing_keywords = ["processed", "washed", "sorted", "shredded", "extruded", "pelletized"]
    dispatch_keywords = ["dispatched", "shipped", "sent", "delivered", "sold"]
    query_keywords = ["how much", "how many", "what", "show", "list", "total", "average"]
    report_keywords = ["report", "summary", "overview", "breakdown", "analyze"]

    if any(kw in message_lower for kw in purchase_keywords):
        return IntentType.PURCHASE
    elif any(kw in message_lower for kw in processing_keywords):
        return IntentType.PROCESSING
    elif any(kw in message_lower for kw in dispatch_keywords):
        return IntentType.DISPATCH
    elif any(kw in message_lower for kw in report_keywords):
        return IntentType.REPORT
    elif any(kw in message_lower for kw in query_keywords):
        return IntentType.QUERY

    return None
