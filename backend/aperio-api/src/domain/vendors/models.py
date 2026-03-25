from pydantic import BaseModel
from typing import Optional


class Vendor(BaseModel):
    name: str
    total_kg: float = 0.0
    entry_count: int = 0