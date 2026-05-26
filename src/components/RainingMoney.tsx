import { useMemo } from 'react'

const BILLS = ['💵', '💸', '💰', '🤑']

type Bill = {
  emoji: string
  left: number // vw
  duration: number // s
  delay: number // s (negative so they start mid-air)
  size: number // rem
  rotStart: number
  rotEnd: number
  drift: number // px horizontal drift
}

function randomBills(count: number): Bill[] {
  return Array.from({ length: count }, () => ({
    emoji: BILLS[Math.floor(Math.random() * BILLS.length)],
    left: Math.random() * 100,
    duration: 8 + Math.random() * 10,
    delay: -Math.random() * 18,
    size: 1.5 + Math.random() * 2.5,
    rotStart: Math.random() * 360,
    rotEnd: Math.random() * 720 - 360,
    drift: (Math.random() - 0.5) * 80,
  }))
}

type Props = {
  count?: number
}

export function RainingMoney({ count = 40 }: Props) {
  const bills = useMemo(() => randomBills(count), [count])

  // Cut a transparent band out of the center so falling emoji don't shimmer
  // through the feed cards. Outside the cutout, rain renders normally; inside,
  // the mask makes the rain layer fully transparent.
  const sideMask =
    'linear-gradient(to right,' +
    ' black 0,' +
    ' black calc(50% - 400px),' +
    ' transparent calc(50% - 340px),' +
    ' transparent calc(50% + 340px),' +
    ' black calc(50% + 400px),' +
    ' black 100%)'

  return (
    <div
      aria-hidden
      className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none"
      style={{ maskImage: sideMask, WebkitMaskImage: sideMask }}
    >
      {bills.map((b, i) => (
        <span
          key={i}
          className="absolute top-0 will-change-transform"
          style={{
            left: `${b.left}vw`,
            marginLeft: `${b.drift}px`,
            fontSize: `${b.size}rem`,
            animation: `money-fall ${b.duration}s linear ${b.delay}s infinite`,
            ['--rot-start' as string]: `${b.rotStart}deg`,
            ['--rot-end' as string]: `${b.rotEnd}deg`,
            filter: 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.5))',
            opacity: 0.85,
          }}
        >
          {b.emoji}
        </span>
      ))}
    </div>
  )
}
