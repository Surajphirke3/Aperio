# 🗄️ schema.md — Database Schema, JSON Models & Data Structures

> Copy-paste ready. Set up your Supabase tables exactly as shown here.

---

## 🏗️ Supabase Database Schema (PostgreSQL)

Run these SQL commands in your Supabase SQL Editor (Dashboard → SQL Editor → New Query):

### Table 1: plants
```sql
-- Every recycling facility using the platform
CREATE TABLE plants (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    capacity_tonnes_per_month DECIMAL(10,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Table 2: users
```sql
-- Linked to Clerk auth - stores plant membership
CREATE TABLE users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    clerk_user_id VARCHAR(255) UNIQUE NOT NULL,  -- Clerk's user ID
    plant_id UUID REFERENCES plants(id),
    role VARCHAR(50) DEFAULT 'operator',  -- 'manager', 'operator', 'compliance', 'admin'
    full_name VARCHAR(255),
    email VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Table 3: vendors
```sql
-- Material suppliers/collectors
CREATE TABLE vendors (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    plant_id UUID REFERENCES plants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    contact_name VARCHAR(255),
    contact_phone VARCHAR(20),
    location VARCHAR(255),
    vendor_type VARCHAR(50),  -- 'collector', 'aggregator', 'direct_source'
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Table 4: batches
```sql
-- Core table: each batch of plastic material
CREATE TABLE batches (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    plant_id UUID REFERENCES plants(id) ON DELETE CASCADE,
    batch_code VARCHAR(100) UNIQUE NOT NULL,  -- e.g., "B-2026-001"
    material_type VARCHAR(50) NOT NULL,  -- 'PET', 'HDPE', 'LDPE', 'PP', 'PS', 'Mixed'
    grade VARCHAR(50),  -- 'A', 'B', 'C' or 'food_grade', 'industrial'
    initial_quantity_kg DECIMAL(10,3) NOT NULL,
    current_quantity_kg DECIMAL(10,3),  -- Updated as processing occurs
    vendor_id UUID REFERENCES vendors(id),
    status VARCHAR(50) DEFAULT 'received',  
    -- Status flow: received → sorted → washed → shredded → melted → pelletized → dispatched
    collection_source VARCHAR(255),  -- Where was it collected from
    collection_location VARCHAR(255),
    notes TEXT,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for fast queries
CREATE INDEX idx_batches_plant_id ON batches(plant_id);
CREATE INDEX idx_batches_status ON batches(status);
CREATE INDEX idx_batches_material_type ON batches(material_type);
CREATE INDEX idx_batches_created_at ON batches(created_at);
```

### Table 5: transactions
```sql
-- Every stage a batch passes through
CREATE TABLE transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    batch_id UUID REFERENCES batches(id) ON DELETE CASCADE,
    plant_id UUID REFERENCES plants(id),
    stage VARCHAR(50) NOT NULL,
    -- Stages: 'collection', 'weighing', 'sorting', 'washing', 'shredding', 
    --         'melting', 'pelletizing', 'quality_check', 'dispatch'
    input_quantity_kg DECIMAL(10,3) NOT NULL,
    output_quantity_kg DECIMAL(10,3),  -- What came out (null if stage not complete)
    loss_quantity_kg DECIMAL(10,3) GENERATED ALWAYS AS (input_quantity_kg - output_quantity_kg) STORED,
    loss_percentage DECIMAL(5,2) GENERATED ALWAYS AS 
        (CASE WHEN input_quantity_kg > 0 
         THEN ((input_quantity_kg - output_quantity_kg) / input_quantity_kg * 100) 
         ELSE 0 END) STORED,
    operator_id UUID REFERENCES users(id),
    stage_started_at TIMESTAMP WITH TIME ZONE,
    stage_completed_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_transactions_batch_id ON transactions(batch_id);
CREATE INDEX idx_transactions_stage ON transactions(stage);
CREATE INDEX idx_transactions_created_at ON transactions(created_at);
```

### Table 6: alerts
```sql
-- Anomaly alerts and notifications
CREATE TABLE alerts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    plant_id UUID REFERENCES plants(id) ON DELETE CASCADE,
    batch_id UUID REFERENCES batches(id),
    alert_type VARCHAR(100) NOT NULL,
    -- Types: 'high_loss', 'abnormal_purity', 'missing_stage', 'vendor_quality_drop',
    --        'processing_delay', 'quantity_mismatch'
    severity VARCHAR(20) DEFAULT 'medium',  -- 'low', 'medium', 'high', 'critical'
    title VARCHAR(255) NOT NULL,
    description TEXT,
    ai_explanation TEXT,  -- LLM-generated human readable explanation
    is_resolved BOOLEAN DEFAULT false,
    resolved_by UUID REFERENCES users(id),
    resolved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Table 7: chat_messages
```sql
-- Conversation history for the chat interface
CREATE TABLE chat_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    plant_id UUID REFERENCES plants(id),
    user_id UUID REFERENCES users(id),
    role VARCHAR(20) NOT NULL,  -- 'user' or 'assistant'
    content TEXT NOT NULL,
    intent VARCHAR(50),  -- 'data_entry', 'query', 'clarification', 'greeting'
    extracted_data JSONB,  -- The structured JSON extracted from user message
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Table 8: dispatch_records
```sql
-- Final dispatch of recycled material to buyers
CREATE TABLE dispatch_records (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    plant_id UUID REFERENCES plants(id),
    batch_id UUID REFERENCES batches(id),
    buyer_name VARCHAR(255) NOT NULL,
    buyer_location VARCHAR(255),
    quantity_kg DECIMAL(10,3) NOT NULL,
    material_type VARCHAR(50),
    grade VARCHAR(50),
    price_per_kg DECIMAL(10,2),
    total_value DECIMAL(12,2),
    dispatch_date DATE NOT NULL,
    vehicle_number VARCHAR(50),
    certificate_generated BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## ⚡ Supabase Real-Time Setup

Enable real-time on these tables (in Supabase Dashboard → Database → Replication):
- `batches` — for live dashboard updates
- `transactions` — for Sankey diagram live updates
- `alerts` — for instant alert notifications

---

## 🤖 AI JSON Models (Pydantic)

These are the Python models that Instructor uses to extract structured data:

### ExtractedMaterialEntry
```python
from pydantic import BaseModel, Field
from typing import Optional
from enum import Enum
from datetime import date

class MaterialType(str, Enum):
    PET = "PET"
    HDPE = "HDPE"
    LDPE = "LDPE"
    PP = "PP"
    PS = "PS"
    MIXED = "Mixed"
    UNKNOWN = "Unknown"

class ProcessStage(str, Enum):
    COLLECTION = "collection"
    SORTING = "sorting"
    WASHING = "washing"
    SHREDDING = "shredding"
    MELTING = "melting"
    PELLETIZING = "pelletizing"
    DISPATCH = "dispatch"

class ActionType(str, Enum):
    RECEIVED = "received"      # New material arrived
    PROCESSED = "processed"    # Stage completed
    DISPATCHED = "dispatched"  # Sent to buyer
    REJECTED = "rejected"      # Material rejected

class ExtractedMaterialEntry(BaseModel):
    """Structured data extracted from natural language input"""
    action: ActionType = Field(description="What happened to the material")
    material_type: MaterialType = Field(description="Type of plastic")
    quantity_kg: float = Field(description="Weight in kilograms", gt=0)
    vendor_name: Optional[str] = Field(None, description="Supplier/vendor name if mentioned")
    stage: Optional[ProcessStage] = Field(None, description="Processing stage if mentioned")
    output_quantity_kg: Optional[float] = Field(None, description="Output after processing, if different")
    batch_code: Optional[str] = Field(None, description="Specific batch identifier if mentioned")
    date: Optional[date] = Field(None, description="Date of operation (default to today if not mentioned)")
    notes: Optional[str] = Field(None, description="Any additional relevant information")
    confidence: float = Field(description="How confident AI is in extraction (0-1)", ge=0, le=1)
```

### IntentClassification
```python
class QueryIntent(str, Enum):
    DATA_ENTRY = "data_entry"          # User wants to log new data
    ANALYTICS_QUERY = "analytics"      # User wants statistics/reports
    BATCH_QUERY = "batch_query"        # User asking about specific batch
    VENDOR_QUERY = "vendor_query"      # User asking about vendors
    GENERAL_QUESTION = "general"       # General operational question

class IntentClassification(BaseModel):
    intent: QueryIntent
    confidence: float = Field(ge=0, le=1)
    requires_clarification: bool = False
    clarification_question: Optional[str] = None
```

### AnalyticsQueryParsed
```python
class TimeRange(str, Enum):
    TODAY = "today"
    THIS_WEEK = "this_week"
    THIS_MONTH = "this_month"
    LAST_MONTH = "last_month"
    CUSTOM = "custom"

class AnalyticsQueryParsed(BaseModel):
    metric: str  # "total_received", "loss_rate", "vendor_performance", "carbon_savings"
    material_type: Optional[MaterialType] = None
    vendor_name: Optional[str] = None
    time_range: TimeRange = TimeRange.THIS_MONTH
    start_date: Optional[date] = None
    end_date: Optional[date] = None
```

---

## 🔄 API Response Schemas

### BatchResponse
```python
class BatchResponse(BaseModel):
    id: str
    batch_code: str
    material_type: str
    initial_quantity_kg: float
    current_quantity_kg: float
    status: str
    vendor_name: Optional[str]
    total_loss_kg: float
    total_loss_percentage: float
    carbon_saved_kg: float
    transactions: list[TransactionResponse]
    created_at: datetime
```

### LifecycleData (for Sankey Diagram)
```python
class SankeyNode(BaseModel):
    id: str       # e.g., "collection", "sorting", "waste_sorting"
    name: str     # Display name
    value: float  # Total quantity in kg

class SankeyLink(BaseModel):
    source: str   # Node ID
    target: str   # Node ID  
    value: float  # kg flowing through this link

class LifecycleSankeyData(BaseModel):
    nodes: list[SankeyNode]
    links: list[SankeyLink]
    total_input_kg: float
    total_output_kg: float
    total_loss_kg: float
    overall_efficiency_percentage: float
```

### ChatResponse
```python
class ChatResponse(BaseModel):
    message: str              # Human-readable response to user
    intent: str               # What was detected
    action_taken: Optional[str]  # "batch_logged", "query_answered", etc.
    data: Optional[dict]      # Any structured data to display
    entry: Optional[ExtractedMaterialEntry]  # If data was logged
    alert: Optional[dict]     # If an anomaly was triggered
```

---

## 🌱 Static Data Files

### emission_factors.json
```json
{
  "PET": {
    "collection": 0.042,
    "sorting": 0.015,
    "washing": 0.089,
    "shredding": 0.031,
    "melting": 0.31,
    "pelletizing": 0.12,
    "virgin_equivalent": 2.15
  },
  "HDPE": {
    "collection": 0.038,
    "sorting": 0.013,
    "washing": 0.081,
    "shredding": 0.028,
    "melting": 0.28,
    "pelletizing": 0.11,
    "virgin_equivalent": 1.97
  },
  "PP": {
    "collection": 0.039,
    "sorting": 0.014,
    "washing": 0.083,
    "shredding": 0.029,
    "melting": 0.27,
    "pelletizing": 0.10,
    "virgin_equivalent": 1.89
  }
}
```

### normal_ranges.json (for anomaly detection)
```json
{
  "loss_thresholds": {
    "sorting": { "normal_max_pct": 8, "warning_pct": 12, "critical_pct": 20 },
    "washing": { "normal_max_pct": 5, "warning_pct": 8, "critical_pct": 15 },
    "shredding": { "normal_max_pct": 3, "warning_pct": 5, "critical_pct": 10 },
    "melting": { "normal_max_pct": 12, "warning_pct": 18, "critical_pct": 25 },
    "pelletizing": { "normal_max_pct": 5, "warning_pct": 8, "critical_pct": 12 }
  },
  "overall_efficiency": {
    "excellent": 85,
    "good": 75,
    "average": 65,
    "poor": 55
  }
}
```
