# main.py

import os
from schema_inference import generate_schema_for_folder

def main():
    folder_path = '../src/data'  # Replace with your folder path containing JSON files
    if not os.path.exists(folder_path):
        print("Folder not found. Please ensure the path is correct.")
        return

    schemas = generate_schema_for_folder(folder_path)
    for idx, schema in enumerate(schemas):
        print(f"Schema for file {idx + 1}:\n", schema)

if __name__ == "__main__":
    main()
