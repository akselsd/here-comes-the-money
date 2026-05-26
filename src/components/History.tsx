import { useState } from 'react'
import { COPY } from '../data/copy'
import { computeEarnings, todayKey } from '../hooks/useShiftTracker'
import type { DayEntry, Settings } from '../types'

const fmtNOK = new Intl.NumberFormat('nb-NO', {
  style: 'currency',
  currency: 'NOK',
  maximumFractionDigits: 0,
})

const fmtDate = new Intl.DateTimeFormat('en-GB', {
  weekday: 'short',
  day: '2-digit',
  month: 'short',
})

// Trim trailing zeros for cleaner display ("7" not "7.00", "7.5" not "7.50").
const formatHours = (h: number) => Number(h.toFixed(2)).toString()

function computeStreak(days: DayEntry[]): number {
  if (days.length === 0) return 0
  const set = new Set(days.map((d) => d.dayKey))
  const pad = (n: number) => String(n).padStart(2, '0')
  const keyOf = (d: Date) =>
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`

  let streak = 0
  const cursor = new Date()
  cursor.setHours(0, 0, 0, 0)
  while (true) {
    const key = keyOf(cursor)
    if (set.has(key)) {
      streak++
      cursor.setDate(cursor.getDate() - 1)
    } else {
      // tolerate today being empty if yesterday is logged
      if (streak === 0) {
        cursor.setDate(cursor.getDate() - 1)
        if (set.has(keyOf(cursor))) continue
      }
      break
    }
  }
  return streak
}

type Props = {
  days: DayEntry[]
  settings: Settings
  activeDayKey: string | null
  liveHoursToday: number
  onClear: () => void
  onSetHoursForDay: (dayKey: string, hours: number) => void
  onDelete: (dayKey: string) => void
}

export function History({
  days,
  settings,
  activeDayKey,
  liveHoursToday,
  onClear,
  onSetHoursForDay,
  onDelete,
}: Props) {
  const today = todayKey()

  // Build the display list: union of stored days + the active day (which may not be
  // committed yet but should show as a live row).
  const dayMap = new Map<string, number>()
  for (const d of days) dayMap.set(d.dayKey, d.hoursWorked)
  if (activeDayKey != null) {
    dayMap.set(activeDayKey, liveHoursToday)
  }
  const rows = Array.from(dayMap.entries())
    .map(([dayKey, hours]) => ({ dayKey, hours }))
    .sort((a, b) => (a.dayKey < b.dayKey ? 1 : -1))

  const total = rows.reduce(
    (acc, r) => acc + computeEarnings(r.hours, settings),
    0,
  )
  const streak = computeStreak(rows.map((r) => ({ dayKey: r.dayKey, hoursWorked: r.hours })))

  return (
    <section className="w-full max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4 px-1">
        <h2 className="text-2xl font-bold">{COPY.history.heading}</h2>
        {rows.length > 0 && (
          <button
            onClick={() => {
              if (confirm(COPY.history.confirmClear)) onClear()
            }}
            className="text-xs text-white/50 hover:text-white/80"
          >
            {COPY.history.clear}
          </button>
        )}
      </div>

      {rows.length > 0 && (
        <div className="grid grid-cols-2 gap-3 mb-4">
          <Stat label={COPY.history.totalEarned} value={fmtNOK.format(total)} />
          <Stat label={COPY.history.streak} value={`${streak} 🔥`} />
        </div>
      )}

      {rows.length === 0 ? (
        <div className="text-center text-white/50 py-8 px-6 bg-white/5 rounded-2xl border border-white/10">
          {COPY.history.empty}
        </div>
      ) : (
        <ul className="space-y-2">
          {rows.map((r) => (
            <DayRow
              key={r.dayKey}
              dayKey={r.dayKey}
              hours={r.hours}
              isToday={r.dayKey === today}
              isActive={r.dayKey === activeDayKey}
              earnings={computeEarnings(r.hours, settings)}
              onSetHours={onSetHoursForDay}
              onDelete={onDelete}
            />
          ))}
        </ul>
      )}
    </section>
  )
}

function DayRow({
  dayKey,
  hours,
  isToday,
  isActive,
  earnings,
  onSetHours,
  onDelete,
}: {
  dayKey: string
  hours: number
  isToday: boolean
  isActive: boolean
  earnings: number
  onSetHours: (dayKey: string, hours: number) => void
  onDelete: (dayKey: string) => void
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(formatHours(hours))

  const startEdit = () => {
    setDraft(formatHours(hours))
    setEditing(true)
  }

  const save = () => {
    const parsed = parseFloat(draft.replace(',', '.'))
    if (isFinite(parsed) && parsed >= 0) {
      onSetHours(dayKey, parsed)
    }
    setEditing(false)
  }

  // Parse YYYY-MM-DD as a local date for display (avoid UTC drift).
  const [y, m, d] = dayKey.split('-').map(Number)
  const displayDate = new Date(y, m - 1, d)

  return (
    <li
      className={`bg-white/5 border rounded-xl px-4 py-3 ${
        isActive ? 'border-emerald-400/60 shadow shadow-emerald-500/20' : 'border-white/10'
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="font-medium flex items-center gap-2">
            {fmtDate.format(displayDate)}
            {isToday && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-semibold">
                {COPY.history.today}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {editing ? (
            <label className="flex items-center gap-2">
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
                className="w-20 bg-black/40 border border-white/20 rounded-lg px-2 py-1 text-right tabular-nums focus:border-pink-400 outline-none"
              />
              <span className="text-sm text-white/60">{COPY.history.hoursSuffix}</span>
            </label>
          ) : (
            <button
              onClick={startEdit}
              className="text-right tabular-nums hover:text-pink-300 transition"
              title={COPY.history.edit}
            >
              <span className="font-bold">{formatHours(hours)}</span>
              <span className="text-sm text-white/60 ml-1">{COPY.history.hoursSuffix}</span>
            </button>
          )}

          <div className="text-xl font-bold text-amber-300 whitespace-nowrap min-w-[5rem] text-right tabular-nums">
            {fmtNOK.format(earnings)}
          </div>
        </div>
      </div>

      <div className="mt-2 flex items-center justify-end gap-2 text-xs">
        {editing ? (
          <>
            <button
              onClick={save}
              className="px-3 py-1 rounded-md bg-emerald-500/80 hover:bg-emerald-500 text-black font-bold"
            >
              {COPY.history.save}
            </button>
            <button
              onClick={() => setEditing(false)}
              className="px-3 py-1 rounded-md bg-white/10 hover:bg-white/20"
            >
              {COPY.history.cancel}
            </button>
          </>
        ) : (
          <>
            <button
              onClick={startEdit}
              className="px-2 py-1 rounded-md text-white/60 hover:text-white hover:bg-white/10"
            >
              ✎ {COPY.history.edit}
            </button>
            <button
              onClick={() => {
                if (confirm(COPY.history.confirmDelete)) onDelete(dayKey)
              }}
              className="px-2 py-1 rounded-md text-white/40 hover:text-red-300 hover:bg-red-500/10"
            >
              {COPY.history.delete}
            </button>
          </>
        )}
      </div>
    </li>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3">
      <div className="text-xs text-white/50 uppercase tracking-wide">{label}</div>
      <div className="text-xl font-bold mt-1">{value}</div>
    </div>
  )
}
