# Frontend
 
Sučelje u Reactu i TypeScriptu (izrađeno uz Vite) za pregled podataka koje LLM izdvaja iz radova: odabereš PDF, pokreneš izdvajanje, potvrdiš ili odbaciš svako predloženo mjerenje i spremiš pregled u bazu.
 
## Potrebno
 
- [Node.js](https://nodejs.org) (LTS verzija) s npm-om
- pokrenut backend na http://127.0.0.1:8000 (vidi [`../backend/README.md`](../backend/README.md))
## Postavljanje (jednom)
 
```bash
cd frontend
npm install
```
 
## Pokretanje
 
Potrebna su dva terminala.
 
**1. Backend**
 
```bash
cd backend
.venv\Scripts\activate          # macOS/Linux: source .venv/bin/activate
uvicorn app.main:app --reload
```
 
**2. Sučelje**
 
```bash
cd frontend
npm run dev
```
 
Otvori http://localhost:5173.
 
Sve npm naredbe pokreću se u mapi `frontend`. Zahtjeve na `/api/...` Vite prosljeđuje backendu (`server.proxy` u `vite.config.ts`), pa CORS ne treba posebno podešavati.
 
## Naredbe
 
| Naredba | Što radi |
| --- | --- |
| `npm run dev` | pokreće razvojni poslužitelj koji se osvježava pri svakoj izmjeni |
| `npm run build` | provjerava tipove (`tsc`) i gradi aplikaciju u mapu `dist/` |
| `npm run preview` | lokalno poslužuje build iz `dist/` |
| `npm run lint` | pokreće ESLint |
 
Prije otvaranja pull requesta pokreni `npm run build`, jer razvojni poslužitelj ne provjerava tipove.
 
## Kako se koristi
 
1. Odaberi PDF i klikni **Start extraction**. Model obično treba 20–90 sekundi.
2. Svaki okvir je jedno mjerenje koje je predložio model: lijevo su citat i mjesto u radu, desno izdvojeni podaci. Crvena poruka znači da model nije naveo citat, pa tu vrijednost provjeri u radu.
3. Na svakom okviru klikni **Confirm** ili **Reject**. Ponovni klik na isti gumb poništava odluku. **Edit** još ne radi.
4. Klikni **Save review**. Backend sprema cijeli odgovor modela i samo potvrđene retke kao jedan prolaz u `backend/ligandi.db`.
Baza je lokalna datoteka na tvom računalu i nije u Gitu, pa ostali članovi tima ne vide tvoje spremljene preglede.
 
## Struktura
 
```text
src/
├── main.tsx                    ulazna točka
├── App.tsx                     stranica: obrazac za PDF, popis okvira, traka za spremanje i stanje pregleda
├── App.css                     stilovi stranice i okvira
├── index.css                   osnovni stilovi
├── api.ts                      pozivi backenda: POST /api/extract i POST /api/save
├── types.ts                    tipovi podataka: Row, ExtractResponse, Decision
└── components/
    └── MeasurementCard.tsx     jedan okvir: lijevo dokaz iz rada, desno podaci, gumbi za odluku
```
 
## Poznata ograničenja
 
- Odluke se pamte samo u pregledniku dok ne klikneš **Save review**; ponovnim učitavanjem stranice gube se.
- Svako spremanje stvara novi prolaz, čak i za isti rad.
- Vrijednosti se prikazuju točno kako ih vrati backend; jedinice se ne pretvaraju.
- Uređivanje okvira još ne radi.
## Rješavanje problema
 
| Problem | Rješenje |
| --- | --- |
| `Could not read package.json` | nisi u mapi `frontend`: `cd frontend` |
| greška 502 s `503` u poruci | Gemini je preopterećen: promijeni `GEMINI_MODEL` u `.env` i ponovno pokreni backend |
| greška 500, 404 ili „Failed to fetch” | backend ne radi ili `npm run dev` nije ponovno pokrenut nakon izmjene `vite.config.ts` |
| editor javlja „Cannot find module”, a `npm run build` prolazi | u VS Codeu: Ctrl+Shift+P → **TypeScript: Restart TS Server** |
| `npm install` javlja `ERESOLVE` i spominje TypeScript | TypeScript je namjerno na `~6.0`, jer `typescript-eslint` još ne podržava verziju 7; ne nadograđuj ga i ne koristi `--force` |
```
