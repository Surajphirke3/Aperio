from enum import Enum


class ProcessStage(str, Enum):
    COLLECTION = "collection"
    SORTING = "sorting"
    PROCESSING = "processing"
    OUTPUT = "output"
    DISPATCH = "dispatch"