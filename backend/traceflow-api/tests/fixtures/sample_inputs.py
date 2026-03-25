# 20+ NL test inputs with expected outputs for testing the chat pipeline

SAMPLE_INPUTS = [
    # Purchase intents
    {"input": "Bought 300kg PET from Vendor A", "expected_intent": "purchase", "expected_material": "PET", "expected_quantity": 300},
    {"input": "Purchased 500 kilograms of HDPE from Recycler B", "expected_intent": "purchase", "expected_material": "HDPE", "expected_quantity": 500},
    {"input": "Received 1.5 tons of mixed plastic from Vendor C yesterday", "expected_intent": "purchase", "expected_material": "mixed", "expected_quantity": 1500},
    {"input": "Procured 200kg LDPE", "expected_intent": "purchase", "expected_material": "LDPE", "expected_quantity": 200},

    # Processing intents
    {"input": "Processed 400kg PET through washing stage, lost 15kg", "expected_intent": "processing", "expected_material": "PET", "expected_quantity": 400},
    {"input": "Sorted 250kg HDPE, 8kg loss", "expected_intent": "processing", "expected_material": "HDPE", "expected_quantity": 250},
    {"input": "Shredded 180kg PP batch B-2024-001", "expected_intent": "processing", "expected_material": "PP", "expected_quantity": 180},
    {"input": "Extruded 350kg PET with 12kg material loss", "expected_intent": "processing", "expected_material": "PET", "expected_quantity": 350},
    {"input": "Pelletized 300kg HDPE from batch B-2024-003", "expected_intent": "processing", "expected_material": "HDPE", "expected_quantity": 300},

    # Dispatch intents
    {"input": "Dispatched 200kg PET pellets to customer", "expected_intent": "dispatch", "expected_material": "PET", "expected_quantity": 200},
    {"input": "Shipped 500kg HDPE to warehouse B", "expected_intent": "dispatch", "expected_material": "HDPE", "expected_quantity": 500},
    {"input": "Sent 150kg PP to distribution center", "expected_intent": "dispatch", "expected_material": "PP", "expected_quantity": 150},

    # Query intents
    {"input": "How much PET was dispatched last week?", "expected_intent": "query", "expected_metric": "dispatched"},
    {"input": "What is the total loss for batch B-2024-001?", "expected_intent": "query", "expected_metric": "loss"},
    {"input": "Show me all batches from Vendor A", "expected_intent": "query", "expected_metric": "total"},
    {"input": "How many batches were processed this month?", "expected_intent": "query", "expected_metric": "count"},
    {"input": "What's the average loss percentage at washing stage?", "expected_intent": "query", "expected_metric": "average_loss"},
    {"input": "List vendors with highest loss rates", "expected_intent": "query", "expected_metric": "loss"},

    # Report intents
    {"input": "Give me a monthly summary", "expected_intent": "report"},
    {"input": "Generate a report for last week's operations", "expected_intent": "report"},
    {"input": "I need an overview of all vendor performance", "expected_intent": "report"},
    {"input": "Analyze batch B-2024-002 processing efficiency", "expected_intent": "report"},
]
