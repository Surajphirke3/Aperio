class BatchNotFoundError(Exception):
    def __init__(self, batch_id: str):
        self.batch_id = batch_id
        super().__init__(f"Batch not found: {batch_id}")


class BatchValidationError(Exception):
    def __init__(self, message: str):
        super().__init__(message)


class AnomalyDetectionError(Exception):
    def __init__(self, message: str):
        super().__init__(message)