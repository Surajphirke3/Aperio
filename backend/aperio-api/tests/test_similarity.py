import pytest
import numpy as np
from src.domain.chat.similarity import cosine_similarity


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
        b = np.array([1.0, 1.0, 1.0])
        score = cosine_similarity(a, b)
        assert score == 0.0
