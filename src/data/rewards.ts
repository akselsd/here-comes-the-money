import type { Reward } from '../types'
import { BUYS } from './buys'
import { CLIPS } from './clips'
import { GIFS } from './gifs'
import { NOTES } from './notes'
import { VIDEOS } from './videos'

// One unified, sorted reward stream.
export const ALL_REWARDS: Reward[] = [
  ...VIDEOS,
  ...BUYS,
  ...NOTES,
  ...GIFS,
  ...CLIPS,
].sort((a, b) => a.thresholdNOK - b.thresholdNOK)

export function rewardKey(r: Reward): string {
  switch (r.kind) {
    case 'video':
      return `v:${r.youtubeId}`
    case 'buys':
      return `b:${r.thresholdNOK}:${r.item}`
    case 'note':
      return `n:${r.thresholdNOK}:${r.text.slice(0, 24)}`
    case 'gif':
      return `g:${r.thresholdNOK}:${r.src}`
    case 'clip':
      return `c:${r.thresholdNOK}:${r.src}`
  }
}

// A category-level emoji used to tease the next reward without fully spoiling it.
export function rewardEmoji(r: Reward): string {
  switch (r.kind) {
    case 'video':
      return r.emoji ?? '🎵'
    case 'buys':
      return r.emoji
    case 'note':
      return r.emoji ?? '💬'
    case 'gif':
      return '💸'
    case 'clip':
      return '🎬'
  }
}
