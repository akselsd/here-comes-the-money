import { useState } from 'react'
import { COPY } from '../data/copy'
import type { Settings } from '../types'

type Props = {
  initial: Settings
  onSave: (s: Settings) => void
  onCancel?: () => void
  canCancel?: boolean
}

export function SetupForm({ initial, onSave, onCancel, canCancel }: Props) {
  const [draft, setDraft] = useState<Settings>(initial)

  const update = <K extends keyof Settings>(key: K, value: Settings[K]) =>
    setDraft((d) => ({ ...d, [key]: value }))

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onSave(draft)
      }}
      className="w-full max-w-md mx-auto bg-white/5 backdrop-blur rounded-3xl p-8 border border-white/10 shadow-2xl"
    >
      <h2 className="text-3xl font-bold mb-6 text-gradient-pink">{COPY.setup.heading}</h2>

      <Field label={COPY.setup.name}>
        <input
          type="text"
          value={draft.name}
          onChange={(e) => update('name', e.target.value)}
          placeholder={COPY.setup.namePlaceholder}
          className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-lg focus:border-pink-400 outline-none"
        />
      </Field>

      <Field label={COPY.setup.hourlyRate}>
        <input
          type="number"
          min={0}
          step="1"
          value={draft.hourlyRateNOK}
          onChange={(e) => update('hourlyRateNOK', Number(e.target.value))}
          className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-lg focus:border-pink-400 outline-none"
          required
        />
      </Field>

      <Field label={COPY.setup.overtimeMultiplier}>
        <input
          type="number"
          min={1}
          step="0.1"
          value={draft.overtimeMultiplier}
          onChange={(e) => update('overtimeMultiplier', Number(e.target.value))}
          className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-lg focus:border-pink-400 outline-none"
          required
        />
      </Field>

      <Field label={COPY.setup.overtimeAfterHours}>
        <input
          type="number"
          min={0}
          step="0.5"
          value={draft.overtimeAfterHours}
          onChange={(e) => update('overtimeAfterHours', Number(e.target.value))}
          className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-lg focus:border-pink-400 outline-none"
          required
        />
      </Field>

      <div className="flex gap-3 mt-6">
        <button
          type="submit"
          className="flex-1 bg-gradient-to-r from-pink-500 to-fuchsia-500 hover:from-pink-400 hover:to-fuchsia-400 transition rounded-xl px-6 py-3 font-bold text-lg shadow-lg shadow-pink-500/30"
        >
          {COPY.setup.save}
        </button>
        {canCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition"
          >
            {COPY.setup.cancel}
          </button>
        )}
      </div>
    </form>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block mb-4">
      <span className="block text-sm font-medium text-white/70 mb-2">{label}</span>
      {children}
    </label>
  )
}
