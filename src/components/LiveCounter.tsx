const fmtCurrency = new Intl.NumberFormat('nb-NO', {
  style: 'currency',
  currency: 'NOK',
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
})

type Props = {
  earnings: number
  inOvertime: boolean
  active: boolean
}

export function LiveCounter({ earnings, inOvertime, active }: Props) {
  return (
    <div className="text-center counter-container">
      <div
        className={`inline-block ${inOvertime ? 'text-gradient-pink' : 'text-gradient-gold'} font-extrabold tracking-tight ${
          active ? 'animate-money' : ''
        }`}
        style={{
          fontSize: inOvertime
            ? 'clamp(72px, 17cqi, 220px)'
            : 'clamp(56px, 13cqi, 160px)',
          lineHeight: 1,
          filter: active
            ? `drop-shadow(0 0 ${inOvertime ? 40 : 30}px ${
                inOvertime ? 'rgba(255,110,196,0.55)' : 'rgba(255,209,102,0.4)'
              })`
            : 'none',
        }}
      >
        {fmtCurrency.format(earnings)}
      </div>
    </div>
  )
}
