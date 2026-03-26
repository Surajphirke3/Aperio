import pandas as pd
import json
import os
import glob

def process_scenarios(base_dir, output_file):
    training_data = []
    
    # Pattern to find all scenario folders
    scenario_folders = glob.glob(os.path.join(base_dir, "Scenario *"))
    
    for folder in scenario_folders:
        scenario_name = os.path.basename(folder)
        events_path = os.path.join(folder, "transaction_events.csv")
        transforms_path = os.path.join(folder, "inventory_transforms.csv")
        
        if not os.path.exists(events_path) or not os.path.exists(transforms_path):
            continue
            
        # Use engine='python' and try/except for maximum stability
        try:
            events_df = pd.read_csv(events_path, encoding='ISO-8859-1', on_bad_lines='skip', engine='python')
            transforms_df = pd.read_csv(transforms_path, encoding='ISO-8859-1', on_bad_lines='skip', engine='python')
        except Exception as e:
            print(f"Skipping {scenario_name} due to error: {e}")
            continue
        
        # Normalizing column names to lowercase for easier matching
        events_df.columns = [c.lower() for c in events_df.columns]
        transforms_df.columns = [c.lower() for c in transforms_df.columns]
        
        # 1. Lesson: Process Code Descriptions
        if 'transaction_id' in events_df.columns:
            for _, row in events_df.iterrows():
                training_data.append({
                    "instruction": f"In {scenario_name}, what happened to transaction {row['transaction_id']}?",
                    "output": f"Transaction {row['transaction_id']} was a {row.get('process_code', 'EVENT')} at {row.get('warehouse_code', 'WH')}. The status was {row.get('status', 'APPROVED')} and the quantity was {row.get('total_quantity', 0)}kg. Remarks: {row.get('remarks', 'OK')}."
                })
            
        # 2. Lesson: Traceability (Lineage)
        source_col = 'source_inventory_id' if 'source_inventory_id' in transforms_df.columns else 'source_id'
        dest_col = 'destination_inventory_id' if 'destination_inventory_id' in transforms_df.columns else 'dest_id'
        
        if dest_col in transforms_df.columns:
            for _, row in transforms_df.iterrows():
                source = row.get(source_col)
                dest = row.get(dest_col)
                mode = row.get('mode', 'STAGE')
                
                if pd.isna(source) or source == "NULL" or not source:
                    instruction = f"In {scenario_name}, where did inventory lot {dest} originate from?"
                    output = f"Inventory lot {dest} was created during an INWARD process in {scenario_name}."
                else:
                    instruction = f"In {scenario_name}, what did inventory lot {source} transform into during the {mode} stage?"
                    output = f"In {scenario_name}, lot {source} transformed into lot {dest} via the {mode} process. The resulting quantity was {row.get('quantity', 0)}kg with a loss of {row.get('loss_percent', 0)}%."
                
                training_data.append({"instruction": instruction, "output": output})
            
        # 3. Lesson: Anomaly Detection (Rejections)
        if 'status' in events_df.columns:
            rejected_events = events_df[events_df['status'].astype(str).str.upper() == 'REJECTED']
            for _, row in rejected_events.iterrows():
                training_data.append({
                    "instruction": f"Explain the quality issue in {scenario_name} for transaction {row.get('transaction_id', 'N/A')}.",
                    "output": f"In {scenario_name}, transaction {row.get('transaction_id', 'N/A')} was REJECTED during {row.get('process_code', 'QC')} due to: {row.get('remarks', 'QUALITY ERROR')}."
                })

    # Save to JSONL
    with open(output_file, 'w', encoding='utf-8') as f:
        for entry in training_data:
            f.write(json.dumps(entry) + '\n')
            
    print(f"Successfully processed {len(training_data)} training examples from {len(scenario_folders)} scenarios.")

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="Process supply chain scenario CSVs into JSONL for LLM training.")
    parser.add_argument("--csv_dir", type=str, default=r"D:\archive\ARCHIVE\problem_statement_3", help="Base directory containing Scenario folders.")
    parser.add_argument("--output_path", type=str, default=r"d:\HACKNICHE 4.O\ml-service\custom_training_data.jsonl", help="Output JSONL file path.")
    
    args = parser.parse_args()
    process_scenarios(args.csv_dir, args.output_path)
