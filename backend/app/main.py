from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from .db import init_db
from .llm import PROMPT_VERSION, izdvoji_iz_pdf, model_name

app = FastAPI(title="Ligandi API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

init_db()


@app.get("/api/health")
def health():
    return {"status": "ok"}


@app.post("/api/extract")
def extract(pdf: UploadFile = File(...)):
    pdf_bytes = pdf.file.read()

    try:
        response = izdvoji_iz_pdf(pdf_bytes)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Poziv modela nije uspio: {e}")

    return {
        "model_name": model_name(),
        "prompt_version": PROMPT_VERSION,
        "response": response,
    }