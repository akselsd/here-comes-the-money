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

type DayHours = { date: string; hours: number; breakHours: number }

export function useShiftTracker() {
  const [activeShift, setActiveShift] = useLocalStorage<ShiftSession | null>(
    'hctm:activeShift',
    null,
  )
  const [stored, setStored] = useLocalStorage<DayHours>('hctm:today', {
    date: todayKey(),
    hours: 0,
    breakHours: 0,
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
  const committedBreakToday = stored.date === today ? stored.breakHours : 0

  // A shift left running across the 06:00 boundary belongs to a previous work
  // day; auto-end it so the next morning starts fresh instead of showing a
  // ballooned overnight total.
  const shiftStartedToday =
    activeShift != null && dayKeyOf(activeShift.startedAt) === today

  useEffect(() => {
    if (activeShift && !shiftStartedToday) setActiveShift(null)
  }, [activeShift, shiftStartedToday, setActiveShift])

  const onBreak = !!activeShift && shiftStartedToday && activeShift.onBreak
  const runningSegmentHours =
    activeShift && shiftStartedToday
      ? Math.max(0, (now - new Date(activeShift.startedAt).getTime()) / 3_600_000)
      : 0
  const runningWorkHours = onBreak ? 0 : runningSegmentHours
  const runningBreakHours = onBreak ? runningSegmentHours : 0

  const liveHoursToday = committedToday + runningWorkHours
  const liveBreakHoursToday = committedBreakToday + runningBreakHours
  const earnings = computeEarnings(liveHoursToday)
  const inOvertime = liveHoursToday > OVERTIME_AFTER_HOURS
  const effectiveHourlyRate = inOvertime ? OVERTIME_RATE_NOK : HOURLY_RATE_NOK

  const startShift = useCallback(
    (startedAt?: Date) => {
      const when = startedAt ?? new Date()
      setActiveShift({ startedAt: when.toISOString(), onBreak: false })
    },
    [setActiveShift],
  )

  const startBreak = useCallback(() => {
    if (!activeShift || activeShift.onBreak) return
    // Commit the elapsed work segment before switching to a break segment.
    setStored((prev) => ({
      date: todayKey(),
      hours: (prev.date === todayKey() ? prev.hours : 0) + runningWorkHours,
      breakHours: prev.date === todayKey() ? prev.breakHours : 0,
    }))
    setActiveShift({ startedAt: new Date().toISOString(), onBreak: true })
  }, [activeShift, runningWorkHours, setActiveShift, setStored])

  const endBreak = useCallback(() => {
    if (!activeShift || !activeShift.onBreak) return
    // Commit the elapsed break segment before switching back to work.
    setStored((prev) => ({
      date: todayKey(),
      hours: prev.date === todayKey() ? prev.hours : 0,
      breakHours:
        (prev.date === todayKey() ? prev.breakHours : 0) + runningBreakHours,
    }))
    setActiveShift({ startedAt: new Date().toISOString(), onBreak: false })
  }, [activeShift, runningBreakHours, setActiveShift, setStored])

  const setHoursToday = useCallback(
    (newHours: number) => {
      const clamped = Math.max(0, newHours)
      setStored((prev) => ({
        date: todayKey(),
        hours: clamped,
        breakHours: prev.date === todayKey() ? prev.breakHours : 0,
      }))
      // Restart the running work segment from now so the live counter
      // continues from the new total instead of double-counting. Leave a
      // running break segment untouched.
      if (activeShift && !activeShift.onBreak) {
        setActiveShift({ startedAt: new Date().toISOString(), onBreak: false })
      }
    },
    [activeShift, setActiveShift, setStored],
  )

  const setBreakHoursToday = useCallback(
    (newHours: number) => {
      const clamped = Math.max(0, newHours)
      setStored((prev) => ({
        date: todayKey(),
        hours: prev.date === todayKey() ? prev.hours : 0,
        breakHours: clamped,
      }))
      // Restart the running break segment from now so it continues from the
      // new total instead of double-counting. Leave a running work segment
      // untouched.
      if (activeShift && activeShift.onBreak) {
        setActiveShift({ startedAt: new Date().toISOString(), onBreak: true })
      }
    },
    [activeShift, setActiveShift, setStored],
  )

  return {
    activeShift,
    onBreak,
    liveHoursToday,
    liveBreakHoursToday,
    earnings,
    inOvertime,
    effectiveHourlyRate,
    startShift,
    startBreak,
    endBreak,
    setHoursToday,
    setBreakHoursToday,
  }
}
