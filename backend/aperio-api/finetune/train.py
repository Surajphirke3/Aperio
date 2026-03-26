"""
LoRA fine-tuning for Qwen2.5-3B-Instruct on recycling domain data.
Runs on a single GPU (RTX 3060 12GB or better) with 4-bit quantization.
"""
from transformers import AutoModelForCausalLM, AutoTokenizer, TrainingArguments
from peft import LoraConfig, get_peft_model, TaskType
from trl import SFTTrainer
from datasets import load_dataset


MODEL_NAME = "Qwen/Qwen2.5-3B-Instruct"
OUTPUT_DIR = "finetune/output"


def train(dataset_path: str = "finetune/dataset.jsonl") -> None:
    tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME, trust_remote_code=True)

    model = AutoModelForCausalLM.from_pretrained(
        MODEL_NAME,
        load_in_4bit=True,      # QLoRA — fits on 12GB VRAM
        device_map="auto",
        trust_remote_code=True,
    )

    lora_config = LoraConfig(
        task_type=TaskType.CAUSAL_LM,
        r=16,                   # LoRA rank
        lora_alpha=32,
        target_modules=["q_proj", "k_proj", "v_proj", "o_proj"],
        lora_dropout=0.05,
    )
    model = get_peft_model(model, lora_config)
    model.print_trainable_parameters()

    dataset = load_dataset("json", data_files=dataset_path, split="train")

    training_args = TrainingArguments(
        output_dir=OUTPUT_DIR,
        num_train_epochs=3,
        per_device_train_batch_size=4,
        gradient_accumulation_steps=4,
        learning_rate=2e-4,
        fp16=True,
        save_strategy="epoch",
        logging_steps=10,
        report_to="none",
    )

    trainer = SFTTrainer(
        model=model,
        train_dataset=dataset,
        tokenizer=tokenizer,
        args=training_args,
        dataset_text_field="output",
        max_seq_length=512,
    )

    trainer.train()
    trainer.save_model(OUTPUT_DIR)
    print(f"Fine-tuned model saved to {OUTPUT_DIR}")


if __name__ == "__main__":
    train()