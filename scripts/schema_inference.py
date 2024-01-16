# schema_inference.py

import json
import os

from jsonschema import Draft7Validator


def read_json_file(file_path):
    """
    Reads a JSON file and returns the data.
    """
    with open(file_path, "r") as file:
        return json.load(file)


def infer_schema(json_data):
    """
    Infers the JSON schema from the provided JSON data.
    """
    schema = Draft7Validator.infer(json_data)
    return schema


def generate_schema_for_folder(folder_path):
    """
    Generates a JSON schema based on all JSON files in the specified folder.
    """
    schemas = []
    for file in os.listdir(folder_path):
        if file.endswith(".json"):
            file_path = os.path.join(folder_path, file)
            json_data = read_json_file(file_path)
            schema = infer_schema(json_data)
            schemas.append(schema)

    # Combine schemas here if needed
    # For now, just returning the list of schemas
    return schemas
