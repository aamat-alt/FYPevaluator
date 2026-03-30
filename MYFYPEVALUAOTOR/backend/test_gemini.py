import os
from dotenv import load_dotenv
import google.genai as genai

# Load environment variables from .env
load_dotenv()

# Configure the API
api_key = os.getenv('GEMINI_API_KEY')
if not api_key:
    print("ERROR: GEMINI_API_KEY not found in .env file")
    exit(1)

genai.configure(api_key=api_key)

# List all available models
print("Available Gemini Models:")
print("-" * 60)

try:
    models = genai.models.list()
    for model in models:
        print(f"Model: {model.name}")
        print(f"  Display Name: {model.display_name}")
        print(f"  Description: {model.description}")
        print()
except Exception as e:
    print(f"ERROR: Failed to list models: {str(e)}")
    exit(1)
