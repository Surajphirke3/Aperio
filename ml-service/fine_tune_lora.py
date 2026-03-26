import os
import torch
import argparse
import transformers
from datasets import load_dataset
from peft import LoraConfig, get_peft_model, prepare_model_for_kbit_training
from transformers import AutoTokenizer, AutoModelForCausalLM, TrainingArguments, Trainer, DataCollatorForLanguageModeling

def fine_tune(data_path, output_dir, epochs, batch_size, learning_rate, max_length):
    # Model configuration
    model_name = "Qwen/Qwen2.5-0.5B"
    
    # Load tokenizer and model
    tokenizer = AutoTokenizer.from_pretrained(model_name, trust_remote_code=True)
    tokenizer.pad_token = tokenizer.eos_token
    
    # Load model with 4-bit quantization for memory efficiency
    device_map = "auto"
    model = AutoModelForCausalLM.from_pretrained(
        model_name,
        device_map=device_map,
        quantization_config=transformers.BitsAndBytesConfig(
            load_in_4bit=True,
            bnb_4bit_use_double_quant=True,
            bnb_4bit_compute_dtype=torch.bfloat16,
            bnb_4bit_quant_type="nf4",
        ),
        trust_remote_code=True,
    )
    
    # Prepare model for training
    model = prepare_model_for_kbit_training(model)
    
    # LoRA config
    lora_config = LoraConfig(
        r=16,
        lora_alpha=32,
        target_modules=["q_proj", "v_proj"],
        lora_dropout=0.05,
        bias="none",
        task_type="CAUSAL_LM",
    )
    
    # Apply LoRA
    model = get_peft_model(model, lora_config)
    
    # Load and preprocess dataset
    dataset = load_dataset("json", data_files=data_path, split="train")
    
    def tokenize_function(examples):
        system_prompt = "You are a Global Supply Chain and Recycling Expert specialize in Scenario traceability."
        prompts = [f"{system_prompt}\nInstruction: {instruction}\nOutput: " for instruction in examples["instruction"]]
        target_texts = examples["output"]
        
        input_ids = tokenizer(prompts, max_length=max_length, truncation=True, padding="max_length")["input_ids"]
        labels = tokenizer(target_texts, max_length=max_length, truncation=True, padding="max_length")["input_ids"]
        
        return {"input_ids": input_ids, "labels": labels}
    
    tokenized_dataset = dataset.map(tokenize_function, batched=True, remove_columns=dataset.column_names)
    
    # Training arguments
    training_args = TrainingArguments(
        output_dir=output_dir,
        per_device_train_batch_size=batch_size,
        gradient_accumulation_steps=4 if batch_size == 1 else 1,
        learning_rate=learning_rate,
        num_train_epochs=epochs,
        logging_steps=10,
        save_steps=100,
        eval_strategy="no",
        fp16=True,
        push_to_hub=False,
    )
    
    # Define trainer
    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=tokenized_dataset,
        data_collator=DataCollatorForLanguageModeling(tokenizer, mlm=False),
    )
    
    # Start training
    trainer.train()
    
    # Save the fine-tuned model
    model.save_pretrained(output_dir)
    tokenizer.save_pretrained(output_dir)
    print(f"Fine-tuning complete. Model saved at {output_dir}")

def main():
    parser = argparse.ArgumentParser(description="Fine-tune Qwen model with LoRA")
    parser.add_argument("--data_path", type=str, required=True, help="Path to training data (JSONL)")
    parser.add_argument("--output_dir", type=str, required=True, help="Path to save the fine-tuned model")
    parser.add_argument("--epochs", type=int, default=3, help="Number of training epochs")
    parser.add_argument("--batch_size", type=int, default=1, help="Training batch size")
    parser.add_argument("--learning_rate", type=float, default=2e-4, help="Learning rate")
    parser.add_argument("--max_length", type=int, default=256, help="Maximum sequence length")
    
    args = parser.parse_args()
    
    fine_tune(args.data_path, args.output_dir, args.epochs, args.batch_size, args.learning_rate, args.max_length)

if __name__ == "__main__":
    main()
