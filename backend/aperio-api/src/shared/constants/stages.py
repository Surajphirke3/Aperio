from enum import Enum


class ProcessStage(str, Enum):
    PURCHASE = "purchase"
    SORTING = "sorting"
    WASHING = "washing"
    SHREDDING = "shredding"
    EXTRUSION = "extrusion"
    PELLETIZING = "pelletizing"
    DISPATCH = "dispatch"
