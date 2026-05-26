import { useEffect, useRef } from 'react'
import confetti from 'canvas-confetti'
import { COPY } from '../data/copy'
import { VIDEOS } from '../data/videos'
import type { Video } from '../types'

const fmtNOK = new Intl.NumberFormat('nb-NO', {
  style: 'currency',
  currency: 'NOK',
  maximumFractionDigits: 0,
})

type Props = {
  earnings: number
}

export function Feed({ earnings }: Props) {
  const unlocked = VIDEOS.filter((v) => v.thresholdNOK <= earnings)
  const next = VIDEOS.find((v) => v.thresholdNOK > earnings)

  const prevCountRef = useRef(unlocked.length)
  useEffect(() => {
    if (unlocked.length > prevCountRef.current) {
      // new unlock(s) — fire confetti
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
            <span className="text-pink-300 font-semibold">{fmtNOK.format(next.thresholdNOK)}</span>
          </span>
        )}
      </div>

      {unlocked.length === 0 ? (
        <div className="text-center text-white/50 py-10 px-6 bg-white/5 rounded-2xl border border-white/10">
          {COPY.feed.empty}
        </div>
      ) : (
        <ul className="space-y-4">
          {[...unlocked].reverse().map((v, idx) => (
            <FeedCard key={v.youtubeId} video={v} isLatest={idx === 0} />
          ))}
        </ul>
      )}
    </section>
  )
}

function FeedCard({ video, isLatest }: { video: Video; isLatest: boolean }) {
  return (
    <li
      className={`bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-xl ${
        isLatest ? 'animate-bounce-in ring-2 ring-pink-400/60 shadow-pink-500/20' : ''
      }`}
    >
      <div className="px-4 py-3 flex items-center justify-between bg-gradient-to-r from-pink-500/20 to-fuchsia-500/10">
        <span className="font-bold text-pink-200">{fmtNOK.format(video.thresholdNOK)}</span>
        <span className="text-sm text-white/80">{video.caption}</span>
      </div>
      <div className="aspect-video bg-black">
        <iframe
          className="w-full h-full"
          src={`https://www.youtube.com/embed/${video.youtubeId}?rel=0`}
          title={video.caption}
          style={{ border: 0 }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          loading="lazy"
          allowFullScreen
        />
      </div>
    </li>
  )
}
