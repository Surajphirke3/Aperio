import os

replacements = {
    "TraceFlow": "Aperio",
    "Traceflow": "Aperio",
    "traceflow": "aperio",
    "HackNiche 4.0": "Aperio",
    "HackNiche": "Aperio",
    "Dimensity Labs": "Aperio",
    "Dimensity": "Aperio"
}

def process_dir(directory):
    for root, dirs, files in os.walk(directory):
        if ".git" in dirs: dirs.remove(".git")
        if "node_modules" in dirs: dirs.remove("node_modules")
        if ".next" in dirs: dirs.remove(".next")
        if "docs" in root and "progress.md" in files:
            # Let's not unnecessarily change too many things in progress.md if not needed,
            # but we can change it to Aperio
            pass
            
        for file in files:
            if file == "rename.py" or file.endswith(".png") or file.endswith(".svg") or file.endswith(".ico") or file == "package-lock.json":
                continue
                
            filepath = os.path.join(root, file)
            try:
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                new_content = content
                for old_val, new_val in replacements.items():
                    new_content = new_content.replace(old_val, new_val)
                
                if new_content != content:
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                    print(f"Updated {filepath}")
            except Exception as e:
                pass

if __name__ == "__main__":
    process_dir(r"d:\HackNiche4.0")
