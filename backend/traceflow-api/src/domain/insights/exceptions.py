class InsightDomainError(Exception):
    """Base exception for insight domain errors."""
    pass


class InsightGenerationError(InsightDomainError):
    """Raised when insight generation fails."""
    pass
