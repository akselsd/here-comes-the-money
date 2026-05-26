import { useEffect } from 'react'

const fmtCurrency = new Intl.NumberFormat('nb-NO', {
  style: 'currency',
  currency: 'NOK',
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
})

// Maintains document.title:
// - active with unclaimed (unlocked but unrevealed) rewards: "N new rewards - 1 234,56 kr"
// - active with none unclaimed: "1 234,56 kr"
// - otherwise: the provided fallback title.
export function useDocumentTitle({
  active,
  earnings,
  unclaimedCount,
  fallback,
}: {
  active: boolean
  earnings: number
  unclaimedCount: number
  fallback: string
}) {
  useEffect(() => {
    if (!active) {
      document.title = fallback
      return
    }
    const money = fmtCurrency.format(earnings)
    const rewardWord = unclaimedCount === 1 ? 'reward' : 'rewards'
    document.title =
      unclaimedCount > 0 ? `${unclaimedCount} new ${rewardWord} - ${money}` : money
  }, [active, earnings, unclaimedCount, fallback])
}
