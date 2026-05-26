import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useLocalStorage } from './useLocalStorage'
import type { DayEntry, Settings, ShiftSession } from '../types'

const DEFAULT_SETTINGS: Settings = {
  hourlyRateNOK: 400,
  overtimeMultiplier: 1.5,
  overtimeAfterHours: 8,
  name: '',
}

export function computeEarnings(hours: number, s: Settings): number {
  const regular = Math.min(hours, s.overtimeAfterHours)
  const overtime = Math.max(0, hours - s.overtimeAfterHours)
  return regular * s.hourlyRateNOK + overtime * s.hourlyRateNOK * s.overtimeMultiplier
}

export function dayKeyOf(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

export function todayKey(): string {
  return dayKeyOf(new Date())
}

export function useShiftTracker() {
  const [settings, setSettings] = useLocalStorage<Settings>(
    'hctm:settings',
    DEFAULT_SETTINGS,
  )
  const [activeShift, setActiveShift] = useLocalStorage<ShiftSession | null>(
    'hctm:activeShift',
    null,
  )
  const [days, setDays] = useLocalStorage<DayEntry[]>('hctm:history', [])

  const [now, setNow] = useState<number>(() => Date.now())
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    if (!activeShift) {
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
      return
    }
    let mounted = true
    const tick = () => {
      if (!mounted) return
      setNow(Date.now())
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => {
      mounted = false
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current)
    }
  }, [activeShift])

  // Running segment is always credited to the day the shift was started on.
  const activeDayKey = activeShift ? dayKeyOf(activeShift.startedAt) : null
  const runningHours = activeShift
    ? Math.max(0, (now - new Date(activeShift.startedAt).getTime()) / 3_600_000)
    : 0

  const daysByKey = useMemo(() => {
    const m = new Map<string, number>()
    for (const d of days) m.set(d.dayKey, d.hoursWorked)
    return m
  }, [days])

  const committedHoursForActiveDay = activeDayKey
    ? daysByKey.get(activeDayKey) ?? 0
    : 0
  const liveHoursToday = committedHoursForActiveDay + runningHours
  const earnings = computeEarnings(liveHoursToday, settings)
  const inOvertime = liveHoursToday > settings.overtimeAfterHours

  const startShift = useCallback(
    (startedAt?: Date) => {
      const when = startedAt ?? new Date()
      setActiveShift({ startedAt: when.toISOString() })
    },
    [setActiveShift],
  )

  // Add hours to the day bucket and clear active state.
  const commitRunningToDay = useCallback(
    (extraHours: number, dayKey: string) => {
      if (extraHours <= 0) return
      setDays((prev) => {
        const idx = prev.findIndex((d) => d.dayKey === dayKey)
        if (idx === -1) {
          return [{ dayKey, hoursWorked: extraHours }, ...prev].sort((a, b) =>
            a.dayKey < b.dayKey ? 1 : -1,
          )
        }
        const next = [...prev]
        next[idx] = { ...next[idx], hoursWorked: next[idx].hoursWorked + extraHours }
        return next
      })
    },
    [setDays],
  )

  const stopShift = useCallback(() => {
    if (!activeShift) return
    const dayKey = dayKeyOf(activeShift.startedAt)
    const extra = Math.max(0, (Date.now() - new Date(activeShift.startedAt).getTime()) / 3_600_000)
    commitRunningToDay(extra, dayKey)
    setActiveShift(null)
  }, [activeShift, commitRunningToDay, setActiveShift])

  const setHoursForDay = useCallback(
    (dayKey: string, newHours: number) => {
      const clamped = Math.max(0, newHours)
      // If the active shift belongs to this day, restart the segment from now
      // so the live counter continues from the new total.
      if (activeShift && dayKeyOf(activeShift.startedAt) === dayKey) {
        setActiveShift({ startedAt: new Date().toISOString() })
      }
      setDays((prev) => {
        const idx = prev.findIndex((d) => d.dayKey === dayKey)
        if (idx === -1) {
          if (clamped === 0) return prev
          return [{ dayKey, hoursWorked: clamped }, ...prev].sort((a, b) =>
            a.dayKey < b.dayKey ? 1 : -1,
          )
        }
        if (clamped === 0) return prev.filter((d) => d.dayKey !== dayKey)
        const next = [...prev]
        next[idx] = { ...next[idx], hoursWorked: clamped }
        return next
      })
    },
    [activeShift, setActiveShift, setDays],
  )

  const deleteDay = useCallback(
    (dayKey: string) => {
      // If active shift is for this day, end it.
      if (activeShift && dayKeyOf(activeShift.startedAt) === dayKey) {
        setActiveShift(null)
      }
      setDays((prev) => prev.filter((d) => d.dayKey !== dayKey))
    },
    [activeShift, setActiveShift, setDays],
  )

  const clearHistory = useCallback(() => {
    setActiveShift(null)
    setDays([])
  }, [setActiveShift, setDays])

  return {
    settings,
    setSettings,
    activeShift,
    activeDayKey,
    days,
    liveHoursToday,
    runningHours,
    earnings,
    inOvertime,
    startShift,
    stopShift,
    setHoursForDay,
    deleteDay,
    clearHistory,
  }
}
