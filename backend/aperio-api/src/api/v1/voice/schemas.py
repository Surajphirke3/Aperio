from pydantic import BaseModel


class TranscribeResponse(BaseModel):
    text: str
    success: bool = True
