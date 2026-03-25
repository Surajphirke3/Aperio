class VendorDomainError(Exception):
    """Base exception for vendor domain errors."""
    pass


class VendorNotFoundError(VendorDomainError):
    """Raised when a vendor cannot be found."""
    pass
