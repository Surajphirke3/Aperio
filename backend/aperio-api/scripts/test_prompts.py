"""
Manual prompt testing script.
Usage: python scripts/test_prompts.py
"""
import asyncio
import sys
import os

# Add project root to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))


TEST_MESSAGES = [
    "Bought 300kg PET from EcoPlast Recyclers",
    "Processed 250kg HDPE through washing stage, lost 12kg",
    "Dispatched 180kg PP pellets to warehouse",
    "How much PET was dispatched last week?",
    "Give me a monthly summary of all batches",
    "What is the total loss for batch B-2024-001?",
    "Sorted 400kg mixed plastic, 18kg loss",
    "Show me vendor performance for EcoPlast",
]


async def test_with_service():
    """Test prompts using the full chat service pipeline."""
    from src.infrastructure.adapters.ai.factory import get_ai_adapter
    from src.infrastructure.adapters.ai.prompts.intent_prompt import INTENT_SYSTEM_PROMPT

    adapter = get_ai_adapter()

    print("=" * 60)
    print("Aperio — Prompt Testing")
    print("=" * 60)

    # Check health
    healthy = await adapter.health_check()
    print(f"\nAI Adapter health: {'OK' if healthy else 'FAILED'}\n")

    if not healthy:
        print("AI adapter is not reachable. Check your configuration.")
        return

    for i, message in enumerate(TEST_MESSAGES, 1):
        print(f"\n--- Test {i} ---")
        print(f"Input: {message}")

        try:
            response = await adapter.complete(message, INTENT_SYSTEM_PROMPT)
            print(f"Model: {response.model}")
            print(f"Tokens: {response.tokens_used}")
            print(f"Response: {response.content}")
        except Exception as e:
            print(f"Error: {e}")

    print("\n" + "=" * 60)
    print("Done!")


async def test_standalone():
    """Test prompts without AI — just print what would be sent."""
    from src.infrastructure.adapters.ai.prompts.intent_prompt import INTENT_SYSTEM_PROMPT
    from src.infrastructure.adapters.ai.prompts.entity_prompt import ENTITY_SYSTEM_PROMPT
    from src.infrastructure.adapters.ai.prompts.query_prompt import QUERY_SYSTEM_PROMPT

    print("=" * 60)
    print("Aperio — Prompt Preview (No AI)")
    print("=" * 60)

    prompts = {
        "Intent Classification": INTENT_SYSTEM_PROMPT,
        "Entity Extraction": ENTITY_SYSTEM_PROMPT,
        "Query Parsing": QUERY_SYSTEM_PROMPT,
    }

    for name, prompt in prompts.items():
        print(f"\n--- {name} ---")
        print(f"System prompt length: {len(prompt)} chars")
        print(f"Preview: {prompt[:200]}...")

    print(f"\n\nTest messages ({len(TEST_MESSAGES)}):")
    for i, msg in enumerate(TEST_MESSAGES, 1):
        print(f"  {i}. {msg}")


if __name__ == "__main__":
    if "--no-ai" in sys.argv:
        asyncio.run(test_standalone())
    else:
        asyncio.run(test_with_service())
