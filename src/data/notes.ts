import type { NoteReward } from '../types'

// Mix of motivational quotes and SSB-anchored fun facts.
// Stats sourced from Statistics Norway (SSB) 2024–2025 earnings data.
export const NOTES: NoteReward[] = [
  {
    kind: 'note',
    thresholdNOK: 75,
    emoji: '💼',
    text: '"I never dreamed about success — I worked for it." — Estée Lauder',
  },
  {
    kind: 'note',
    thresholdNOK: 300,
    emoji: '📊',
    text: "At 400 kr/h you're already above the Norwegian median hourly wage.",
    source: 'SSB 2025',
  },
  {
    kind: 'note',
    thresholdNOK: 1500,
    emoji: '☀️',
    text: '"You did not wake up today to be average."',
  },
  {
    kind: 'note',
    thresholdNOK: 2584,
    emoji: '⚖️',
    text: "Norwegian women earn on average 87.9% of men's wages. Today you're outpacing both medians.",
    source: 'SSB 2025',
  },
  {
    kind: 'note',
    thresholdNOK: 3500,
    emoji: '🎤',
    text: '"If you want something said, ask a man; if you want something done, ask a woman." — Margaret Thatcher',
  },
  {
    kind: 'note',
    thresholdNOK: 3953,
    emoji: '💯',
    text: 'You just passed an annual salary pace of 1 000 000 kr.',
  },
  {
    kind: 'note',
    thresholdNOK: 4500,
    emoji: '🏆',
    text: '"I was taught that the way of progress is neither swift nor easy." — Marie Curie (first and only double Nobel Prize winner)',
  },
  {
    kind: 'note',
    thresholdNOK: 5000,
    emoji: '💎',
    text: '5 000 kr/workday × 230 days = 1,15 M kr/year. Top decile of Norwegian earners.',
    source: 'SSB 2025',
  },
  {
    kind: 'note',
    thresholdNOK: 6500,
    emoji: '🌟',
    text: '"Whatever you do, be different." — Anita Roddick',
  },
]
