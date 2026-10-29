# Evaluacija

Usporedba LLM-ova na ručno anotiranom testnom skupu (`data/annotations/`).

Metrike po polju: preciznost (P), odziv (R), F1 = 2·P·R / (P + R), te trošak i vrijeme po radu.

Rezultate spremati u `results/` kao CSV ili JSON, s imenom koje sadrži datum, model i verziju prompta, npr.
`2026-12-10_gpt_extract_v1.csv`.
