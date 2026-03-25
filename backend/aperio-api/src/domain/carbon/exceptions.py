class CarbonDomainError(Exception):
    """Base exception for carbon domain errors."""
    pass


class UnsupportedMaterialError(CarbonDomainError):
    """Raised when a material type has no emission factor."""
    pass
