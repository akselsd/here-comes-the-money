import { useEffect, useState } from 'react'
import { COPY } from '../data/copy'

type Props =
  | {
      active: true
      hoursToday: number
      onSetHoursToday: (hours: number) => void
      onStart?: never
    }
  | {
      active: false
      hoursToday?: never
      onSetHoursToday?: never
      onStart: (startedAt?: Date) => void
    }

const formatHours = (h: number) => Number(h.toFixed(2)).toString()

// "HH:mm" → Date today; if in the future, fall back to yesterday.
function timeStringToDate(time: string): Date | null {
  const match = /^(\d{2}):(\d{2})$/.exec(time)
  if (!match) return null
  const [, hh, mm] = match
  const d = new Date()
  d.setHours(Number(hh), Number(mm), 0, 0)
  if (d.getTime() > Date.now()) d.setDate(d.getDate() - 1)
  return d
}

export function ShiftControls(props: Props) {
  if (props.active) return <ActiveControls {...props} />
  return <InactiveControls {...props} />
}

function ActiveControls({
  hoursToday,
  onSetHoursToday,
}: {
  hoursToday: number
  onSetHoursToday: (hours: number) => void
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(formatHours(hoursToday))

  useEffect(() => {
    if (!editing) setDraft(formatHours(hoursToday))
  }, [hoursToday, editing])

  const save = () => {
    const parsed = parseFloat(draft.replace(',', '.'))
    if (isFinite(parsed) && parsed >= 0) onSetHoursToday(parsed)
    setEditing(false)
  }

  return (
    <div className="flex items-center justify-center">
      {editing ? (
        <div className="flex items-center gap-2 bg-white/5 border border-pink-400/40 rounded-2xl px-4 py-3">
          <input
            type="number"
            min={0}
            step="0.25"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') save()
              if (e.key === 'Escape') setEditing(false)
            }}
            autoFocus
            className="w-24 bg-black/40 border border-white/20 rounded-lg px-3 py-2 text-2xl text-right tabular-nums focus:border-pink-400 outline-none"
          />
          <span className="text-xl text-white/70">{COPY.history.hoursSuffix} today</span>
          <button
            onClick={save}
            className="ml-2 px-3 py-2 rounded-lg bg-emerald-500/80 hover:bg-emerald-500 text-black font-bold"
          >
            {COPY.history.save}
          </button>
          <button
            onClick={() => setEditing(false)}
            className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20"
          >
            {COPY.history.cancel}
          </button>
        </div>
      ) : (
        <button
          onClick={() => {
            setDraft(formatHours(hoursToday))
            setEditing(true)
          }}
          className="group inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition"
          title="Edit hours"
        >
          <span className="text-3xl font-extrabold tabular-nums text-white">
            {formatHours(hoursToday)}
          </span>
          <span className="text-xl text-white/60">
            {COPY.history.hoursSuffix} today
          </span>
          <span className="text-white/30 group-hover:text-white/70 transition">
            ✎
          </span>
        </button>
      )}
    </div>
  )
}

function InactiveControls({ onStart }: { onStart: (startedAt?: Date) => void }) {
  const [startedAtTime, setStartedAtTime] = useState('09:00')
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <button
        onClick={() => onStart()}
        className="px-8 py-4 rounded-2xl bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-300 hover:to-emerald-400 transition font-bold text-lg text-black shadow-lg shadow-emerald-500/40"
      >
        {COPY.shift.startNow}
      </button>

      <div className="flex items-stretch gap-2 bg-white/5 border border-white/10 rounded-2xl p-2">
        <input
          type="time"
          value={startedAtTime}
          onChange={(e) => setStartedAtTime(e.target.value)}
          className="bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-lg focus:border-pink-400 outline-none"
        />
        <button
          onClick={() => {
            const picked = timeStringToDate(startedAtTime)
            if (picked) onStart(picked)
          }}
          className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 transition font-bold text-black"
        >
          {COPY.shift.startAt}
        </button>
      </div>
    </div>
  )
}
