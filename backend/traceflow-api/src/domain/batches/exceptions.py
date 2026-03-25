class BatchDomainError(Exception):
    """Base exception for batch domain errors."""
    pass


class BatchNotFoundError(BatchDomainError):
    """Raised when a batch cannot be found."""
    pass


class InvalidStageTransitionError(BatchDomainError):
    """Raised when an invalid stage transition is attempted."""
    pass


class DuplicateBatchError(BatchDomainError):
    """Raised when a batch with the same ID already exists."""
    pass
