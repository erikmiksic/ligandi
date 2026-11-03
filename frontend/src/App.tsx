import { useState } from 'react'
import { extract, save } from './api'
import { MeasurementCard } from './components/MeasurementCard'
import type { Decision, ExtractResponse } from './types'
import './App.css'

type Status = 'idle' | 'extracting' | 'reviewing' | 'saving' | 'saved'

export default function App() {
  const [pdf, setPdf] = useState<File | null>(null)
  const [status, setStatus] = useState<Status>('idle')
  const [extraction, setExtraction] = useState<ExtractResponse | null>(null)
  const [decisions, setDecisions] = useState<Decision[]>([])
  const [error, setError] = useState<string | null>(null)
  const [savedRunId, setSavedRunId] = useState<number | null>(null)

  const busy = status === 'extracting' || status === 'saving'
  const locked = status === 'saving' || status === 'saved'

  const confirmed = decisions.filter((d) => d === 'confirmed').length
  const rejected = decisions.filter((d) => d === 'rejected').length
  const pending = decisions.length - confirmed - rejected

  async function handleExtract() {
    if (!pdf) return

    setStatus('extracting')
    setError(null)
    setExtraction(null)
    setDecisions([])
    setSavedRunId(null)

    try {
      const result = await extract(pdf)
      setExtraction(result)
      setDecisions(new Array<Decision>(result.rows.length).fill('pending'))
      setStatus('reviewing')
    } catch (err) {
      setError(errorMessage(err))
      setStatus('idle')
    }
  }

  function handleDecide(index: number, decision: Decision) {
    setDecisions((current) => current.map((d, i) => (i === index ? toggle(d, decision) : d)))
  }

  // Only confirmed rows are saved; the full model response is always saved with them.
  async function handleSave() {
    if (!extraction) return

    setStatus('saving')
    setError(null)

    try {
      const confirmedRows = extraction.rows.filter((_, i) => decisions[i] === 'confirmed')
      const result = await save({ ...extraction, rows: confirmedRows })
      setSavedRunId(result.run_id)
      setStatus('saved')
    } catch (err) {
      setError(errorMessage(err))
      setStatus('reviewing')
    }
  }

  return (
    <main className="page">
      <h1>Review extracted data</h1>

      <form
        className="upload"
        onSubmit={(event) => {
          event.preventDefault()
          handleExtract()
        }}
      >
        <label>
          Paper (PDF)
          <input
            type="file"
            accept="application/pdf"
            onChange={(event) => setPdf(event.target.files?.[0] ?? null)}
          />
        </label>
        <button type="submit" className="primary" disabled={!pdf || busy}>
          {status === 'extracting' ? 'Extracting… (20–90 s)' : 'Start extraction'}
        </button>
      </form>

      {error && (
        <p role="alert" className="error">
          {error}
        </p>
      )}

      {extraction && (
        <>
          <p className="meta">
            Model {extraction.model_name} · prompt {extraction.prompt_version} · suggestions:{' '}
            {extraction.rows.length}
          </p>

          {extraction.rows.length === 0 && <p>The model found no measurements in this paper.</p>}

          <ol className="cards">
            {extraction.rows.map((row, i) => (
              <li key={i}>
                <MeasurementCard
                  number={i + 1}
                  row={row}
                  decision={decisions[i]}
                  disabled={locked}
                  onDecide={(decision) => handleDecide(i, decision)}
                />
              </li>
            ))}
          </ol>

          <section className="save-bar">
            <p>
              Confirmed: {confirmed} · Rejected: {rejected} · Pending: {pending}
            </p>
            <button
              type="button"
              className="primary"
              disabled={status !== 'reviewing'}
              onClick={handleSave}
            >
              {status === 'saving' ? 'Saving…' : `Save review (${confirmed} confirmed)`}
            </button>
            {status === 'reviewing' && pending > 0 && (
              <p className="hint">Pending suggestions will not be saved.</p>
            )}
            {savedRunId !== null && (
              <p role="status" className="success">
                Saved as run {savedRunId}.
              </p>
            )}
          </section>
        </>
      )}
    </main>
  )
}

// Clicking the decision that is already selected puts the suggestion back to pending.
function toggle(current: Decision, chosen: Decision): Decision {
  return current === chosen ? 'pending' : chosen
}

function errorMessage(err: unknown): string {
  return err instanceof Error ? err.message : String(err)
}
