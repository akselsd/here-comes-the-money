import { Feed } from './components/Feed'
import { LiveCounter } from './components/LiveCounter'
import { NextReward } from './components/NextReward'
import { RainingMoney } from './components/RainingMoney'
import { ShiftControls } from './components/ShiftControls'
import { COPY } from './data/copy'
import { useDocumentTitle } from './hooks/useDocumentTitle'
import { useShiftTracker } from './hooks/useShiftTracker'

export default function App() {
  const tracker = useShiftTracker()

  useDocumentTitle({
    active: !!tracker.activeShift,
    earnings: tracker.earnings,
    fallback: `🤑 ${COPY.appTitle}`,
  })

  return (
    <main className="min-h-svh pb-20 relative isolate">
      {tracker.activeShift && <RainingMoney />}

      <div className="relative z-10 mx-auto max-w-2xl px-4">
        {/* Sticky top: counter + hours pill. Stays visible as the feed scrolls. */}
        <div
          className="sticky top-0 z-20 -mx-4 px-4 pt-6 pb-6"
          style={{
            background:
              'radial-gradient(ellipse at top, #1f1147 0%, #0a0612 60%, #050309 100%) fixed',
          }}
        >
          {tracker.activeShift ? (
            <LiveCounter
              earnings={tracker.earnings}
              inOvertime={tracker.inOvertime}
              active
            />
          ) : (
            <div className="text-center text-white/50 max-w-md mx-auto py-10 px-6 bg-white/5 rounded-2xl border border-white/10">
              {COPY.shift.notStarted}
            </div>
          )}

          <div className="mt-6">
            {tracker.activeShift ? (
              <ShiftControls
                active
                hoursToday={tracker.liveHoursToday}
                inOvertime={tracker.inOvertime}
                onSetHoursToday={tracker.setHoursToday}
              />
            ) : (
              <ShiftControls active={false} onStart={tracker.startShift} />
            )}
          </div>

          {tracker.activeShift && (
            <div className="mt-5">
              <NextReward
                earnings={tracker.earnings}
                effectiveHourlyRate={tracker.effectiveHourlyRate}
              />
            </div>
          )}
        </div>

        {tracker.activeShift && (
          <section className="mt-8">
            <Feed earnings={tracker.earnings} />
          </section>
        )}

        <div className="mt-16 mb-10 flex flex-col items-center gap-6">
          <div className="h-px w-24 bg-white/20" />
          <p className="text-center text-white text-2xl font-semibold">Let's goo</p>
        </div>
      </div>
    </main>
  )
}
