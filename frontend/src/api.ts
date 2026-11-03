import type { ExtractResponse } from './types'

export async function extract(file: File): Promise<ExtractResponse> {
    const form = new FormData()
    form.append('pdf', file)
    const res = await fetch('/api/extract', { 
        method: 'POST', 
        body: form,
    })

    if (!res.ok) throw new Error(await errorText(res))
    return res.json()
}

export async function save(data: ExtractResponse): Promise<{ run_id: number; saved_rows: number }> {
    const res = await fetch('/api/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error(await errorText(res))
    return res.json()
}

async function errorText(res: Response): Promise<string> {
    try {
        const body = await res.json()
        return `${res.status}: ${JSON.stringify(body.detail ?? body)}`
    } catch {
        return `${res.status} ${res.statusText}`
    }
}