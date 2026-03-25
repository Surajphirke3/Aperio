import numpy as np
from sentence_transformers import SentenceTransformer
from src.config.settings import settings

# Loaded once at startup — ~80MB, fits in any server
_model: SentenceTransformer | None = None


def get_embedding_model() -> SentenceTransformer:
    global _model
    if _model is None:
        _model = SentenceTransformer(settings.embedding_model)
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

    query_embedding = model.encode(query)
    user_messages = [m for m in history if m["role"] == "user"]

    if not user_messages:
        return []

    corpus = [m["content"] for m in user_messages]
    corpus_embeddings = model.encode(corpus)

    scores = [cosine_similarity(query_embedding, emb) for emb in corpus_embeddings]
    top_indices = np.argsort(scores)[::-1][:k]

    return [user_messages[i] for i in top_indices if scores[i] > 0.3]  # threshold