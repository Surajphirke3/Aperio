"""
Converts Kaggle recycling dataset CSV into instruction-tuning JSONL
format for LoRA fine-tuning of Qwen2.5-3B.

Dataset: https://www.kaggle.com/datasets/synapsehackniche/hackniche-4-0-ps-3-dataset
"""
import json
import pandas as pd
from pathlib import Path


INSTRUCTION_TEMPLATE = """You are an assistant for a recycled materials tracking system.
Extract structured data from the user's natural language input."""

def row_to_instruction(row: pd.Series) -> dict:
    user_msg = f"Log: {row['quantity_kg']}kg of {row['material']} {row['intent']} from {row.get('vendor', 'unknown')}"
    assistant_msg = json.dumps({
        "intent": row["intent"],
        "material": row["material"],
        "quantity_kg": float(row["quantity_kg"]),
        "date": str(row.get("date", "")),
        "vendor": row.get("vendor"),
    })
    return {
        "instruction": INSTRUCTION_TEMPLATE,
        "input": user_msg,
        "output": assistant_msg,
    }


def prepare(csv_path: str, output_path: str = "finetune/dataset.jsonl") -> None:
    df = pd.read_csv(csv_path)
    Path(output_path).parent.mkdir(exist_ok=True)

    with open(output_path, "w") as f:
        for _, row in df.iterrows():
            example = row_to_instruction(row)
            f.write(json.dumps(example) + "\n")

    print(f"Written {len(df)} examples to {output_path}")


if __name__ == "__main__":
    import sys
    prepare(sys.argv[1])