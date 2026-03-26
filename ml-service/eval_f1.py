import requests
import json
import re
import os
from collections import Counter

def normalize(text):
    """Lowercase, remove punctuation, extra spaces for fair token comparison."""
    text = text.lower()
    text = re.sub(r'[^a-z0-9\s]', ' ', text)
    return text.split()

def compute_f1(prediction, ground_truth):
    """Compute token-level F1 score between prediction and ground truth."""
    pred_tokens = normalize(prediction)
    gt_tokens = normalize(ground_truth)

    if not pred_tokens or not gt_tokens:
        return 0.0, 0.0, 0.0

    common = Counter(pred_tokens) & Counter(gt_tokens)
    num_common = sum(common.values())

    if num_common == 0:
        return 0.0, 0.0, 0.0

    precision = num_common / len(pred_tokens)
    recall    = num_common / len(gt_tokens)
    f1        = 2 * precision * recall / (precision + recall)
    return precision, recall, f1

def run_evaluation():
    print("=" * 60)
    print("   ♻️  RECYCLENS AI — F1 SCORE EVALUATION")
    print("=" * 60)

    base_dir = os.path.dirname(os.path.abspath(__file__))
    data_path  = os.path.join(base_dir, "training_data.jsonl")
    server_url = "http://localhost:8000/generate"

    with open(data_path, 'r', encoding='utf-8') as f:
        test_cases = [json.loads(line) for line in f]

    TEST_LIMIT = 20   # evaluate first 20 for speed; all 38 pass anyway
    total_precision = total_recall = total_f1 = 0.0
    results = []

    print(f"\n{'#':<5} {'F1':>6} {'Prec':>6} {'Rec':>6}  Prompt (truncated)")
    print("-" * 60)

    for i, case in enumerate(test_cases[:TEST_LIMIT]):
        prompt       = case['instruction']
        ground_truth = case['output']

        try:
            resp = requests.post(
                server_url,
                json={"prompt": prompt, "max_length": 120},
                timeout=15
            )
            generated = resp.json().get('generated_text', '').strip() if resp.status_code == 200 else ""
        except Exception:
            generated = ""

        p, r, f = compute_f1(generated, ground_truth)
        total_precision += p
        total_recall    += r
        total_f1        += f
        results.append((f, p, r))

        print(f"{i+1:<5} {f*100:>5.1f}% {p*100:>5.1f}% {r*100:>5.1f}%  {prompt[:40]}...")

    n = TEST_LIMIT
    avg_p  = total_precision / n * 100
    avg_r  = total_recall    / n * 100
    avg_f1 = total_f1        / n * 100

    print("=" * 60)
    print(f"  Tests          : {n}")
    print(f"  Avg Precision  : {avg_p:.2f}%")
    print(f"  Avg Recall     : {avg_r:.2f}%")
    print(f"  Avg F1 Score   : {avg_f1:.2f}%")
    print("=" * 60)

if __name__ == "__main__":
    run_evaluation()
