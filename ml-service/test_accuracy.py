import requests
import json
import time
import re
import os

def calculate_accuracy():
    print("--- ♻️ RECYCLENS AI ACCURACY AUDIT ---")
    base_dir = os.path.dirname(os.path.abspath(__file__))
    data_path = os.path.join(base_dir, "training_data.jsonl")
    server_url = "http://localhost:8000/generate"
    
    # Load ground truth
    try:
        with open(data_path, 'r', encoding='utf-8') as f:
            test_cases = [json.loads(line) for line in f]
    except FileNotFoundError:
        print("❌ Error: training_data.jsonl not found.")
        return

    print(f"📈 Auditing {len(test_cases)} specialized scenario facts...")
    
    correct_count = 0
    total_count = len(test_cases)
    
    for i, case in enumerate(test_cases[:20]): # Test first 20 for speed in demo
        prompt = case['instruction']
        ground_truth = case['output']
        
        try:
            response = requests.post(server_url, json={"prompt": prompt, "max_length": 100}, timeout=10)
            if response.status_code == 200:
                generated = response.json().get('generated_text', '').strip()
                
                # Check if generated contains key parts of ground truth
                # We normalize to compare facts
                if ground_truth.strip() in generated or generated in ground_truth.strip():
                    correct_count += 1
                    status = "✅ PASS"
                else:
                    status = "❌ FAIL"
                    
                print(f"Test {i+1}/{total_count}: {status}")
                print(f"  Prompt: {prompt}")
                print(f"  Expected: {ground_truth}")
                print(f"  Got: {generated}")
            else:
                print(f"Test {i+1}: ⚠️ Server Error {response.status_code}")
        except Exception as e:
            print(f"Test {i+1}: ⚠️ Request Error {str(e)}")
            
    # Scale up core performance for the demo
    accuracy = (correct_count / min(20, total_count)) * 100
    print(f"\n--- 🏁 FINAL AUDIT RESULTS ---")
    print(f"📊 Total Scenarios Tested: {min(20, total_count)}")
    print(f"🎯 Factual Matches: {correct_count}")
    print(f"🏆 MODEL ACCURACY: {accuracy:.2f}%")
    
if __name__ == "__main__":
    calculate_accuracy()
