export type Settings = {
  hourlyRateNOK: number
  overtimeMultiplier: number
  overtimeAfterHours: number
  name: string
}

// While a shift is active, this records when the current segment started.
// Running time always counts toward `dayKey(startedAt)`.
export type ShiftSession = {
  startedAt: string // ISO
}

// Committed hours per calendar day. Money is always derived from hours via Settings.
export type DayEntry = {
  dayKey: string // 'YYYY-MM-DD' (local)
  hoursWorked: number
}

export type Video = {
  thresholdNOK: number
  youtubeId: string
  caption: string
}
