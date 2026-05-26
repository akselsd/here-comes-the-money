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

type RewardBase = { thresholdNOK: number }

export type VideoReward = RewardBase & {
  kind: 'video'
  youtubeId: string
  caption: string
}

export type NoteReward = RewardBase & {
  kind: 'note'
  text: string
  emoji?: string
  source?: string
}

export type BuysReward = RewardBase & {
  kind: 'buys'
  item: string
  emoji: string
}

export type Reward = VideoReward | NoteReward | BuysReward
