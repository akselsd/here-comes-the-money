import { useEffect, useMemo, useRef } from 'react'
import confetti from 'canvas-confetti'
import { COPY } from '../data/copy'
import { BUYS } from '../data/buys'
import { NOTES } from '../data/notes'
import { VIDEOS } from '../data/videos'
import type { BuysReward, NoteReward, Reward, VideoReward } from '../types'

const fmtNOK = new Intl.NumberFormat('nb-NO', {
  style: 'currency',
  currency: 'NOK',
  maximumFractionDigits: 0,
})

const fmtNOKDecimals = new Intl.NumberFormat('nb-NO', {
  style: 'currency',
  currency: 'NOK',
  maximumFractionDigits: 2,
  minimumFractionDigits: 0,
})

// One unified, sorted reward stream.
const ALL_REWARDS: Reward[] = [...VIDEOS, ...BUYS, ...NOTES].sort(
  (a, b) => a.thresholdNOK - b.thresholdNOK,
)

function rewardKey(r: Reward): string {
  switch (r.kind) {
    case 'video':
      return `v:${r.youtubeId}`
    case 'buys':
      return `b:${r.thresholdNOK}:${r.item}`
    case 'note':
      return `n:${r.thresholdNOK}:${r.text.slice(0, 24)}`
  }
}

type Props = {
  earnings: number
}

export function Feed({ earnings }: Props) {
  const unlocked = useMemo(
    () => ALL_REWARDS.filter((r) => r.thresholdNOK <= earnings),
    [earnings],
  )
  const next = ALL_REWARDS.find((r) => r.thresholdNOK > earnings)

  const prevCountRef = useRef(unlocked.length)
  useEffect(() => {
    if (unlocked.length > prevCountRef.current) {
      confetti({
        particleCount: 120,
        spread: 90,
        startVelocity: 45,
        origin: { y: 0.6 },
        colors: ['#ffd166', '#ff6ec4', '#fff5b8', '#c084fc', '#34d399'],
      })
    }
    prevCountRef.current = unlocked.length
  }, [unlocked.length])

  return (
    <section className="w-full max-w-2xl mx-auto">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 mb-4 px-1">
        <h2 className="text-2xl font-bold">{COPY.feed.heading}</h2>
        {next && (
          <span className="text-sm text-white/60">
            {COPY.feed.nextUnlock}{' '}
            <span className="text-pink-300 font-semibold">
              {fmtNOKDecimals.format(next.thresholdNOK)}
            </span>
          </span>
        )}
      </div>

      {unlocked.length === 0 ? (
        <div className="text-center text-white/50 py-10 px-6 bg-white/5 rounded-2xl border border-white/10">
          {COPY.feed.empty}
        </div>
      ) : (
        <ul className="space-y-4">
          {[...unlocked].reverse().map((r, idx) => (
            <RewardCard key={rewardKey(r)} reward={r} isLatest={idx === 0} />
          ))}
        </ul>
      )}
    </section>
  )
}

function RewardCard({ reward, isLatest }: { reward: Reward; isLatest: boolean }) {
  const latestRing = isLatest ? 'animate-bounce-in ring-2 ring-pink-400/60 shadow-pink-500/20' : ''
  switch (reward.kind) {
    case 'video':
      return <VideoCard reward={reward} latestRing={latestRing} />
    case 'buys':
      return <BuysCard reward={reward} latestRing={latestRing} />
    case 'note':
      return <NoteCard reward={reward} latestRing={latestRing} />
  }
}

function VideoCard({ reward, latestRing }: { reward: VideoReward; latestRing: string }) {
  return (
    <li
      className={`bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-xl ${latestRing}`}
    >
      <div className="px-4 py-3 flex items-center justify-between gap-3 bg-gradient-to-r from-pink-500/20 to-fuchsia-500/10">
        <span className="font-bold text-pink-200">{fmtNOK.format(reward.thresholdNOK)}</span>
        <span className="text-sm text-white/80 text-right">{reward.caption}</span>
      </div>
      <div className="aspect-video bg-black">
        <iframe
          className="w-full h-full"
          src={`https://www.youtube.com/embed/${reward.youtubeId}?rel=0`}
          title={reward.caption}
          style={{ border: 0 }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          loading="lazy"
          allowFullScreen
        />
      </div>
    </li>
  )
}

function BuysCard({ reward, latestRing }: { reward: BuysReward; latestRing: string }) {
  return (
    <li
      className={`bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-300/20 rounded-2xl px-5 py-4 shadow-xl ${latestRing}`}
    >
      <div className="flex items-center gap-4">
        <span className="text-4xl" aria-hidden>
          {reward.emoji}
        </span>
        <div className="flex-1 min-w-0">
          <div className="text-xs uppercase tracking-wider text-amber-200/70 font-semibold">
            You can now afford
          </div>
          <div className="text-lg font-bold text-amber-100 leading-tight">{reward.item}</div>
        </div>
        <span className="font-bold text-amber-200 whitespace-nowrap tabular-nums">
          {fmtNOKDecimals.format(reward.thresholdNOK)}
        </span>
      </div>
    </li>
  )
}

function NoteCard({ reward, latestRing }: { reward: NoteReward; latestRing: string }) {
  return (
    <li
      className={`bg-white/5 border border-white/10 rounded-2xl px-5 py-4 shadow-xl ${latestRing}`}
    >
      <div className="flex items-start gap-3">
        {reward.emoji && (
          <span className="text-2xl mt-0.5" aria-hidden>
            {reward.emoji}
          </span>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-white/90 italic leading-snug">{reward.text}</p>
          <div className="mt-2 flex items-center justify-between gap-2 text-xs">
            <span className="text-white/40">
              {reward.source ? `Source: ${reward.source}` : ' '}
            </span>
            <span className="text-pink-300/70 font-semibold tabular-nums">
              {fmtNOK.format(reward.thresholdNOK)}
            </span>
          </div>
        </div>
      </div>
    </li>
  )
}
