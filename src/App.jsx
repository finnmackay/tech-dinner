import { useMemo, useState } from 'react'

const ROLES = ['Founder', 'Engineer', 'Designer', 'Investor', 'PM', 'Researcher']
const GOALS = ['Hiring', 'Co-founder', 'Just vibes', 'Learning', 'Selling']
const SENIORITY = ['0-2 yrs', '3-5 yrs', '6-10 yrs', '10+ yrs']
const VIBES = ['Deep in a side project', 'Out with friends', 'At a talk or meetup', 'Honestly, still working']
const CITIES = ['San Francisco', 'New York', 'London', 'Berlin', 'Remote / flexible']
const NIGHTS = ['This Thursday', 'Next week', 'Just exploring for now']

const VIBE_PHRASES = {
  'Deep in a side project': 'deep in their own side projects right now too',
  'Out with friends': 'always up for getting out with friends too',
  'At a talk or meetup': 'the type to show up for a good talk or meetup too',
  'Honestly, still working': 'probably still working right now too',
}

const STEPS = ['role', 'goal', 'building', 'seniority', 'vibe', 'city', 'night']

function ChipGroup({ options, value, onSelect }) {
  return (
    <div className="flex flex-wrap justify-center gap-3">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onSelect(option)}
          className={`rounded-full border px-5 py-2.5 text-sm font-medium transition-colors ${
            value === option
              ? 'border-ember bg-ember text-ink'
              : 'border-line bg-ink-card text-cream-dim hover:border-ember-soft hover:text-cream'
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  )
}

function QuestionFlow({ answers, setAnswer, step, setStep, onComplete }) {
  const [showEcho, setShowEcho] = useState(false)
  const current = STEPS[step]
  const isLast = step === STEPS.length - 1

  const canAdvance = useMemo(() => {
    if (current === 'building') return answers.building.trim().length > 0
    return Boolean(answers[current])
  }, [answers, current])

  const titles = {
    role: 'What do you do?',
    goal: 'What do you want out of the dinner?',
    building: "What are you building or working on?",
    seniority: 'How many years have you been in tech?',
    vibe: 'How do you like to spend a free evening?',
    city: 'Where are you based?',
    night: 'Which night works?',
  }

  function handleNext() {
    if (!canAdvance) return
    if (current === 'building') {
      setShowEcho(true)
      return
    }
    if (isLast) {
      onComplete()
    } else {
      setStep(step + 1)
    }
  }

  function handleEchoContinue() {
    setShowEcho(false)
    setStep(step + 1)
  }

  if (showEcho) {
    return (
      <div id="questions" className="mx-auto max-w-xl px-6 py-24 text-center">
        <p className="font-display text-2xl text-cream">
          Got it — pairing you with people who'd actually want to talk about{' '}
          <span className="text-ember">{answers.building}</span>.
        </p>
        <button
          type="button"
          onClick={handleEchoContinue}
          className="mt-10 rounded-full bg-ember px-8 py-3 text-sm font-semibold text-ink transition-transform hover:scale-105"
        >
          Continue
        </button>
      </div>
    )
  }

  return (
    <div id="questions" className="mx-auto max-w-xl px-6 py-24">
      <div className="mb-10">
        <div className="mb-2 flex justify-center text-xs font-medium uppercase tracking-widest text-cream-dim">
          Step {step + 1} of {STEPS.length}
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-line">
          <div
            className="h-full rounded-full bg-ember transition-all duration-300"
            style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      <h2 className="mb-8 text-center font-display text-3xl text-cream">
        {titles[current]}
      </h2>

      {current === 'building' ? (
        <input
          type="text"
          value={answers.building}
          onChange={(e) => setAnswer('building', e.target.value)}
          placeholder="e.g. an AI agent for ops, raising a seed round, learning to ship"
          className="w-full rounded-xl border border-line bg-ink-card px-5 py-3 text-center text-cream placeholder:text-cream-dim/60 focus:border-ember focus:outline-none"
          autoFocus
        />
      ) : (
        <ChipGroup
          options={{ role: ROLES, goal: GOALS, seniority: SENIORITY, vibe: VIBES, city: CITIES, night: NIGHTS }[current]}
          value={answers[current]}
          onSelect={(v) => setAnswer(current, v)}
        />
      )}

      <div className="mt-12 flex justify-center gap-4">
        {step > 0 && (
          <button
            type="button"
            onClick={() => setStep(step - 1)}
            className="rounded-full px-6 py-3 text-sm font-medium text-cream-dim hover:text-cream"
          >
            Back
          </button>
        )}
        <button
          type="button"
          onClick={handleNext}
          disabled={!canAdvance}
          className="rounded-full bg-ember px-8 py-3 text-sm font-semibold text-ink transition-opacity disabled:cursor-not-allowed disabled:opacity-30"
        >
          {isLast ? 'Find my match' : 'Next'}
        </button>
      </div>
    </div>
  )
}

function Matching() {
  return (
    <div className="mx-auto max-w-xl px-6 py-32 text-center">
      <div className="flex justify-center gap-2">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-3 w-3 animate-bounce rounded-full bg-ember"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
      <p className="mt-6 text-cream-dim">Finding your table...</p>
      <p className="mt-3 text-sm text-ember-soft">14 tech people matched into dinners this week</p>
    </div>
  )
}

function ResultCard({ answers }) {
  const [email, setEmail] = useState('')
  const [reserved, setReserved] = useState(false)
  const city = answers.city === 'Remote / flexible' ? 'your city' : answers.city
  const night = answers.night === 'Just exploring for now' ? 'soon' : answers.night.toLowerCase()
  const vibePhrase = VIBE_PHRASES[answers.vibe]

  function handleReserve(e) {
    e.preventDefault()
    if (!email.includes('@')) return
    setReserved(true)
  }

  return (
    <div className="mx-auto max-w-xl px-6 py-24">
      <div className="rounded-2xl border border-line bg-ink-card p-10 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-ember-soft">
          Your table is set
        </p>
        <h2 className="mt-4 font-display text-3xl text-cream">
          You're paired with 3 other {answers.role.toLowerCase()}s {night} in {city}.
        </h2>
        <p className="mt-3 text-cream-dim">
          All {vibePhrase} — and curious to hear more about {answers.building}.
        </p>

        {reserved ? (
          <p className="mt-8 rounded-xl border border-ember-dim bg-ink px-6 py-4 text-ember-soft">
            Seat reserved. We'll email you the details before Thursday.
          </p>
        ) : (
          <form onSubmit={handleReserve} className="mt-8 flex flex-col gap-3 sm:flex-row">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="flex-1 rounded-xl border border-line bg-ink px-4 py-3 text-cream placeholder:text-cream-dim/60 focus:border-ember focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-xl bg-ember px-6 py-3 text-sm font-semibold text-ink"
            >
              Reserve my seat
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

function Hero({ onStart }) {
  return (
    <section className="mx-auto flex max-w-3xl flex-col items-center px-6 pt-28 pb-16 text-center">
      <h1 className="font-display text-5xl leading-tight text-cream sm:text-6xl">
        Dinner with strangers who <span className="text-ember">get it</span>.
      </h1>
      <p className="mt-6 max-w-lg text-lg text-cream-dim">
        Answer a few questions, get matched with three other tech people, show up to dinner.
      </p>
      <button
        type="button"
        onClick={onStart}
        className="mt-10 rounded-full bg-ember px-8 py-4 text-sm font-semibold text-ink transition-transform hover:scale-105"
      >
        Find my table
      </button>
    </section>
  )
}

function Footer() {
  const steps = [
    ['01', 'Answer', 'A short set of questions about what you do and what you want.'],
    ['02', 'Get matched', 'We pair you with three other people who fit.'],
    ['03', 'Show up', 'Same city, same night. Just bring yourself.'],
  ]
  return (
    <footer className="border-t border-line px-6 py-16">
      <div className="mx-auto grid max-w-3xl gap-10 sm:grid-cols-3">
        {steps.map(([num, title, body]) => (
          <div key={num}>
            <span className="font-display text-sm text-ember-soft">{num}</span>
            <h3 className="mt-2 font-display text-lg text-cream">{title}</h3>
            <p className="mt-2 text-sm text-cream-dim">{body}</p>
          </div>
        ))}
      </div>
    </footer>
  )
}

function App() {
  const [phase, setPhase] = useState('questions')
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({
    role: '',
    goal: '',
    building: '',
    seniority: '',
    vibe: '',
    city: '',
    night: '',
  })

  function setAnswer(key, value) {
    setAnswers((prev) => ({ ...prev, [key]: value }))
  }

  function handleComplete() {
    setPhase('matching')
    setTimeout(() => setPhase('result'), 2000)
  }

  function scrollToQuestions() {
    document.getElementById('questions')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-ink">
      <Hero onStart={scrollToQuestions} />

      {phase === 'questions' && (
        <QuestionFlow
          answers={answers}
          setAnswer={setAnswer}
          step={step}
          setStep={setStep}
          onComplete={handleComplete}
        />
      )}
      {phase === 'matching' && <Matching />}
      {phase === 'result' && <ResultCard answers={answers} />}

      <Footer />
    </div>
  )
}

export default App
