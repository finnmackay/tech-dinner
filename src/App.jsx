import { useMemo, useState } from 'react'

const ROLES = ['Founder', 'Engineer', 'Designer', 'Investor', 'PM', 'Researcher']
const GOALS = ['Hiring', 'Co-founder', 'Just vibes', 'Learning', 'Selling']
const SENIORITY = ['0-2 yrs', '3-5 yrs', '6-10 yrs', '10+ yrs']
const CITIES = ['San Francisco', 'New York', 'London', 'Berlin', 'Remote / flexible']

const STEPS = ['role', 'building', 'goal', 'seniority', 'city']

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
  const current = STEPS[step]
  const isLast = step === STEPS.length - 1

  const canAdvance = useMemo(() => {
    if (current === 'building') return answers.building.trim().length > 0
    return Boolean(answers[current])
  }, [answers, current])

  const titles = {
    role: 'What do you do?',
    building: "What are you building or working on?",
    goal: 'What do you want out of the dinner?',
    seniority: 'How many years have you been in tech?',
    city: 'Where are you based?',
  }

  function handleNext() {
    if (!canAdvance) return
    if (isLast) {
      onComplete()
    } else {
      setStep(step + 1)
    }
  }

  return (
    <div id="questions" className="mx-auto max-w-xl px-6 py-24">
      <div className="mb-10 flex justify-center gap-2">
        {STEPS.map((s, i) => (
          <span
            key={s}
            className={`h-2 w-2 rounded-full transition-colors ${
              i === step ? 'bg-ember' : i < step ? 'bg-ember-dim' : 'bg-line'
            }`}
          />
        ))}
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
          options={{ role: ROLES, goal: GOALS, seniority: SENIORITY, city: CITIES }[current]}
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
    </div>
  )
}

function ResultCard({ answers }) {
  const [email, setEmail] = useState('')
  const [reserved, setReserved] = useState(false)
  const city = answers.city === 'Remote / flexible' ? 'your city' : answers.city

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
          You're paired with 3 other {answers.role.toLowerCase()}s this Thursday in {city}.
        </h2>
        <p className="mt-3 text-cream-dim">
          Matched on what you're building, what you want out of it, and where you want to be.
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
    building: '',
    goal: '',
    seniority: '',
    city: '',
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
