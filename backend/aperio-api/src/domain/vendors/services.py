from src.infrastructure.db.repositories.vendor_repo import VendorRepository


class VendorService:
    """Vendor query operations."""

    def __init__(self):
        self.repo = VendorRepository()

    async def get_vendors(self) -> list[dict]:
        return await self.repo.get_all()