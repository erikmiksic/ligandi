import json

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from .db import get_connection, init_db
from .llm import PROMPT_VERSION, izdvoji_iz_pdf, model_name
from .pretvorba import STUPCI, u_retke

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
        "rows": u_retke(response),
    }


class SaveRequest(BaseModel):
    model_name: str
    prompt_version: str
    response: dict
    rows: list[dict]


@app.post("/api/save")
def save(data: SaveRequest):
    doi = data.response.get("paper", {}).get("doi") or "nepoznat"
    conn = get_connection()

    cursor = conn.execute(
        "INSERT INTO runs (doi, model_name, prompt_version, response_json) VALUES (?, ?, ?, ?)",
        (doi, data.model_name, data.prompt_version, json.dumps(data.response, ensure_ascii=False)),
    )
    run_id = cursor.lastrowid

    stupci = ["run_id"] + STUPCI
    upitnici = ", ".join("?" for _ in stupci)
    sql = f"INSERT INTO measurements ({', '.join(stupci)}) VALUES ({upitnici})"

    for row in data.rows:
        vrijednosti = [run_id] + [row.get(s) for s in STUPCI]
        conn.execute(sql, vrijednosti)

    conn.commit()
    conn.close()

    return {"run_id": run_id, "saved_rows": len(data.rows)}