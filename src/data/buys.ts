import type { BuysReward } from '../types'

// "What this much money buys you" — small treats to giant goals.
export const BUYS: BuysReward[] = [
  { kind: 'buys', thresholdNOK: 24.9, emoji: '🥤', item: 'A bottle of Pepsi Max' },
  { kind: 'buys', thresholdNOK: 188, emoji: '🍣', item: 'Sushi dinner — 1× Mango + 1× Lakserogn' },
  { kind: 'buys', thresholdNOK: 500, emoji: '🌿', item: 'A bag of weed' },
  { kind: 'buys', thresholdNOK: 2500, emoji: '✈️', item: 'A flight to Spain' },
  { kind: 'buys', thresholdNOK: 4000, emoji: '👗', item: 'A Maje dress' },
  { kind: 'buys', thresholdNOK: 6000, emoji: '🌴', item: 'A flight to Colombia' },
]
