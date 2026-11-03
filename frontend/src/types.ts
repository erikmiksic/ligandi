// Shapes of the data exchanged with the backend.

/** One measurement that the model extracted from a paper. */
export type Row = Record<string, string | number | null>

/** Response of POST /api/extract. POST /api/save accepts the same shape with the selected rows. */
export type ExtractResponse = {
    model_name: string
    prompt_version: string
    response: Record<string, unknown>
    rows: Row[]
}

/** The reviewer's decision about one suggestion from the model. */
export type Decision = 'pending' | 'confirmed' | 'rejected'
