from openai import OpenAI
import os

# Featherless API configuration
client = OpenAI(
  base_url="https://api.featherless.ai/v1",
  api_key="rc_81e670f49f386c5f8b8c8f33b44d6f3d57280d7900ac27b780075241574da47e",
)

def test_model(prompt):
    print(f"\nPrompt: {prompt}\n")
    print("AI is thinking...", end="\r")
    
    try:
        response = client.chat.completions.create(
          model='Qwen/Qwen2.5-3B-Instruct',
          messages=[
            {"role": "system", "content": "You are a helpful assistant specialized in providing accurate, detailed, and clear explanations."},
            {"role": "user", "content": prompt}
          ],
        )
        print("Assistant >> " + response.choices[0].message.content)
    except Exception as e:
        print(f"Error: {str(e)}")

if __name__ == "__main__":
    test_prompt = "Explain what is FastAPI and how it helps in ML deployment."
    test_model(test_prompt)
