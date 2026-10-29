# Ekstrakcija

Tok podataka: **PDF → tekst i tablice → LLM → JSON (prema shemi) → prijedlozi u bazi**.

- `schema/` – JSON shema polja koja se izdvajaju.
- `prompts/` – promptovi kao zasebne datoteke s verzijom u imenu (`extract_v1.md`, `extract_v2.md` …),
  kako bi se u evaluaciji znalo koji je prompt dao koji rezultat.

Pravilo: uz svaku izdvojenu vrijednost model mora vratiti i **doslovan citat iz rada** na kojem se temelji,
kako bi je čovjek mogao brzo provjeriti.
