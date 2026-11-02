STUPCI = [
    "doi", "experiment_id", "measurement_id",
    "ligand", "ligand_name", "ligand_class",
    "metal", "oxidation_state", "metal_conc_M",
    "experiment_type", "experiment_stage", "diluent", "extractant_conc_M",
    "acid_type", "acid_conc_M", "temperature_C", "phase_ratio_O_A",
    "quantity", "qualifier", "value", "unit", "uncertainty",
    "data_origin", "extraction_method", "page", "source_location", "quote",
    "comment",
]


def obj(x):
    return x if isinstance(x, dict) else {}


def u_retke(response):
    paper = obj(response.get("paper"))
    ligandi = {l.get("ligand_id"): l for l in response.get("ligands", [])}
    retci = []

    for exp in response.get("experiments", []):
        ligand_ids = exp.get("ligand_ids") or [None]
        lig = obj(ligandi.get(ligand_ids[0]))

        for m in exp.get("measurements", []):
            value = obj(m.get("value"))
            evidence = obj(value.get("evidence"))
            metal = obj(m.get("metal"))

            retci.append({
                "doi": paper.get("doi") or "nepoznat",
                "experiment_id": exp.get("experiment_id"),
                "measurement_id": m.get("measurement_id"),
                "ligand": lig.get("abbreviation"),
                "ligand_name": lig.get("name"),
                "ligand_class": lig.get("ligand_class"),
                "metal": metal.get("element_symbol"),
                "oxidation_state": metal.get("oxidation_state"),
                "metal_conc_M": None,
                "experiment_type": exp.get("experiment_type"),
                "experiment_stage": exp.get("experiment_stage"),
                "diluent": obj(exp.get("diluent")).get("raw"),
                "extractant_conc_M": obj(exp.get("extractant_concentration")).get("value"),
                "acid_type": exp.get("acid_type"),
                "acid_conc_M": obj(m.get("acid_concentration")).get("value"),
                "temperature_C": obj(exp.get("temperature")).get("value"),
                "phase_ratio_O_A": obj(exp.get("phase_ratio_O_A")).get("value"),
                "quantity": m.get("quantity"),
                "qualifier": value.get("qualifier"),
                "value": value.get("value"),
                "unit": value.get("unit"),
                "uncertainty": value.get("uncertainty"),
                "data_origin": value.get("data_origin"),
                "extraction_method": evidence.get("extraction_method"),
                "page": evidence.get("page"),
                "source_location": evidence.get("location"),
                "quote": evidence.get("quote"),
                "comment": None,
            })

    return retci