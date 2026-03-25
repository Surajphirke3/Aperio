from enum import Enum


class MaterialType(str, Enum):
    PET = "PET"
    HDPE = "HDPE"
    PP = "PP"
    LDPE = "LDPE"
    PVC = "PVC"
    MIXED = "mixed"