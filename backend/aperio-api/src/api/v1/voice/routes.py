from fastapi import APIRouter, UploadFile, File, HTTPException

from .schemas import TranscribeResponse
from src.infrastructure.ai.groq_client import GroqAdapter

router = APIRouter(prefix="/voice", tags=["voice"])
_groq = GroqAdapter()


@router.post("/transcribe", response_model=TranscribeResponse)
async def transcribe_audio(
    file: UploadFile = File(...),
) -> TranscribeResponse:
    if file.content_type not in ("audio/webm", "audio/wav", "audio/mp4", "audio/mpeg"):
        raise HTTPException(status_code=400, detail="Unsupported audio format")

    audio_bytes = await file.read()
    if len(audio_bytes) > 25 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="Audio file too large (max 25MB)")

    text = await _groq.transcribe(audio_bytes, filename=file.filename or "audio.webm")
    return TranscribeResponse(text=text, success=True)
