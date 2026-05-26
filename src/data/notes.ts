import type { NoteReward } from '../types'

// Mix of motivational quotes and SSB-anchored fun facts.
// Stats sourced from Statistics Norway (SSB) 2024–2025 earnings data.
export const NOTES: NoteReward[] = [
  {
    kind: 'note',
    thresholdNOK: 75,
    emoji: '💼',
    text: '"Get your f***ing ass up and work."',
    attribution: 'Kim Kardashian',
  },
  {
    kind: 'note',
    thresholdNOK: 500,
    emoji: '💼',
    text: '"I never dreamed about success — I worked for it."',
    attribution: 'Estée Lauder',
  },
  {
    kind: 'note',
    thresholdNOK: 1500,
    emoji: '🐺',
    text: '"Throw me to the wolves and I shall return, leading the pack."',
    attribution: 'Lisa Vanderpump',
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
    thresholdNOK: 3750,
    emoji: '🎤',
    text: '"If you want something said, ask a man; if you want something done, ask a woman."',
    attribution: 'Margaret Thatcher',
  },
  {
    kind: 'note',
    thresholdNOK: 4347,
    emoji: '💯',
    text: 'You just passed an annual salary pace of 1 000 000 kr.',
  },
  {
    kind: 'note',
    thresholdNOK: 5217,
    emoji: '📈',
    text: 'Annual pace: 1 200 000 kr. Well past the top 10% of Norwegian earners.',
    source: 'SSB',
  },
  {
    kind: 'note',
    thresholdNOK: 6260,
    emoji: '👨‍💼',
    text: 'Annual pace: 1 440 000 kr.',
  },
  {
    kind: 'note',
    thresholdNOK: 4500,
    emoji: '🏆',
    text: '"I was taught that the way of progress is neither swift nor easy."',
    attribution: 'Marie Curie (first and only double Nobel Prize winner)',
  },
  {
    kind: 'note',
    thresholdNOK: 5500,
    emoji: '🤸',
    text: '"I always say my biggest competitor is myself."',
    attribution: 'Simone Biles',
  },
  {
    kind: 'note',
    thresholdNOK: 8000,
    emoji: '💤',
    text: 'You now have over 1.8m annual salary. Time to sleep.',
  },
]
