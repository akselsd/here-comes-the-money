import { useCallback, useEffect, useRef, useState } from 'react'
import { useLocalStorage } from './useLocalStorage'
import type { ShiftSession } from '../types'

const HOURLY_RATE_NOK = 348.56
const OVERTIME_RATE_NOK = 610.5
const OVERTIME_AFTER_HOURS = 8

export function computeEarnings(hours: number): number {
  const regular = Math.min(hours, OVERTIME_AFTER_HOURS)
  const overtime = Math.max(0, hours - OVERTIME_AFTER_HOURS)
  return regular * HOURLY_RATE_NOK + overtime * OVERTIME_RATE_NOK
}

// The "work day" rolls over at 06:00, not midnight: a shift that runs past
// midnight still counts toward the day it started, and the counter only resets
// once she returns after 06:00 the next morning.
const DAY_RESET_HOUR = 6

export function dayKeyOf(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const shifted = new Date(d.getTime() - DAY_RESET_HOUR * 3_600_000)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${shifted.getFullYear()}-${pad(shifted.getMonth() + 1)}-${pad(shifted.getDate())}`
}

export function todayKey(): string {
  return dayKeyOf(new Date())
}

type DayHours = { date: string; hours: number }

export function useShiftTracker() {
  const [activeShift, setActiveShift] = useLocalStorage<ShiftSession | null>(
    'hctm:activeShift',
    null,
  )
  const [stored, setStored] = useLocalStorage<DayHours>('hctm:today', {
    date: todayKey(),
    hours: 0,
  })

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
    // rAF is paused in background tabs; setInterval keeps ticking (throttled to
    // ~1s) so document.title and other non-visual derivations stay fresh.
    const intervalId = window.setInterval(() => setNow(Date.now()), 1000)
    return () => {
      mounted = false
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current)
      window.clearInterval(intervalId)
    }
  }, [activeShift])

  // If the stored day rolls over (returned after the 06:00 reset), drop
  // yesterday's committed hours.
  const today = todayKey()
  const committedToday = stored.date === today ? stored.hours : 0

  // A shift left running across the 06:00 boundary belongs to a previous work
  // day; auto-end it so the next morning starts fresh instead of showing a
  // ballooned overnight total.
  const shiftStartedToday =
    activeShift != null && dayKeyOf(activeShift.startedAt) === today

  useEffect(() => {
    if (activeShift && !shiftStartedToday) setActiveShift(null)
  }, [activeShift, shiftStartedToday, setActiveShift])

  const runningHours =
    activeShift && shiftStartedToday
      ? Math.max(0, (now - new Date(activeShift.startedAt).getTime()) / 3_600_000)
      : 0
  const liveHoursToday = committedToday + runningHours
  const earnings = computeEarnings(liveHoursToday)
  const inOvertime = liveHoursToday > OVERTIME_AFTER_HOURS
  const effectiveHourlyRate = inOvertime ? OVERTIME_RATE_NOK : HOURLY_RATE_NOK

  const startShift = useCallback(
    (startedAt?: Date) => {
      const when = startedAt ?? new Date()
      setActiveShift({ startedAt: when.toISOString() })
    },
    [setActiveShift],
  )

  const setHoursToday = useCallback(
    (newHours: number) => {
      const clamped = Math.max(0, newHours)
      setStored({ date: todayKey(), hours: clamped })
      // Restart the running segment from now so the live counter continues
      // from the new total instead of double-counting.
      if (activeShift) {
        setActiveShift({ startedAt: new Date().toISOString() })
      }
    },
    [activeShift, setActiveShift, setStored],
  )

  return {
    activeShift,
    liveHoursToday,
    earnings,
    inOvertime,
    effectiveHourlyRate,
    startShift,
    setHoursToday,
  }
}
