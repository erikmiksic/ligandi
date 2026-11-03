import { Fragment } from 'react'
import type { Decision, Row } from '../types'

const DECISION_LABELS: Record<Decision, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  rejected: 'Rejected',
}

// Fields shown on the right, below the measured value, in this order.
const DETAILS = [
  { key: 'ligand', label: 'Ligand' },
  { key: 'ligand_name', label: 'Full name' },
  { key: 'metal', label: 'Metal' },
  { key: 'oxidation_state', label: 'Oxidation state' },
  { key: 'quantity', label: 'Quantity' },
  { key: 'acid_type', label: 'Acid' },
  { key: 'acid_conc_M', label: 'Acid concentration (M)' },
  { key: 'diluent', label: 'Diluent' },
  { key: 'extractant_conc_M', label: 'Extractant concentration (M)' },
  { key: 'temperature_C', label: 'Temperature (°C)' },
  { key: 'experiment_stage', label: 'Experiment stage' },
  { key: 'data_origin', label: 'Data origin' },
]

interface MeasurementCardProps {
  number: number
  row: Row
  decision: Decision
  disabled: boolean
  onDecide: (decision: Decision) => void
}

/** One suggestion from the model: evidence from the paper on the left, extracted data on the right. */
export function MeasurementCard({ number, row, decision, disabled, onDecide }: MeasurementCardProps) {
  const source = formatSource(row)

  return (
    <article className={`card card-${decision}`}>
      <header className="card-header">
        <span>
          #{number} · experiment {show(row.experiment_id)}, measurement {show(row.measurement_id)}
        </span>
        <strong className="card-status">{DECISION_LABELS[decision]}</strong>
      </header>

      <div className="card-body">
        <section>
          {row.quote ? (
            <blockquote className="quote">{row.quote}</blockquote>
          ) : (
            <p className="no-quote">The model gave no quote, so check this value in the paper.</p>
          )}
          {source && <p className="source">{source}</p>}
        </section>

        <section>
          <p className="value">{formatValue(row)}</p>
          <dl className="details">
            {DETAILS.map(({ key, label }) => (
              <Fragment key={key}>
                <dt>{label}</dt>
                <dd>{show(row[key])}</dd>
              </Fragment>
            ))}
          </dl>
        </section>
      </div>

      <footer className="card-actions">
        <button
          type="button"
          className="confirm"
          aria-pressed={decision === 'confirmed'}
          disabled={disabled}
          onClick={() => onDecide('confirmed')}
        >
          Confirm
        </button>
        <button type="button" disabled title="Coming in the next version">
          Edit
        </button>
        <button
          type="button"
          className="reject"
          aria-pressed={decision === 'rejected'}
          disabled={disabled}
          onClick={() => onDecide('rejected')}
        >
          Reject
        </button>
      </footer>
    </article>
  )
}

function isEmpty(value: string | number | null | undefined): boolean {
  return value === null || value === undefined || value === ''
}

function show(value: string | number | null | undefined): string {
  return isEmpty(value) ? '—' : String(value)
}

// The measured value with its qualifier, uncertainty and unit, e.g. "< 0.01" or "45 ± 2 %".
function formatValue(row: Row): string {
  if (isEmpty(row.value)) return '—'

  const qualifier = isEmpty(row.qualifier) || row.qualifier === '=' ? '' : `${row.qualifier} `
  const uncertainty = isEmpty(row.uncertainty) ? '' : ` ± ${row.uncertainty}`
  const unit = isEmpty(row.unit) ? '' : ` ${row.unit}`

  return `${qualifier}${row.value}${uncertainty}${unit}`
}

// Where in the paper the value was found, e.g. "p. 5 · Table 3 · table".
function formatSource(row: Row): string {
  const parts = [
    isEmpty(row.page) ? null : `p. ${row.page}`,
    row.source_location,
    row.extraction_method,
  ]
  return parts.filter((part) => !isEmpty(part)).join(' · ')
}