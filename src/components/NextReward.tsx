import { ALL_REWARDS, rewardEmoji } from '../data/rewards'

const fmtNOK = new Intl.NumberFormat('nb-NO', {
  style: 'currency',
  currency: 'NOK',
  maximumFractionDigits: 0,
})

function formatHMS(totalSeconds: number): string {
  const s = Math.max(0, Math.ceil(totalSeconds))
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${pad(h)}:${pad(m)}:${pad(sec)}`
}

type Props = {
  earnings: number
  effectiveHourlyRate: number
}

export function NextReward({ earnings, effectiveHourlyRate }: Props) {
  const nextIdx = ALL_REWARDS.findIndex((r) => r.thresholdNOK > earnings)

  if (nextIdx === -1) {
    return (
      <div className="mx-auto max-w-md text-center px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500/20 to-lime-500/20 border border-emerald-300/40 font-bold text-emerald-100">
        🎉 All rewards unlocked — you legend!
      </div>
    )
  }

  const next = ALL_REWARDS[nextIdx]
  const prevThreshold = nextIdx > 0 ? ALL_REWARDS[nextIdx - 1].thresholdNOK : 0
  const span = next.thresholdNOK - prevThreshold
  const progress = span > 0 ? Math.min(1, Math.max(0, (earnings - prevThreshold) / span)) : 0
  const remaining = next.thresholdNOK - earnings
  const secondsLeft = effectiveHourlyRate > 0 ? (remaining / effectiveHourlyRate) * 3600 : 0

  return (
    <div className="mx-auto max-w-md px-4 py-3 rounded-2xl bg-white/5 border border-pink-300/30 shadow-lg shadow-pink-500/10 backdrop-blur">
      <div className="flex items-center justify-between gap-3 mb-2">
        <span className="text-[11px] uppercase tracking-widest text-pink-200/70 font-bold">
          Next reward
        </span>
        {effectiveHourlyRate > 0 && (
          <span className="font-mono font-bold text-pink-200 tabular-nums text-lg leading-none">
            {formatHMS(secondsLeft)}
          </span>
        )}
      </div>

      <div className="flex items-center gap-3">
        <span className="text-3xl drop-shadow" aria-hidden>
          {rewardEmoji(next)}
        </span>
        <div className="flex-1 min-w-0">
          <div className="h-3 rounded-full bg-black/40 overflow-hidden border border-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-pink-500 via-fuchsia-400 to-amber-300 shadow-[0_0_12px_rgba(255,110,196,0.6)]"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
          <div className="mt-1.5 flex items-center justify-between text-xs">
            <span className="text-white/50 tabular-nums">{Math.round(progress * 100)}%</span>
            <span className="text-amber-200 font-bold tabular-nums">
              {fmtNOK.format(next.thresholdNOK)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
