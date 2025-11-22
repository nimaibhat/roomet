'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type ConversationStep = 'location' | 'budget' | 'dates' | 'lifestyle'

interface ConversationFlowProps {
  onComplete: (data: {
    location: string
    budget: string
    dates: string
    lifestyle: string[]
  }) => void
}

export default function ConversationFlow({ onComplete }: ConversationFlowProps) {
  const [step, setStep] = useState<ConversationStep>('location')
  const [location, setLocation] = useState('')
  const [budget, setBudget] = useState('')
  const [dates, setDates] = useState('')
  const [lifestyle, setLifestyle] = useState<string[]>([])

  const lifestyleOptions = ['Early bird', 'Night owl', 'Clean', 'Social', 'Quiet', 'Pet-friendly']

  const handleNext = () => {
    if (step === 'location') {
      setStep('budget')
    } else if (step === 'budget') {
      setStep('dates')
    } else if (step === 'dates') {
      setStep('lifestyle')
    } else {
      onComplete({ location, budget, dates, lifestyle })
    }
  }

  const handleSkip = () => {
    if (step === 'location') {
      setStep('budget')
    } else if (step === 'budget') {
      setStep('dates')
    } else if (step === 'dates') {
      setStep('lifestyle')
    } else {
      onComplete({ location, budget, dates, lifestyle })
    }
  }

  return (
    <div className="space-y-4">
      <AnimatePresence mode="wait">
        {step === 'location' && (
          <motion.div
            key="location"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-3"
          >
            <p className="text-gray-700">What city are you interning in?</p>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="San Francisco"
              className="w-full px-4 py-3 rounded-full border border-gray-200 bg-white focus-ring"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && location && handleNext()}
            />
            <button
              onClick={handleNext}
              disabled={!location}
              className="w-full py-3 rounded-full bg-mint text-white font-medium hover:bg-mint-dark transition-colors focus-ring disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </motion.div>
        )}

        {step === 'budget' && (
          <motion.div
            key="budget"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-3"
          >
            <p className="text-gray-700">What's your monthly budget?</p>
            <input
              type="text"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="$1200"
              className="w-full px-4 py-3 rounded-full border border-gray-200 bg-white focus-ring"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && budget && handleNext()}
            />
            <div className="flex gap-3">
              <button
                onClick={handleSkip}
                className="flex-1 py-3 rounded-full border border-gray-300 bg-white text-gray-700 font-medium hover:bg-gray-50 transition-colors focus-ring"
              >
                Skip
              </button>
              <button
                onClick={handleNext}
                disabled={!budget}
                className="flex-1 py-3 rounded-full bg-mint text-white font-medium hover:bg-mint-dark transition-colors focus-ring disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </motion.div>
        )}

        {step === 'dates' && (
          <motion.div
            key="dates"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-3"
          >
            <p className="text-gray-700">When are you interning?</p>
            <input
              type="text"
              value={dates}
              onChange={(e) => setDates(e.target.value)}
              placeholder="June - August 2024"
              className="w-full px-4 py-3 rounded-full border border-gray-200 bg-white focus-ring"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && dates && handleNext()}
            />
            <div className="flex gap-3">
              <button
                onClick={handleSkip}
                className="flex-1 py-3 rounded-full border border-gray-300 bg-white text-gray-700 font-medium hover:bg-gray-50 transition-colors focus-ring"
              >
                Skip
              </button>
              <button
                onClick={handleNext}
                disabled={!dates}
                className="flex-1 py-3 rounded-full bg-mint text-white font-medium hover:bg-mint-dark transition-colors focus-ring disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </motion.div>
        )}

        {step === 'lifestyle' && (
          <motion.div
            key="lifestyle"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-3"
          >
            <p className="text-gray-700">Any lifestyle preferences?</p>
            <div className="flex flex-wrap gap-2">
              {lifestyleOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    setLifestyle((prev) =>
                      prev.includes(option)
                        ? prev.filter((t) => t !== option)
                        : [...prev, option]
                    )
                  }}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors focus-ring ${
                    lifestyle.includes(option)
                      ? 'bg-mint text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleSkip}
                className="flex-1 py-3 rounded-full border border-gray-300 bg-white text-gray-700 font-medium hover:bg-gray-50 transition-colors focus-ring"
              >
                Skip
              </button>
              <button
                onClick={handleNext}
                className="flex-1 py-3 rounded-full bg-mint text-white font-medium hover:bg-mint-dark transition-colors focus-ring"
              >
                See Matches
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

