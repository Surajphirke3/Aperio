# Dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY pyproject.toml poetry.lock ./
RUN pip install poetry && poetry install --no-dev

COPY src/ src/

CMD ["uvicorn", "src.api.app:app", "--host", "0.0.0.0", "--port", "8000"]