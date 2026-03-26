FROM nvidia/cuda:11.8.0-runtime-ubuntu22.04

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    python3-pip \
    python3-dev \
    git \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install dependencies
COPY requirements.txt .
RUN pip3 install --no-cache-dir -r requirements.txt

# Copy application files
COPY . .

# Expose port
EXPOSE 8000

# Set environment variables
ENV BASE_MODEL="Qwen/Qwen2.5-3B"
ENV LORA_WEIGHTS="./qwen-finetuned-lora"
ENV PORT=8000

# Run the application
CMD ["python3", "fastapi_server.py"]
