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
      {inOvertime && (
        <div className="mb-4 flex justify-center">
          <span className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-gradient-to-r from-pink-500 to-fuchsia-500 text-white font-extrabold text-xl md:text-2xl tracking-widest border-2 border-pink-300 shadow-lg shadow-pink-500/50 animate-pulse-slow uppercase">
            ⚡ Overtime ⚡
          </span>
        </div>
      )}
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
