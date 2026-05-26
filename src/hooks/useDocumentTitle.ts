import { useEffect, useState } from 'react'
import { VIDEOS } from '../data/videos'

const fmtCurrency = new Intl.NumberFormat('nb-NO', {
  style: 'currency',
  currency: 'NOK',
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
})

function countUnlocked(earnings: number) {
  let n = 0
  for (const v of VIDEOS) if (v.thresholdNOK <= earnings) n++
  return n
}

// Maintains document.title:
// - if active and N new videos have unlocked while the tab was hidden: "(N) - 1 234,56 kr"
// - if active and no new videos: "1 234,56 kr"
// - otherwise: the provided fallback title.
export function useDocumentTitle({
  active,
  earnings,
  fallback,
}: {
  active: boolean
  earnings: number
  fallback: string
}) {
  // Number of unlocked videos at the moment the tab was last visible.
  // Set to the current unlocked count on mount and on each visibilitychange→visible,
  // so anything that unlocks while hidden bumps the (N) counter.
  const [lastSeen, setLastSeen] = useState<number>(() =>
    typeof document !== 'undefined' && document.visibilityState !== 'visible'
      ? 0
      : countUnlocked(earnings),
  )

  useEffect(() => {
    const handler = () => {
      if (document.visibilityState === 'visible') {
        setLastSeen(countUnlocked(earnings))
      }
    }
    document.addEventListener('visibilitychange', handler)
    return () => document.removeEventListener('visibilitychange', handler)
  }, [earnings])

  // While the tab is visible, keep lastSeen at the current count so (N) stays at 0.
  useEffect(() => {
    if (typeof document === 'undefined') return
    if (document.visibilityState === 'visible') {
      setLastSeen(countUnlocked(earnings))
    }
  }, [earnings])

  useEffect(() => {
    if (!active) {
      document.title = fallback
      return
    }
    const unlocked = countUnlocked(earnings)
    const newCount = Math.max(0, unlocked - lastSeen)
    const money = fmtCurrency.format(earnings)
    document.title = newCount > 0 ? `(${newCount}) - ${money}` : money
  }, [active, earnings, lastSeen, fallback])
}
