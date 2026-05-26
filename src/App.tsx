import { useState } from 'react'
import { Feed } from './components/Feed'
import { History } from './components/History'
import { LiveCounter } from './components/LiveCounter'
import { RainingMoney } from './components/RainingMoney'
import { SetupForm } from './components/SetupForm'
import { ShiftControls } from './components/ShiftControls'
import { COPY } from './data/copy'
import { useDocumentTitle } from './hooks/useDocumentTitle'
import { useShiftTracker } from './hooks/useShiftTracker'

export default function App() {
  const tracker = useShiftTracker()
  const [editing, setEditing] = useState(false)

  useDocumentTitle({
    active: !!tracker.activeShift,
    earnings: tracker.earnings,
    fallback: `🤑 ${COPY.appTitle}`,
  })

  const hasConfigured =
    typeof localStorage !== 'undefined' &&
    localStorage.getItem('hctm:settings') !== null
  const showSetup = editing || !hasConfigured

  if (showSetup) {
    return (
      <main className="min-h-svh py-16 px-4 flex flex-col items-center justify-center">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-2 text-gradient-gold">
          💸 {COPY.appTitle}
        </h1>
        <p className="text-white/60 mb-10">{COPY.appSubtitle}</p>
        <SetupForm
          initial={tracker.settings}
          onSave={(s) => {
            tracker.setSettings(s)
            setEditing(false)
          }}
          onCancel={() => setEditing(false)}
          canCancel={hasConfigured}
        />
      </main>
    )
  }

  const activeDayKey = tracker.activeDayKey

  return (
    <main className="min-h-svh pb-20 relative isolate">
      {tracker.activeShift && <RainingMoney />}
      <button
        onClick={() => setEditing(true)}
        className="absolute top-4 right-4 z-20 px-4 py-2 rounded-2xl bg-white/10 hover:bg-white/20 transition text-sm font-medium backdrop-blur"
      >
        ⚙ {COPY.setup.edit}
      </button>

      <div className="relative z-10 mx-auto max-w-2xl px-4">
        {/* Sticky top: header + counter + hours pill. Stays visible as the feed scrolls. */}
        <div
          className="sticky top-0 z-20 -mx-4 px-4 pt-6 pb-6"
          style={{
            background:
              'radial-gradient(ellipse at top, #1f1147 0%, #0a0612 60%, #050309 100%)',
            backgroundAttachment: 'fixed',
          }}
        >
          <header className="pb-4 text-center">
            <h1 className="text-3xl md:text-5xl font-extrabold text-gradient-gold">
              💸 {COPY.appTitle}
            </h1>
            {tracker.settings.name && (
              <p className="text-white/60 mt-1">
                {COPY.shift.greeting}, {tracker.settings.name}
              </p>
            )}
          </header>

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
            {tracker.activeShift && activeDayKey ? (
              <ShiftControls
                active
                hoursToday={tracker.liveHoursToday}
                onSetHoursToday={(h) => tracker.setHoursForDay(activeDayKey, h)}
              />
            ) : (
              <ShiftControls active={false} onStart={tracker.startShift} />
            )}
          </div>
        </div>

        {tracker.activeShift && (
          <section className="mt-8">
            <Feed earnings={tracker.earnings} />
          </section>
        )}

        <section className="mt-16">
          <History
            days={tracker.days}
            settings={tracker.settings}
            activeDayKey={tracker.activeDayKey}
            liveHoursToday={tracker.liveHoursToday}
            onClear={tracker.clearHistory}
            onSetHoursForDay={tracker.setHoursForDay}
            onDelete={tracker.deleteDay}
          />
        </section>
      </div>
    </main>
  )
}
