import requests
import argparse
from openai import OpenAI

# ── Configuration ──────────────────────────────────────────
FEATHERLESS_API_KEY = "rc_81e670f49f386c5f8b8c8f33b44d6f3d57280d7900ac27b780075241574da47e"
FEATHERLESS_MODEL   = "Qwen/Qwen2.5-3B-Instruct"
LOCAL_API_URL       = "http://localhost:8000/generate"
# ───────────────────────────────────────────────────────────

def get_featherless_response(prompt):
    """Primary: Featherless AI cloud inference."""
    print("Attempting Featherless AI (Cloud)...")
    try:
        client = OpenAI(
            base_url="https://api.featherless.ai/v1",
            api_key=FEATHERLESS_API_KEY,
        )
        response = client.chat.completions.create(
            model=FEATHERLESS_MODEL,
            messages=[
                {"role": "system", "content": "You are a Supply Chain and Recycling Expert. Keep your answers extremely concise, factual, and to the point. Give me a maximum of 2 sentences."},
                {"role": "user",   "content": prompt}
            ],
            max_tokens=80,
            timeout=20
        )
        return response.choices[0].message.content
    except Exception as e:
        err = str(e)
        if "trial_tokens_exhausted" in err or "403" in err:
            print("Featherless tokens exhausted. Update FEATHERLESS_API_KEY in client.py.")
        else:
            print(f"Featherless error: {err}")
        return None

def get_local_response(prompt):
    """Fallback: Local fine-tuned Qwen2.5-0.5B + RAG on RTX 2050."""
    print("Using Local Specialized AI (RTX 2050)...")
    try:
        r = requests.post(
            LOCAL_API_URL,
            json={"prompt": prompt, "max_length": 200, "temperature": 0.3},
            timeout=120
        )
        r.raise_for_status()
        return r.json().get("generated_text", "Error: No response generated.")
    except requests.exceptions.ConnectionError:
        return "Error: Local server offline. Run fastapi_server.py first."
    except Exception as e:
        return f"Local AI error: {str(e)}"

def query(prompt):
    """Try Featherless first, fall back to local."""
    response = get_featherless_response(prompt)
    if not response:
        response = get_local_response(prompt)
    return response

def main():
    parser = argparse.ArgumentParser(description="Recyclens Hybrid AI Client")
    parser.add_argument("--prompt", type=str, help="Single prompt for testing")
    args = parser.parse_args()

    print("\n--- Recyclens Supply Chain AI ---")
    print(f"Cloud : Featherless ({FEATHERLESS_MODEL})")
    print("Local : Qwen2.5-0.5B LoRA + RAG (RTX 2050)")
    print("-" * 35)

    if args.prompt:
        print(f"Query  : {args.prompt}")
        response = query(args.prompt)
        print(f"Answer : {response}\n")
        return

    print("Type 'quit' to exit.\n")
    while True:
        try:
            prompt = input("Query >> ").strip()
            if not prompt:
                continue
            if prompt.lower() in ("exit", "quit"):
                print("Goodbye!")
                break
            response = query(prompt)
            print(f"\nAnswer: {response}")
            print("-" * 35)
        except KeyboardInterrupt:
            print("\nGoodbye!")
            break

if __name__ == "__main__":
    main()
