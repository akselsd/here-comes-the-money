import type { Video } from '../types'

// Sorted by thresholdNOK ascending. Add/edit freely.
// thresholdNOK = how much she's earned in the current shift before this video unlocks.
export const VIDEOS: Video[] = [
  {
    thresholdNOK: 10,
    youtubeId: 'IcrbM1l_BoI',
    caption: "Avicii — Wake Me Up. You're off! 💪",
  },
  {
    thresholdNOK: 50,
    youtubeId: 'kOkQ4T5WO9E',
    caption: 'Spice Girls — Wannabe. Lil treat for the soul.',
  },
  {
    thresholdNOK: 100,
    youtubeId: 'OPf0YbXqDm0',
    caption: 'Uptown Funk. First hundred! 🎉',
  },
  {
    thresholdNOK: 250,
    youtubeId: '09R8_2nJtjg',
    caption: 'Maroon 5 — Sugar. You deserve a dance break.',
  },
  {
    thresholdNOK: 500,
    youtubeId: 'PIh2xe4jnpk',
    caption: 'The Weeknd — Blinding Lights. Half a grand in the bag!',
  },
  {
    thresholdNOK: 1000,
    youtubeId: 'kJQP7kiw5Fk',
    caption: 'Despacito. A FULL THOUSAND. 🤑',
  },
  {
    thresholdNOK: 1500,
    youtubeId: 'fLexgOxsZu0',
    caption: "Pharrell — Happy. You're a cash machine.",
  },
  {
    thresholdNOK: 2000,
    youtubeId: 'L_jWHffIx5E',
    caption: 'Smash Mouth — All Star. Two grand!! 💸💸',
  },
  {
    thresholdNOK: 3000,
    youtubeId: '60ItHLz5WEA',
    caption: 'Alan Walker — Faded. You faded all the money in.',
  },
  {
    thresholdNOK: 5000,
    youtubeId: 'JGwWNGJdvx8',
    caption: 'Ed Sheeran — Shape of You. FIVE thousand. Wow.',
  },
  {
    thresholdNOK: 10000,
    youtubeId: 'dQw4w9WgXcQ',
    caption: 'TEN THOUSAND KRONER. You earned the classic. 🕺',
  },
].sort((a, b) => a.thresholdNOK - b.thresholdNOK)
