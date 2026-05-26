import type { ClipReward } from '../types'

const base = import.meta.env.BASE_URL

export const CLIPS: ClipReward[] = [
  {
    kind: 'clip',
    thresholdNOK: 2789,
    src: `${base}clips/clip0.mp4`,
    caption: 'Overtime baby. You deserve a reality reward',
  },
]
