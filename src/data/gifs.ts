import type { GifReward } from '../types'

const base = import.meta.env.BASE_URL

export const GIFS: GifReward[] = [
  {
    kind: 'gif',
    thresholdNOK: 1394,
    src: `${base}gifs/money0.gif`,
    caption: '4 hours done — cash rolling in 💸',
  },
  {
    kind: 'gif',
    thresholdNOK: 3500,
    src: `${base}gifs/money1.gif`,
    caption: 'Make it rain 🌧️💵',
  },
  {
    kind: 'gif',
    thresholdNOK: 5750,
    src: `${base}gifs/money4.gif`,
    caption: 'You did that 💅',
  },
  {
    kind: 'gif',
    thresholdNOK: 7500,
    src: `${base}gifs/money2.gif`,
    caption: 'Bag secured 💰',
  },
]
