import { useEffect, useState } from 'react'
import { COPY } from '../data/copy'

type Props =
  | {
      active: true
      hoursToday: number
      inOvertime: boolean
      onSetHoursToday: (hours: number) => void
      onBreak: boolean
      breakHoursToday: number
      onStartBreak: () => void
      onEndBreak: () => void
      onSetBreakHoursToday: (hours: number) => void
      onStart?: never
    }
  | {
      active: false
      hoursToday?: never
      inOvertime?: never
      onSetHoursToday?: never
      onBreak?: never
      breakHoursToday?: never
      onStartBreak?: never
      onEndBreak?: never
      onSetBreakHoursToday?: never
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
  inOvertime,
  onSetHoursToday,
  onBreak,
  breakHoursToday,
  onStartBreak,
  onEndBreak,
  onSetBreakHoursToday,
}: {
  hoursToday: number
  inOvertime: boolean
  onSetHoursToday: (hours: number) => void
  onBreak: boolean
  breakHoursToday: number
  onStartBreak: () => void
  onEndBreak: () => void
  onSetBreakHoursToday: (hours: number) => void
}) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex flex-wrap items-stretch justify-center gap-2">
        {inOvertime && (
          <span className="inline-flex items-center px-4 rounded-2xl bg-gradient-to-r from-pink-500 to-fuchsia-500 text-white font-extrabold text-sm tracking-widest border-2 border-pink-300 shadow-lg shadow-pink-500/50 animate-pulse-slow uppercase whitespace-nowrap">
            ⚡ Overtime ⚡
          </span>
        )}
        {onBreak && (
          <span className="inline-flex items-center px-4 rounded-2xl bg-white/10 text-white font-extrabold text-sm tracking-widest border-2 border-sky-300/60 uppercase whitespace-nowrap">
            ☕ {COPY.break.onBreak}
          </span>
        )}
        <EditableHours
          hoursToday={hoursToday}
          label="hours today"
          onSave={onSetHoursToday}
        />
        {onBreak ? (
          <button
            onClick={onEndBreak}
            className="px-5 py-2 rounded-2xl bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-300 hover:to-blue-400 transition font-bold text-black"
          >
            {COPY.break.end}
          </button>
        ) : (
          <button
            onClick={onStartBreak}
            className="px-5 py-2 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition font-bold text-white/80"
          >
            {COPY.break.start}
          </button>
        )}
      </div>

      <EditableHours
        hoursToday={breakHoursToday}
        label={COPY.break.breakTime}
        onSave={onSetBreakHoursToday}
        editTitle={COPY.break.editTitle}
      />
    </div>
  )
}

function EditableHours({
  hoursToday,
  label,
  onSave,
  editTitle,
}: {
  hoursToday: number
  label: string
  onSave: (hours: number) => void
  editTitle?: string
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(formatHours(hoursToday))

  useEffect(() => {
    if (!editing) setDraft(formatHours(hoursToday))
  }, [hoursToday, editing])

  const save = () => {
    const parsed = parseFloat(draft.replace(',', '.'))
    if (isFinite(parsed) && parsed >= 0) onSave(parsed)
    setEditing(false)
  }

  if (editing) {
    return (
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
        <span className="text-xl text-white/70">{label}</span>
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
    )
  }

  return (
    <button
      onClick={() => {
        setDraft(formatHours(hoursToday))
        setEditing(true)
      }}
      className="group inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition"
      title={editTitle ?? 'Edit hours'}
    >
      <span className="text-xl font-extrabold tabular-nums text-white">
        {formatHours(hoursToday)}
      </span>
      <span className="text-sm text-white/60">{label}</span>
      <span className="inline-flex items-center gap-1.5 ml-0.5 px-2 py-0.5 rounded-full bg-pink-400/15 border border-pink-300/40 text-pink-200 text-xs font-semibold group-hover:bg-pink-400/25 group-hover:border-pink-300/60 transition">
        <span aria-hidden>✎</span>
        <span>Edit</span>
      </span>
    </button>
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
