# Backend

FastAPI + SQLite. Prima PDF rada, šalje ga Geminiju i sprema potvrđene podatke u `ligandi.db`.

## Postavljanje (jednom)

1. U korijenu repozitorija kopiraj `.env.example` u `.env` i upiši `GOOGLE_API_KEY` (aistudio.google.com → Get API key).
2. U mapi `backend`:
   ```
   python -m venv .venv
   .venv\Scripts\activate          (Linux/macOS: source .venv/bin/activate)
   pip install -r requirements.txt
   ```

## Pokretanje

```
cd backend
.venv\Scripts\activate
uvicorn app.main:app --reload
```

## Testiranje

1. Otvori http://127.0.0.1:8000/docs.
2. **POST /api/extract** → Try it out → odaberi PDF → Execute (20–90 s).
   Vraća `response` (izvorni JSON modela) i `rows` (jedan redak = jedno mjerenje). Ništa ne sprema.
3. Kopiraj cijeli odgovor.
4. **POST /api/save** → Try it out → zalijepi odgovor u Request body. Po želji izmijeni ili obriši retke u `rows` → Execute **jednom** (svaki klik je novo spremanje).
5. Otvori `ligandi.db` u DB Browser for SQLite → Browse Data: `runs` (izvorni odgovori) i `measurements` (spremljeni retci).

Ako Gemini vrati `503`, model je preopterećen: promijeni `GEMINI_MODEL` u `.env` i ponovno pokreni server.

## Datoteke

- `app/db.py` – tablice `runs` i `measurements`
- `app/llm.py` – poziv Geminija; prompt iz `extraction/prompts/`
- `app/pretvorba.py` – JSON modela → ravni retci
- `app/main.py` – endpointi

Ako se promijene stupci u `db.py`, obriši `ligandi.db` i ponovno pokreni server.

## Poznata ograničenja

- Grafovi se još ne izvlače.
- Faktor separacije zasad se sprema kao mjerenje (popravak u `extract_v3`).
- Jedinice se ne preračunavaju (pretpostavlja se mol/L i °C).
