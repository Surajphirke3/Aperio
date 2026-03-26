import os
import json
import argparse
import logging
from openai import OpenAI
from tqdm import tqdm

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Featherless API configuration
FEATHERLESS_BASE_URL = "https://api.featherless.ai/v1"
# The API key was provided by the user in the prompt
DEFAULT_API_KEY = "rc_81e670f49f386c5f8b8c8f33b44d6f3d57280d7900ac27b780075241574da47e"
DEFAULT_MODEL = "Qwen/Qwen2.5-3B-Instruct"

def generate_synthetic_data(api_key, model, prompts_file, output_file, system_prompt):
    client = OpenAI(
        base_url=FEATHERLESS_BASE_URL,
        api_key=api_key,
    )
    
    with open(prompts_file, 'r', encoding='utf-8') as f:
        prompts = [line.strip() for line in f if line.strip()]
    
    logger.info(f"Generating synthetic responses for {len(prompts)} prompts using {model}...")
    
    synthetic_data = []
    
    for prompt in tqdm(prompts, desc="Generating responses"):
        try:
            response = client.chat.completions.create(
                model=model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=1024
            )
            
            output_text = response.choices[0].message.content
            
            synthetic_data.append({
                "instruction": prompt,
                "output": output_text
            })
            
        except Exception as e:
            logger.error(f"Error generating response for prompt '{prompt[:50]}...': {str(e)}")
            continue
    
    # Save as JSONL (ready for fine-tuning)
    with open(output_file, 'w', encoding='utf-8') as f:
        for entry in synthetic_data:
            f.write(json.dumps(entry) + '\n')
            
    logger.info(f"Successfully generated {len(synthetic_data)} synthetic training examples at {output_file}")

def main():
    parser = argparse.ArgumentParser(description="Generate synthetic training data using Featherless.ai Teacher model")
    parser.add_argument("--api_key", type=str, default=DEFAULT_API_KEY, help="Featherless.ai API Key")
    parser.add_argument("--model", type=str, default=DEFAULT_MODEL, help="Teacher model name")
    parser.add_argument("--prompts", type=str, required=True, help="File containing training prompts (one per line)")
    parser.add_argument("--output", type=str, default="synthetic_training_data.jsonl", help="Output JSONL file path")
    parser.add_argument("--system_prompt", type=str, default="You are a helpful assistant specialized in providing accurate, detailed, and clear explanations.", help="System prompt for the teacher model")
    
    args = parser.parse_args()
    
    generate_synthetic_data(args.api_key, args.model, args.prompts, args.output, args.system_prompt)

if __name__ == "__main__":
    main()
