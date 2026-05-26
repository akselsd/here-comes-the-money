// While a shift is active, this records when the current segment started.
// Running time always counts toward `dayKey(startedAt)`.
export type ShiftSession = {
  startedAt: string // ISO
}

type RewardBase = { thresholdNOK: number }

export type VideoReward = RewardBase & {
  kind: 'video'
  youtubeId: string
  caption: string
  label?: string // overrides the default "New track unlocked" headline
  emoji?: string // overrides the default 🎵
}

export type NoteReward = RewardBase & {
  kind: 'note'
  text: string
  emoji?: string
  source?: string
  attribution?: string // e.g. "Estée Lauder" — rendered on its own line as "— Person"
}

export type BuysReward = RewardBase & {
  kind: 'buys'
  item: string
  emoji: string
}

export type GifReward = RewardBase & {
  kind: 'gif'
  src: string
  caption?: string
}

export type ClipReward = RewardBase & {
  kind: 'clip'
  src: string
  caption?: string
}

export type Reward = VideoReward | NoteReward | BuysReward | GifReward | ClipReward
