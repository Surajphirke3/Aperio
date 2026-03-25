import numpy as np
from sentence_transformers import SentenceTransformer

from src.config.settings import settings

# Loaded once at startup — ~80MB, fits in any server
_model: SentenceTransformer | None = None


def get_embedding_model() -> SentenceTransformer:
    global _model
    if _model is None:
        try:
            _model = SentenceTransformer(settings.embedding_model)
        except Exception:
            _model = None
    return _model


def cosine_similarity(a: np.ndarray, b: np.ndarray) -> float:
    return float(np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b) + 1e-10))


async def get_similar_context(
    query: str,
    history: list[dict],
    top_k: int | None = None,
) -> list[dict]:
    """Returns top-k most semantically similar past messages to the query.
    
    Used to inject relevant long-term context without blowing the LLM context window.
    Only user messages are compared — assistant messages are included as pairs.
    """
    if not history:
        return []

    k = top_k or settings.similarity_top_k
    model = get_embedding_model()
    user_messages = [m for m in history if m["role"] == "user"]

    if not user_messages:
        return []

    corpus = [m["content"] for m in user_messages]
    if model is None:
        scores = [_token_overlap_score(query, message) for message in corpus]
    else:
        query_embedding = model.encode(query)
        corpus_embeddings = model.encode(corpus)
        scores = [cosine_similarity(query_embedding, emb) for emb in corpus_embeddings]
    top_indices = np.argsort(scores)[::-1][:k]

    threshold = 0.3 if model is not None else 0.2
    return [user_messages[i] for i in top_indices if scores[i] > threshold]


def _token_overlap_score(query: str, candidate: str) -> float:
    query_tokens = set(query.lower().split())
    candidate_tokens = set(candidate.lower().split())
    if not query_tokens or not candidate_tokens:
        return 0.0
    intersection = len(query_tokens & candidate_tokens)
    union = len(query_tokens | candidate_tokens)
    return intersection / union
