import { useCallback, useMemo } from 'react'
import confetti from 'canvas-confetti'
import { COPY } from '../data/copy'
import { ALL_REWARDS, rewardKey } from '../data/rewards'
import { useLocalStorage } from '../hooks/useLocalStorage'
import type {
  BuysReward,
  ClipReward,
  GifReward,
  NoteReward,
  Reward,
  VideoReward,
} from '../types'

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

type Props = {
  earnings: number
}

export function Feed({ earnings }: Props) {
  const unlocked = useMemo(
    () => ALL_REWARDS.filter((r) => r.thresholdNOK <= earnings),
    [earnings],
  )

  const [revealed, setRevealed] = useLocalStorage<string[]>('hctm:revealed', [])
  const revealedSet = useMemo(() => new Set(revealed), [revealed])

  const reveal = useCallback(
    (key: string) => {
      setRevealed((prev) => (prev.includes(key) ? prev : [...prev, key]))
      confetti({
        particleCount: 120,
        spread: 90,
        startVelocity: 45,
        origin: { y: 0.6 },
        colors: ['#ffd166', '#ff6ec4', '#fff5b8', '#c084fc', '#34d399'],
      })
    },
    [setRevealed],
  )

  return (
    <section className="w-full max-w-2xl mx-auto">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 mb-4 px-1">
        <h2 className="text-2xl font-bold">{COPY.feed.heading}</h2>
      </div>

      {unlocked.length === 0 ? (
        <div className="text-center text-white/50 py-10 px-6 bg-white/5 rounded-2xl border border-white/10">
          {COPY.feed.empty}
        </div>
      ) : (
        <ul className="space-y-4">
          {[...unlocked].reverse().map((r, idx) => {
            const key = rewardKey(r)
            return revealedSet.has(key) ? (
              <RewardCard key={key} reward={r} isLatest={idx === 0} />
            ) : (
              <HiddenCard key={key} isLatest={idx === 0} onReveal={() => reveal(key)} />
            )
          })}
        </ul>
      )}
    </section>
  )
}

function HiddenCard({ isLatest, onReveal }: { isLatest: boolean; onReveal: () => void }) {
  const latestRing = isLatest ? 'animate-bounce-in ring-2 ring-pink-400/60 shadow-pink-500/20' : ''
  return (
    <li>
      <button
        onClick={onReveal}
        className={`w-full text-left bg-black border border-white/25 rounded-2xl px-5 py-6 shadow-xl hover:border-white/50 hover:bg-zinc-950 transition group ${latestRing}`}
      >
        <div className="flex items-center justify-between gap-4">
          <span className="text-lg font-bold text-white flex items-center gap-3">
            <span className="text-2xl group-hover:scale-110 transition-transform" aria-hidden>
              🎁
            </span>
            New reward unlocked
          </span>
          <span className="text-xs uppercase tracking-widest text-white/60 font-semibold whitespace-nowrap">
            Click to reveal
          </span>
        </div>
      </button>
    </li>
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
    case 'gif':
      return <GifCard reward={reward} latestRing={latestRing} />
    case 'clip':
      return <ClipCard reward={reward} latestRing={latestRing} />
  }
}

function ClipCard({ reward, latestRing }: { reward: ClipReward; latestRing: string }) {
  return (
    <li
      className={`bg-gradient-to-r from-emerald-500/10 to-lime-500/10 border border-emerald-300/20 rounded-2xl overflow-hidden shadow-xl ${latestRing}`}
    >
      <div className="px-5 py-4 flex items-center gap-4">
        <span className="text-4xl" aria-hidden>
          🎬
        </span>
        <div className="flex-1 min-w-0">
          <div className="text-xs uppercase tracking-wider text-emerald-200/70 font-semibold">
            Clip unlocked
          </div>
          {reward.caption && (
            <div className="text-lg font-bold text-emerald-100 leading-tight">
              {reward.caption}
            </div>
          )}
        </div>
        <span className="font-bold text-emerald-200 whitespace-nowrap tabular-nums">
          {fmtNOK.format(reward.thresholdNOK)}
        </span>
      </div>
      <div className="bg-black flex items-center justify-center">
        <video
          src={reward.src}
          className="max-h-[480px] w-auto"
          controls
          playsInline
          preload="metadata"
        />
      </div>
    </li>
  )
}

function GifCard({ reward, latestRing }: { reward: GifReward; latestRing: string }) {
  return (
    <li
      className={`bg-gradient-to-r from-emerald-500/10 to-lime-500/10 border border-emerald-300/20 rounded-2xl overflow-hidden shadow-xl ${latestRing}`}
    >
      <div className="px-5 py-4 flex items-center gap-4">
        <span className="text-4xl" aria-hidden>
          💸
        </span>
        <div className="flex-1 min-w-0">
          <div className="text-xs uppercase tracking-wider text-emerald-200/70 font-semibold">
            Money mood unlocked
          </div>
          {reward.caption && (
            <div className="text-lg font-bold text-emerald-100 leading-tight">
              {reward.caption}
            </div>
          )}
        </div>
        <span className="font-bold text-emerald-200 whitespace-nowrap tabular-nums">
          {fmtNOK.format(reward.thresholdNOK)}
        </span>
      </div>
      <div className="bg-black flex items-center justify-center">
        <img
          src={reward.src}
          alt={reward.caption ?? 'Money gif'}
          className="max-h-80 w-auto"
          loading="lazy"
        />
      </div>
    </li>
  )
}

function VideoCard({ reward, latestRing }: { reward: VideoReward; latestRing: string }) {
  return (
    <li
      className={`bg-gradient-to-r from-pink-500/10 to-fuchsia-500/10 border border-pink-300/20 rounded-2xl overflow-hidden shadow-xl ${latestRing}`}
    >
      <div className="px-5 py-4 flex items-center gap-4">
        <span className="text-4xl" aria-hidden>
          {reward.emoji ?? '🎵'}
        </span>
        <div className="flex-1 min-w-0">
          <div className="text-xs uppercase tracking-wider text-pink-200/70 font-semibold">
            {reward.label ?? 'New track unlocked'}
          </div>
          <div className="text-lg font-bold text-pink-100 leading-tight">{reward.caption}</div>
        </div>
        <span className="font-bold text-pink-200 whitespace-nowrap tabular-nums">
          {fmtNOK.format(reward.thresholdNOK)}
        </span>
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
          {reward.attribution && (
            <p className="text-white/70 mt-1 leading-snug">— {reward.attribution}</p>
          )}
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
