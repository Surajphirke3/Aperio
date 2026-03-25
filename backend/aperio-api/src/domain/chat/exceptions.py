class ChatDomainError(Exception):
    """Base exception for chat domain errors."""
    pass


class UnrecognizedIntentError(ChatDomainError):
    """Raised when the intent cannot be classified."""
    pass


class AmbiguousIntentError(ChatDomainError):
    """Raised when multiple intents are equally likely."""
    pass


class EntityExtractionError(ChatDomainError):
    """Raised when required entities cannot be extracted from input."""
    pass


class InsufficientDataError(ChatDomainError):
    """Raised when the user input lacks required information."""
    pass
