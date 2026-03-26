# Fine-Tuning Pipeline

LoRA/QLoRA fine-tuning for Qwen2.5-3B-Instruct on recycling domain data.

## Requirements

- GPU with 12GB+ VRAM (RTX 3060 or better)
- Install fine-tuning dependencies separately:

```bash
pip install transformers peft trl datasets bitsandbytes
```

## Steps

### 1. Prepare Dataset

Convert Kaggle CSV to instruction-tuning JSONL:

```bash
python finetune/prepare_dataset.py data/kaggle.csv
```

This creates `finetune/dataset.jsonl`.

### 2. Train

```bash
python finetune/train.py
```

- Uses 4-bit quantization (QLoRA) to fit on 12GB VRAM
- LoRA rank 16, alpha 32
- 3 epochs, batch size 4 with gradient accumulation 4
- Output saved to `finetune/output/`

### 3. Use Fine-Tuned Model

Update `.env` to point `PRIMARY_MODEL` to the local fine-tuned model path.