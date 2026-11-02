Iz priloženog znanstvenog rada izdvoji podatke o eksperimentima ekstrakcije metalnih iona (aktinida i lantanida) ligandima.

PRAVILA
1. Izdvoji SAMO ono što u radu izričito piše u tekstu ili tablicama. Ne nagađaj i ne računaj sam.
2. Podatke s grafova u ovoj verziji ne izvlači.
3. Svako mjerenje je jedna točka: jedan metal, jedna vrijednost, jedni uvjeti. Tablica s 10 vrijednosti daje 10 mjerenja.
4. Ono što je zajedničko seriji (razrjeđivač, koncentracija ekstraktanta, temperatura, O/A) ide na eksperiment. Ono što se u seriji mijenja (npr. koncentracija HNO3) ide na mjerenje.
5. Svaka vrijednost je objekt V (opis dolje). Ako podatak postoji, ali ga rad ne navodi, stavi {"status": "not_reported"}. Ako nema smisla za taj sustav, stavi {"status": "not_applicable"}.
6. Za strukturu liganda (SMILES, formula) ne izmišljaj ništa: samo naziv, kraticu i klasu.
7. quote je doslovan citat iz rada, najviše 20 riječi.
8. Odgovori isključivo JSON-om u obliku ispod, bez ikakvog drugog teksta.

OBJEKT V
{
  "raw": "doslovan zapis iz rada, npr. \"< 0.01\" ili \"25 °C\"",
  "value": broj ili null,
  "unit": "jedinica kako piše u radu" ili null,
  "qualifier": "=", "<", ">", "≤", "≥" ili "~",
  "uncertainty": broj ili null,
  "status": "reported",
  "data_origin": "measured", "calculated" ili "cited",
  "evidence": {"page": broj stranice, "location": "npr. Table 2 ili Experimental", "quote": "...", "extraction_method": "text" ili "table"}
}

OBLIK ODGOVORA
{
  "schema_version": "0.1",
  "paper": {"doi": "...", "title": "...", "publication_year": broj},
  "ligands": [
    {"ligand_id": "L1", "name": "puni naziv", "abbreviation": "npr. TODGA", "ligand_class": "npr. diglycolamide"}
  ],
  "experiments": [
    {
      "experiment_id": "E1",
      "experiment_type": "liquid_liquid_extraction",
      "experiment_stage": "extraction ili stripping",
      "ligand_ids": ["L1"],
      "diluent": V,
      "extractant_concentration": V,
      "acid_type": "npr. HNO3",
      "temperature": V,
      "phase_ratio_O_A": V,
      "measurements": [
        {
          "measurement_id": "M1",
          "metal": {"element_symbol": "Am", "oxidation_state": 3},
          "quantity": "distribution_ratio",
          "acid_concentration": V,
          "value": V
        }
      ]
    }
  ]
}