# Ligandi – izdvajanje podataka iz literature pomoću LLM-a

Projekt R, FER, 2026./2027.

Sustav za poluautomatsko izdvajanje podataka o ligandima i eksperimentalnim uvjetima iz znanstvenih radova.
LLM predlaže strukturirane podatke iz PDF-a, a čovjek ih pregledava, ispravlja i potvrđuje prije unosa u bazu.
Uz to se uspoređuje nekoliko različitih LLM-ova na istom zadatku.

## Tim

| Član | Zaduženje |
|------|-----------|
| Elide Babić | |
| Pavao Knez | |
| Ena Špoler | |
| Erik Mikšič| |

Mentor: 

## Struktura repozitorija

```
frontend/      React + TypeScript – sučelje za pregled i potvrdu podataka
backend/       Python API + baza podataka
extraction/    PDF → tekst/tablice → LLM → JSON
  prompts/     promptovi (verzionirani, kao zasebne datoteke)
  schema/      JSON shema polja koja se izdvajaju
evaluation/    usporedba modela, metrike, rezultati
data/
  papers/      PDF-ovi radova – NE ulaze u git (vidi data/papers/README.md)
  annotations/ ručno anotirani testni skup (ulazi u git)
docs/          dokumentacija projekta i zapisnici sastanaka
```

## Pokretanje

1. Kopiraj `.env.example` u `.env` i upiši svoje API ključeve:
   ```bash
   cp .env.example .env
   ```
2. Upute za pojedini dio nalaze se u `README.md` unutar `frontend/`, `backend/` i `extraction/`.

## Način rada

- **Nitko ne pusha direktno na `main`.** Za svaki zadatak napravi novu granu:
  ```bash
  git switch main && git pull
  git switch -c feature/kratak-opis
  ```
  Nazivi grana: `feature/...` za novu funkcionalnost, `fix/...` za ispravak, `docs/...` za dokumentaciju.
- Kad je zadatak gotov, otvori **pull request** prema `main`. Prije spajanja ga pregleda barem jedan drugi član tima.
- Svaki zadatak ima svoj **issue** i osobu koja je zadužena za njega. Napredak se prati na GitHub Projects ploči.
- Commit poruke pišemo kratko i u imperativu: `Dodaj parsiranje tablica iz PDF-a`, `Ispravi validaciju sheme`.
- **API ključevi nikad ne idu u git.** Drže se samo u `.env`. Ako ključ ipak završi u gitu, odmah ga promijeni kod providera.
