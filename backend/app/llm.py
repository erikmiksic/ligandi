import json
import os
from pathlib import Path

from dotenv import load_dotenv
from google import genai
from google.genai import types

ROOT = Path(__file__).resolve().parent.parent.parent
load_dotenv(ROOT / ".env")

PROMPT_VERSION = "extract_v2"
PROMPT_PATH = ROOT / "extraction" / "prompts" / f"{PROMPT_VERSION}.md"


def model_name():
    return os.environ["GEMINI_MODEL"]


def izdvoji_iz_pdf(pdf_bytes):
    prompt = PROMPT_PATH.read_text(encoding="utf-8")
    client = genai.Client(api_key=os.environ["GOOGLE_API_KEY"])

    response = client.models.generate_content(
        model=model_name(),
        contents=[
            types.Part.from_bytes(data=pdf_bytes, mime_type="application/pdf"),
            prompt,
        ],
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            temperature=0,
        ),
    )
    return json.loads(response.text)