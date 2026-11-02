import sqlite3
from pathlib import Path

DB_PATH = Path(__file__).resolve().parent.parent / "ligandi.db"


def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_connection()
    conn.executescript("""
        CREATE TABLE IF NOT EXISTS runs (
            id             INTEGER PRIMARY KEY,
            doi            TEXT NOT NULL,
            model_name     TEXT NOT NULL,
            prompt_version TEXT NOT NULL,
            created_at     TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
            response_json  TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS measurements (
            id                INTEGER PRIMARY KEY,

            -- veza na prolaz i na mjesto u JSON-u
            run_id            INTEGER NOT NULL REFERENCES runs(id),
            doi               TEXT NOT NULL,
            experiment_id     TEXT,
            measurement_id    TEXT,

            -- ligand
            ligand            TEXT,
            ligand_name       TEXT,
            ligand_class      TEXT,

            -- metal
            metal             TEXT,
            oxidation_state   INTEGER,
            metal_conc_M      REAL,

            -- sustav i uvjeti
            experiment_type   TEXT,
            experiment_stage  TEXT,
            diluent           TEXT,
            extractant_conc_M REAL,
            acid_type         TEXT,
            acid_conc_M       REAL,
            temperature_C     REAL,
            phase_ratio_O_A   REAL,

            -- rezultat
            quantity          TEXT,
            qualifier         TEXT,
            value             REAL,
            unit              TEXT,
            uncertainty       REAL,

            -- dokaz iz rada
            data_origin       TEXT,
            extraction_method TEXT,
            page              INTEGER,
            source_location   TEXT,
            quote             TEXT,

            comment           TEXT
        );
    """)
    conn.close()