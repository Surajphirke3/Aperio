import os

def rename_traceflow_dirs(directory):
    for root, dirs, files in os.walk(directory, topdown=False):
        if ".git" in dirs: dirs.remove(".git")
        if "node_modules" in dirs: dirs.remove("node_modules")
        if ".next" in dirs: dirs.remove(".next")
        
        for name in dirs:
            if "traceflow" in name.lower() or "hackniche" in name.lower() or "dimensity" in name.lower():
                old_path = os.path.join(root, name)
                
                new_name = name
                new_name = new_name.replace("traceflow", "aperio").replace("TraceFlow", "Aperio").replace("Traceflow", "Aperio")
                new_name = new_name.replace("hackniche", "aperio").replace("HackNiche", "Aperio").replace("Hackniche", "Aperio")
                new_name = new_name.replace("dimensity", "aperio").replace("Dimensity", "Aperio")
                
                if new_name != name:
                    new_path = os.path.join(root, new_name)
                    os.rename(old_path, new_path)
                    print(f"Renamed dir: {old_path} -> {new_path}")
        
        for name in files:
            if "traceflow" in name.lower() or "hackniche" in name.lower() or "dimensity" in name.lower():
                old_path = os.path.join(root, name)
                
                new_name = name
                new_name = new_name.replace("traceflow", "aperio").replace("TraceFlow", "Aperio").replace("Traceflow", "Aperio")
                new_name = new_name.replace("hackniche", "aperio").replace("HackNiche", "Aperio").replace("Hackniche", "Aperio")
                new_name = new_name.replace("dimensity", "aperio").replace("Dimensity", "Aperio")
                
                if new_name != name:
                    new_path = os.path.join(root, new_name)
                    os.rename(old_path, new_path)
                    print(f"Renamed file: {old_path} -> {new_path}")

if __name__ == "__main__":
    rename_traceflow_dirs(r"d:\HackNiche4.0")
