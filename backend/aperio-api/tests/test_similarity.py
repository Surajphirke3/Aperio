import pytest
import numpy as np
from src.domain.chat.similarity import cosine_similarity
from src.shared.utils.json_parser import extract_json


class TestCosineSimilarity:
    def test_identical_vectors(self):
        a = np.array([1.0, 0.0, 0.0])
        b = np.array([1.0, 0.0, 0.0])
        assert abs(cosine_similarity(a, b) - 1.0) < 1e-6

    def test_orthogonal_vectors(self):
        a = np.array([1.0, 0.0, 0.0])
        b = np.array([0.0, 1.0, 0.0])
        assert abs(cosine_similarity(a, b)) < 1e-6

    def test_opposite_vectors(self):
        a = np.array([1.0, 0.0])
        b = np.array([-1.0, 0.0])
        assert abs(cosine_similarity(a, b) - (-1.0)) < 1e-6

    def test_similar_vectors(self):
        a = np.array([1.0, 1.0, 0.0])
        b = np.array([1.0, 0.9, 0.1])
        score = cosine_similarity(a, b)
        assert score > 0.9

    def test_zero_vector_safety(self):
        a = np.array([0.0, 0.0, 0.0])
        b = np.array([1.0, 0.0, 0.0])
        # Should not raise — epsilon prevents division by zero
        result = cosine_similarity(a, b)
        assert isinstance(result, float)


class TestJsonParser:
    def test_pure_json(self):
        result = extract_json('{"intent": "purchase"}')
        assert result == {"intent": "purchase"}

    def test_json_in_code_block(self):
        text = '```json\n{"intent": "query"}\n```'
        result = extract_json(text)
        assert result == {"intent": "query"}

    def test_json_in_text(self):
        text = 'Here is the result: {"intent": "dispatch", "confidence": 0.9} end.'
        result = extract_json(text)
        assert result["intent"] == "dispatch"

    def test_invalid_json_returns_empty(self):
        result = extract_json("no json here")
        assert result == {}

    def test_empty_string(self):
        result = extract_json("")
        assert result == {}