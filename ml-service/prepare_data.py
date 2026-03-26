import json
import argparse
import pandas as pd
import os

def create_sample_data(output_path):
    samples = [
        {"instruction": "Explain what is Python", "output": "Python is a high-level, interpreted programming language known for its readability and versatility. It's widely used in web development, data science, AI, and automation."},
        {"instruction": "What is FastAPI?", "output": "FastAPI is a modern, fast (high-performance), web framework for building APIs with Python 3.8+ based on standard Python type hints."},
        {"instruction": "How to fine-tune a model with LoRA?", "output": "LoRA (Low-Rank Adaptation) is a technique for fine-tuning large language models efficiently by adding small trainable rank decomposition matrices to each layer of the Transformer architecture while freezing the original weights."},
        {"instruction": "What are the benefits of Qwen models?", "output": "Qwen models, developed by Alibaba Cloud, are known for their strong performance across various benchmarks, multilingual support, and efficiency in both base and chat versions."},
        {"instruction": "What is Retrieval-Augmented Generation (RAG)?", "output": "RAG is a technique that enhances the output of a large language model by integrating it with an external knowledge base to retrieve relevant information before generating a response."}
    ]
    
    with open(output_path, 'w', encoding='utf-8') as f:
        for entry in samples:
            f.write(json.dumps(entry) + '\n')
    print(f"Sample data created at {output_path}")

def convert_csv_to_jsonl(input_path, output_path, instruction_col, output_col, validate=False):
    df = pd.read_csv(input_path)
    if instruction_col not in df.columns or output_col not in df.columns:
        print(f"Error: Columns {instruction_col} or {output_col} not found in {input_path}")
        return

    with open(output_path, 'w', encoding='utf-8') as f:
        for _, row in df.iterrows():
            entry = {
                "instruction": str(row[instruction_col]),
                "output": str(row[output_col])
            }
            f.write(json.dumps(entry) + '\n')
    print(f"Converted CSV to JSONL at {output_path}")

def convert_json_to_jsonl(input_path, output_path):
    with open(input_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    with open(output_path, 'w', encoding='utf-8') as f:
        for entry in data:
            # Assumes input JSON is a list of dicts with 'instruction' and 'output'
            f.write(json.dumps(entry) + '\n')
    print(f"Converted JSON to JSONL at {output_path}")

def main():
    parser = argparse.ArgumentParser(description="Prepare training data for Qwen fine-tuning")
    parser.add_argument("--create_sample", action="store_true", help="Create sample training data")
    parser.add_argument("--input", type=str, help="Input file path (CSV or JSON)")
    parser.add_argument("--format", type=str, choices=["csv", "json"], help="Input file format")
    parser.add_argument("--output", type=str, default="training_data.jsonl", help="Output JSONL file path")
    parser.add_argument("--instruction_col", type=str, default="instruction", help="Column name for instructions (CSV only)")
    parser.add_argument("--output_col", type=str, default="output", help="Column name for output (CSV only)")
    parser.add_argument("--validate", action="store_true", help="Validate data entries (CSV only)")

    args = parser.parse_args()

    if args.create_sample:
        create_sample_data(args.output)
    elif args.input and args.format:
        if args.format == "csv":
            convert_csv_to_jsonl(args.input, args.output, args.instruction_col, args.output_col, args.validate)
        elif args.format == "json":
            convert_json_to_jsonl(args.input, args.output)
    else:
        parser.print_help()

if __name__ == "__main__":
    main()
