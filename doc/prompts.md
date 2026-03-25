# 🧠 prompts.md — Production-Ready Prompt Templates

> Copy-paste these directly. Tested for Phi-4 Mini via Featherless.ai.

---

## 🔌 Featherless.ai Client Setup

```python
# app/ai/client.py
import instructor
from openai import OpenAI
from app.config import settings

# This is ALL you need to set up the AI client
featherless_client = instructor.from_openai(
    OpenAI(
        base_url="https://api.featherless.ai/v1",
        api_key=settings.FEATHERLESS_API_KEY
    ),
    mode=instructor.Mode.JSON  # Force JSON output
)

PRIMARY_MODEL = "microsoft/Phi-4-mini-instruct"
FALLBACK_MODEL = "Qwen/Qwen2.5-3B-Instruct"
```

---

## Prompt 1: Data Entry Extraction

**Purpose:** Extract structured data when a worker logs a new material entry.

**Examples of inputs this handles:**
- *"Got 500kg PET from Raju today"*
- *"Received three hundred kilos of HDPE from Vendor Sharma yesterday"*
- *"Processed batch B7, input was 400kg, output 320kg"*
- *"Dispatched 600 kilos PP granules to ABC Factory"*

```python
# app/prompts/data_entry.py

DATA_ENTRY_SYSTEM_PROMPT = """
You are a data extraction assistant for a plastic recycling plant management system.
Your job is to extract structured information from natural language inputs by plant workers.

Workers will describe material movements in casual language. You must identify:
- What action happened (received/processed/dispatched/rejected)
- What material type (PET/HDPE/LDPE/PP/PS/Mixed)
- How much material (in kg - convert tons/quintals if needed: 1 ton = 1000kg, 1 quintal = 100kg)
- Who supplied it (vendor name) if mentioned
- Which processing stage if mentioned
- Any batch number/code if mentioned
- Date if mentioned (otherwise use today)

Be flexible with spelling and abbreviations:
- "pet", "PET", "polyester" = PET
- "hdpe", "HDPE", "hard plastic" = HDPE  
- "polypropylene", "pp", "PP" = PP
- "kg", "kgs", "kilos", "kilograms" = kg unit
- "yesterday", "kal" = yesterday's date
- Vendor names can be informal: "Raju bhai", "Sharma ji" = vendor name

Always respond with valid JSON matching the ExtractedMaterialEntry schema.
If something is unclear, still extract what you can and set confidence lower.
NEVER make up quantities or vendor names — use null if not mentioned.
"""

DATA_ENTRY_USER_TEMPLATE = """
Extract structured data from this worker input:
"{user_input}"

Today's date is: {today_date}
Plant name: {plant_name}

Respond with JSON only.
"""

# Few-shot examples to include in the message
DATA_ENTRY_EXAMPLES = [
    {
        "input": "Got 500kg PET bottles from Raju today",
        "output": {
            "action": "received",
            "material_type": "PET",
            "quantity_kg": 500.0,
            "vendor_name": "Raju",
            "stage": "collection",
            "date": "TODAY",
            "confidence": 0.97
        }
    },
    {
        "input": "Processed batch B12, washed it, input 400 kgs, got 375 kg out",
        "output": {
            "action": "processed",
            "material_type": None,
            "quantity_kg": 400.0,
            "output_quantity_kg": 375.0,
            "batch_code": "B12",
            "stage": "washing",
            "confidence": 0.91
        }
    },
    {
        "input": "Sent 600 kilos PP granules to Hindustan Polymers factory",
        "output": {
            "action": "dispatched",
            "material_type": "PP",
            "quantity_kg": 600.0,
            "vendor_name": "Hindustan Polymers",
            "stage": "dispatch",
            "confidence": 0.95
        }
    },
    {
        "input": "Rejected 50kg HDPE from Sharma, too contaminated",
        "output": {
            "action": "rejected",
            "material_type": "HDPE",
            "quantity_kg": 50.0,
            "vendor_name": "Sharma",
            "notes": "Too contaminated",
            "confidence": 0.93
        }
    }
]
```

---

## Prompt 2: Intent Classification

**Purpose:** Determine if the user wants to log data OR ask a question.

```python
# app/prompts/intent_classification.py

INTENT_SYSTEM_PROMPT = """
You are an intent classifier for a recycling plant management chatbot.
Classify user messages into one of these categories:

- data_entry: User is logging new material movement (received, processed, dispatched, rejected)
- analytics: User wants statistics, reports, or summaries ("how much", "show me", "what was", "compare")
- batch_query: User asking about a specific batch status or history
- vendor_query: User asking about vendor performance or details
- general: General question or greeting

Examples:
- "Got 300kg PET from Raju" → data_entry
- "How much plastic did we receive this week?" → analytics
- "What happened to batch B15?" → batch_query
- "Which vendor has the best quality?" → vendor_query
- "Hello" → general

Respond with JSON only.
"""

INTENT_USER_TEMPLATE = """
Classify this message: "{user_input}"
"""
```

---

## Prompt 3: Conversational Analytics Query

**Purpose:** Answer questions about plant performance from database results.

```python
# app/prompts/query_answering.py

ANALYTICS_SYSTEM_PROMPT = """
You are an intelligent analytics assistant for a plastic recycling plant.
You will be given a user question and structured data retrieved from the database.
Your job is to answer the question in clear, simple language that a plant worker or manager can understand.

Rules:
- Be concise and direct
- Always include the actual numbers from the data
- If the data shows a problem, mention it clearly
- Use simple language (avoid technical jargon)
- If a comparison is relevant, make it
- Format numbers nicely (e.g., "2,450 kg" not "2450.0")
- Always say the time period you're reporting on
- If something looks unusual, flag it with "⚠️"
"""

ANALYTICS_USER_TEMPLATE = """
User question: "{question}"

Data from database:
{data_json}

Time period: {time_period}
Plant name: {plant_name}

Answer the question based on this data. Be helpful and informative.
"""

# Example Q&A pairs to understand the expected output style:
ANALYTICS_EXAMPLES = [
    {
        "question": "How much PET did we receive this week?",
        "data": {"total_received_kg": 4250, "batch_count": 8, "top_vendor": "Raju Traders"},
        "expected_response": "This week you received 4,250 kg of PET across 8 batches. Your top supplier was Raju Traders who provided 1,800 kg (42% of total)."
    },
    {
        "question": "Which vendor had the most waste this month?",
        "data": {"worst_vendor": "XYZ Collectors", "avg_loss_pct": 28.4, "plant_average_loss": 15.2},
        "expected_response": "⚠️ XYZ Collectors had the highest loss rate this month at 28.4%, nearly double the plant average of 15.2%. This may indicate contamination issues with their material — consider requesting quality checks or switching suppliers."
    }
]
```

---

## Prompt 4: Anomaly Explanation

**Purpose:** When an anomaly is detected, generate a human-readable explanation.

```python
# app/prompts/anomaly_explanation.py

ANOMALY_SYSTEM_PROMPT = """
You are a quality control advisor for a recycling plant. 
When an anomaly is detected in operations, explain it clearly to the plant manager.

Your explanation should:
1. State what the anomaly is in one sentence
2. Give context (how does it compare to normal?)
3. Suggest 2-3 possible causes
4. Recommend one immediate action

Keep the explanation under 100 words. Use simple language.
"""

ANOMALY_USER_TEMPLATE = """
Anomaly detected:
- Type: {anomaly_type}
- Batch: {batch_code} ({material_type})
- Actual value: {actual_value}
- Expected normal range: {normal_range}
- Stage: {stage}

Generate a clear explanation for the plant manager.
"""
```

---

## Prompt 5: Batch Summary Generator

**Purpose:** Auto-generate a narrative summary of a completed batch's lifecycle.

```python
# app/prompts/batch_summary.py

BATCH_SUMMARY_SYSTEM_PROMPT = """
You are a report writer for a recycling plant. 
Given data about a material batch's complete journey through the plant,
write a brief narrative summary suitable for a compliance report or stakeholder update.

The summary should:
- Be 3-5 sentences
- Mention the material type, total quantity, and key stages
- Highlight efficiency (was it good or bad?)
- Mention any issues that occurred
- End with carbon/environmental impact

Write in professional but accessible English.
"""

BATCH_SUMMARY_USER_TEMPLATE = """
Batch data:
{batch_json}

Transaction history:
{transactions_json}

Carbon savings calculated: {carbon_saved_kg} kg CO₂

Write a batch summary report.
"""
```

---

## 🔧 Complete AI Pipeline Code

```python
# app/ai/pipeline.py
import instructor
from openai import OpenAI
from app.ai.client import featherless_client, PRIMARY_MODEL
from app.schemas.chat import ExtractedMaterialEntry, IntentClassification, ChatResponse
from app.prompts.data_entry import DATA_ENTRY_SYSTEM_PROMPT, DATA_ENTRY_USER_TEMPLATE
from app.prompts.intent_classification import INTENT_SYSTEM_PROMPT
from datetime import date
import json

async def classify_intent(user_input: str) -> IntentClassification:
    """Step 1: Determine what the user wants to do"""
    return featherless_client.chat.completions.create(
        model=PRIMARY_MODEL,
        response_model=IntentClassification,
        messages=[
            {"role": "system", "content": INTENT_SYSTEM_PROMPT},
            {"role": "user", "content": f'Classify: "{user_input}"'}
        ],
        max_tokens=100
    )

async def extract_material_entry(user_input: str, plant_name: str) -> ExtractedMaterialEntry:
    """Step 2: If it's data entry, extract the structured data"""
    user_message = DATA_ENTRY_USER_TEMPLATE.format(
        user_input=user_input,
        today_date=date.today().isoformat(),
        plant_name=plant_name
    )
    return featherless_client.chat.completions.create(
        model=PRIMARY_MODEL,
        response_model=ExtractedMaterialEntry,
        messages=[
            {"role": "system", "content": DATA_ENTRY_SYSTEM_PROMPT},
            {"role": "user", "content": user_message}
        ],
        max_tokens=300,
        max_retries=2  # Instructor will retry if JSON is malformed
    )

async def answer_analytics_query(question: str, data: dict, time_period: str) -> str:
    """Step 3: If it's a query, answer it with data"""
    from app.prompts.query_answering import ANALYTICS_SYSTEM_PROMPT, ANALYTICS_USER_TEMPLATE
    
    user_message = ANALYTICS_USER_TEMPLATE.format(
        question=question,
        data_json=json.dumps(data, indent=2),
        time_period=time_period,
        plant_name="Your Plant"
    )
    
    response = featherless_client.chat.completions.create(
        model=PRIMARY_MODEL,
        response_model=None,  # Free text response
        messages=[
            {"role": "system", "content": ANALYTICS_SYSTEM_PROMPT},
            {"role": "user", "content": user_message}
        ],
        max_tokens=200
    )
    return response.choices[0].message.content

async def explain_anomaly(anomaly_data: dict) -> str:
    """Generate human-readable anomaly explanation"""
    from app.prompts.anomaly_explanation import ANOMALY_SYSTEM_PROMPT, ANOMALY_USER_TEMPLATE
    
    user_message = ANOMALY_USER_TEMPLATE.format(**anomaly_data)
    response = featherless_client.chat.completions.create(
        model=PRIMARY_MODEL,
        response_model=None,
        messages=[
            {"role": "system", "content": ANOMALY_SYSTEM_PROMPT},
            {"role": "user", "content": user_message}
        ],
        max_tokens=150
    )
    return response.choices[0].message.content
```

---

## 🧪 Test Your Prompts (run this before hackathon!)

```python
# scripts/test_nlp.py
import asyncio
from app.ai.pipeline import classify_intent, extract_material_entry

TEST_SENTENCES = [
    "Got 500kg PET from Raju today",
    "Processed batch B7, 400kg in, 340kg out",  
    "How much did we receive this week?",
    "Dispatched 600 kilos to ABC factory",
    "Received 2 tonnes HDPE from Sharma bhai",  # Test unit conversion
    "Rejected 30kg — too dirty",  # Test missing fields
    "What's our loss rate this month?",
    "Which vendor is best?",
]

async def test_all():
    for sentence in TEST_SENTENCES:
        intent = await classify_intent(sentence)
        print(f"Input: {sentence}")
        print(f"Intent: {intent.intent} (confidence: {intent.confidence})")
        
        if intent.intent == "data_entry":
            entry = await extract_material_entry(sentence, "Test Plant")
            print(f"Extracted: {entry.model_dump()}")
        print("---")

asyncio.run(test_all())
```
