# Qwen2.5-3B Fine-tuning & Deployment

Complete setup for fine-tuning Qwen2.5-3B model and deploying with FastAPI.

## Quick Start

### 1. Installation

```bash
# Install PyTorch with CUDA support
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118

# Install other dependencies
pip install -r requirements.txt
```

### 2. Prepare Training Data

**Option A: Create sample data**
```bash
python prepare_data.py --create_sample --output training_data.jsonl
```

**Option B: Convert your own data**

From CSV:
```bash
python prepare_data.py \
    --input data.csv \
    --format csv \
    --instruction_col "question" \
    --output_col "answer" \
    --output training_data.jsonl \
    --validate
```

From JSON:
```bash
python prepare_data.py \
    --input data.json \
    --format json \
    --output training_data.jsonl
```

**Option C: Generate synthetic teacher-refined data**
```bash
# Generate high-quality responses from a Teacher model (Featherless.ai)
# This uses the Qwen2.5-3B-Instruct model as a teacher for your local model.
python synthetic_data_gen.py \
    --prompts prompts.txt \
    --output training_data.jsonl \
    --api_key "YOUR_API_KEY"
```

**Data format (JSONL):**
```json
{"instruction": "What is Python?", "output": "Python is a programming language..."}
{"instruction": "How to use FastAPI?", "output": "FastAPI is a modern web framework..."}
```

### 3. Fine-tune the Model

```bash
python fine_tune_lora.py \
    --data_path training_data.jsonl \
    --output_dir ./qwen-finetuned-lora \
    --epochs 3 \
    --batch_size 4 \
    --learning_rate 2e-4
```

**Memory-efficient (for 8GB GPU):**
```bash
python fine_tune_lora.py \
    --data_path training_data.jsonl \
    --output_dir ./qwen-finetuned-lora \
    --epochs 3 \
    --batch_size 1 \
    --learning_rate 2e-4 \
    --max_length 256
```

### 4. Start the API Server

**Update server configuration:**

Edit `fastapi_server.py` line 286-287:
```python
BASE_MODEL = "Qwen/Qwen2.5-3B"
LORA_WEIGHTS = "./qwen-finetuned-lora"
```

**Start server:**
```bash
python fastapi_server.py --host 0.0.0.0 --port 8000
```

### 5. Test the Model

**Interactive mode:**
```bash
python client.py --interactive
```

**Single prompt:**
```bash
python client.py --prompt "What is FastAPI?"
```

**Batch processing:**
```bash
# Create prompts.txt with one prompt per line
python client.py --batch prompts.txt --output results.json
```

**Using curl:**
```bash
curl -X POST "http://localhost:8000/generate" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Explain what is Python",
    "max_length": 256,
    "temperature": 0.7
  }'
```

## API Endpoints

### POST /generate
Generate text from a prompt

**Request:**
```json
{
  "prompt": "What is FastAPI?",
  "max_length": 512,
  "temperature": 0.7,
  "top_p": 0.9,
  "top_k": 50,
  "num_return_sequences": 1
}
```

**Response:**
```json
{
  "generated_text": "FastAPI is a modern, fast web framework...",
  "prompt": "What is FastAPI?",
  "timestamp": "2024-03-25T10:30:00",
  "model_info": {
    "base_model": "Qwen/Qwen2.5-3B",
    "lora_weights": "./qwen-finetuned-lora"
  }
}
```

### GET /health
Check server health

### GET /model_info
Get model configuration

### Interactive API Docs
Visit `http://localhost:8000/docs` for Swagger UI

## Fine-tuning Parameters

### LoRA Configuration
- **r** (rank): 16-64 (higher = more capacity, more memory)
- **lora_alpha**: Usually 2x the rank
- **lora_dropout**: 0.05-0.1

### Training Settings
- **Learning rate**: 1e-4 to 5e-4
- **Batch size**: 1-8 (depends on GPU memory)
- **Epochs**: 3-5 for most tasks
- **Max length**: 256-512 tokens

## Memory Requirements

| GPU Memory | Batch Size | Max Length | Config |
|------------|-----------|------------|--------|
| 8GB        | 1-2       | 256        | Use gradient accumulation |
| 16GB       | 4-8       | 512        | Standard LoRA |
| 24GB+      | 8-16      | 1024       | Can use higher rank |

## Project Structure

```
.
├── fine_tune_lora.py      # Fine-tuning script
├── fastapi_server.py       # API server
├── client.py              # Client for testing
├── prepare_data.py        # Data preparation
├── requirements.txt       # Dependencies
├── training_data.jsonl    # Training data
└── qwen-finetuned-lora/   # Fine-tuned model
    ├── adapter_config.json
    ├── adapter_model.bin
    └── ...
```

## Common Issues

### Out of Memory
- Reduce `batch_size` to 1
- Reduce `max_length` to 256
- Increase `gradient_accumulation_steps`

### Slow Training
- Check GPU utilization: `nvidia-smi`
- Increase batch size if memory allows
- Use gradient accumulation for effective larger batches

### Poor Results
- Need more training data (100+ examples minimum)
- Increase training epochs
- Adjust learning rate
- Increase LoRA rank

### Model Not Loading
- Check paths in `fastapi_server.py`
- Ensure model was saved correctly
- Check available disk space

## Production Deployment

### Docker
```dockerfile
FROM nvidia/cuda:11.8.0-runtime-ubuntu22.04
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["python", "fastapi_server.py"]
```

### Build and run:
```bash
docker build -t qwen-api .
docker run --gpus all -p 8000:8000 qwen-api
```

### Environment Variables
```bash
export BASE_MODEL="Qwen/Qwen2.5-3B"
export LORA_WEIGHTS="./qwen-finetuned-lora"
export PORT=8000
```

## Performance Optimization

1. **Merge LoRA weights** (done automatically in server)
2. **Use FP16** (enabled by default)
3. **Batch requests** when possible
4. **Cache common prompts**

## Monitoring

Add logging:
```python
import logging
logging.basicConfig(level=logging.INFO)
```

Track metrics:
- Requests per second
- Average latency
- GPU utilization
- Memory usage

## Next Steps

1. ✅ Install dependencies
2. ✅ Prepare training data
3. ✅ Fine-tune model
4. ✅ Start API server
5. ✅ Test with client
6. 🔄 Collect user feedback
7. 🔄 Iterate on training data
8. 🔄 Deploy to production

## Support

For issues:
1. Check GPU memory with `nvidia-smi`
2. Verify CUDA installation: `python -c "import torch; print(torch.cuda.is_available())"`
3. Review server logs
4. Test with sample data first

## License

Follow Qwen model's license and usage terms.
