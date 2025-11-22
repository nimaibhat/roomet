'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { markOnboardingComplete } from '@/lib/auth-utils'
import { useAuth } from '@/hooks/useAuth'

interface OnboardingWizardProps {
  onComplete: () => void
}

type OnboardingStep = 'location' | 'dates' | 'budget' | 'hobbies' | 'lifestyle'

const hobbies = [
  'Fitness & Gym',
  'Hiking & Outdoors',
  'Photography',
  'Cooking',
  'Gaming',
  'Reading',
  'Music',
  'Art & Design',
  'Travel',
  'Sports',
  'Movies & TV',
  'Dancing',
  'Yoga & Meditation',
  'Volunteering',
  'Food & Dining',
]

const lifestyleOptions = [
  'Early bird',
  'Night owl',
  'Clean & organized',
  'Social & outgoing',
  'Quiet & introverted',
  'Pet-friendly',
  'Non-smoker',
  'Vegetarian/Vegan',
  'Likes to host',
  'Prefers quiet space',
]

export default function OnboardingWizard({ onComplete }: OnboardingWizardProps) {
  const { user } = useAuth()
  const [step, setStep] = useState<OnboardingStep>('location')
  const [location, setLocation] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [budget, setBudget] = useState('')
  const [selectedHobbies, setSelectedHobbies] = useState<string[]>([])
  const [selectedLifestyle, setSelectedLifestyle] = useState<string[]>([])
  const [isSaving, setIsSaving] = useState(false)

  const totalSteps = 5
  const currentStepNumber = ['location', 'dates', 'budget', 'hobbies', 'lifestyle'].indexOf(step) + 1

  const handleNext = () => {
    if (step === 'location') {
      setStep('dates')
    } else if (step === 'dates') {
      setStep('budget')
    } else if (step === 'budget') {
      setStep('hobbies')
    } else if (step === 'hobbies') {
      setStep('lifestyle')
    }
  }

  const handleBack = () => {
    if (step === 'lifestyle') {
      setStep('hobbies')
    } else if (step === 'hobbies') {
      setStep('budget')
    } else if (step === 'budget') {
      setStep('dates')
    } else if (step === 'dates') {
      setStep('location')
    }
  }

  const handleSkip = () => {
    if (step === 'location') {
      setStep('dates')
    } else if (step === 'dates') {
      setStep('budget')
    } else if (step === 'budget') {
      setStep('hobbies')
    } else if (step === 'hobbies') {
      setStep('lifestyle')
    } else {
      handleFinish()
    }
  }

  const handleFinish = async (e?: React.MouseEvent) => {
    e?.preventDefault()
    e?.stopPropagation()
    
    console.log('handleFinish called', { user, location, startDate, endDate })
    
    if (!user) {
      console.error('No user found, cannot complete onboarding')
      return
    }

    setIsSaving(true)
    try {
      const onboardingData = {
        location: location,
        start_date: startDate,
        end_date: endDate,
        budget: budget || null,
        hobbies: selectedHobbies,
        lifestyle_preferences: selectedLifestyle,
      }

      console.log('Saving onboarding data:', onboardingData)
      const success = await markOnboardingComplete(user.id, onboardingData)
      
      // Always call onComplete to redirect, even if save fails
      // The user can update their profile later if needed
      if (success) {
        console.log('Onboarding data saved successfully')
      } else {
        console.warn('Onboarding data save failed, but continuing to dashboard')
      }
      
      console.log('Calling onComplete callback')
      onComplete()
    } catch (error) {
      console.error('Error saving onboarding:', error)
      // Still redirect even if there's an error
      console.log('Calling onComplete callback after error')
      onComplete()
    } finally {
      setIsSaving(false)
    }
  }

  const toggleHobby = (hobby: string) => {
    setSelectedHobbies((prev) =>
      prev.includes(hobby) ? prev.filter((h) => h !== hobby) : [...prev, hobby]
    )
  }

  const toggleLifestyle = (option: string) => {
    setSelectedLifestyle((prev) =>
      prev.includes(option) ? prev.filter((l) => l !== option) : [...prev, option]
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="glass glass-shadow-strong rounded-[20px] p-8 md:p-12 w-full max-w-2xl"
      >
        {/* Mint accent line */}
        <div className="h-0.5 bg-mint mb-8" />

        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Step {currentStepNumber} of {totalSteps}
            </span>
            <span className="text-sm text-gray-500">
              {Math.round((currentStepNumber / totalSteps) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-mint h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(currentStepNumber / totalSteps) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* Location Step */}
          {step === 'location' && (
            <motion.div
              key="location"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <h2 className="text-2xl font-semibold mb-2 text-gray-900">
                Where are you interning this summer?
              </h2>
              <p className="text-gray-600 mb-6">Help us find roommates and friends in your area</p>

              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="San Francisco, CA"
                className="w-full px-4 py-3 rounded-full border border-gray-200 bg-white focus-ring"
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && location && handleNext()}
              />

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSkip}
                  className="flex-1 py-3 rounded-full border border-gray-300 bg-white text-gray-700 font-medium hover:bg-gray-50 transition-colors focus-ring"
                >
                  Skip
                </button>
                <button
                  onClick={handleNext}
                  disabled={!location}
                  className="flex-1 py-3 rounded-full bg-mint text-white font-medium hover:bg-mint-dark transition-colors focus-ring disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </motion.div>
          )}


          {/* Dates Step */}
          {step === 'dates' && (
            <motion.div
              key="dates"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <h2 className="text-2xl font-semibold mb-2 text-gray-900">
                When are you there?
              </h2>
              <p className="text-gray-600 mb-6">When does your summer internship start and end?</p>

              <div className="space-y-3">
                <div>
                  <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 mb-2">
                    Start date
                  </label>
                  <input
                    id="start-date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-full border border-gray-200 bg-white focus-ring"
                  />
                </div>
                <div>
                  <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 mb-2">
                    End date
                  </label>
                  <input
                    id="end-date"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-full border border-gray-200 bg-white focus-ring"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleBack}
                  className="flex-1 py-3 rounded-full border border-gray-300 bg-white text-gray-700 font-medium hover:bg-gray-50 transition-colors focus-ring"
                >
                  Back
                </button>
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
                  Next
                </button>
              </div>
            </motion.div>
          )}

          {/* Budget Step */}
          {step === 'budget' && (
            <motion.div
              key="budget"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <h2 className="text-2xl font-semibold mb-2 text-gray-900">
                What's your monthly budget?
              </h2>
              <p className="text-gray-600 mb-6">Help us find roommates with similar budgets</p>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="text"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="1200"
                  className="w-full pl-8 pr-4 py-3 rounded-full border border-gray-200 bg-white focus-ring"
                  autoFocus
                  onKeyDown={(e) => e.key === 'Enter' && budget && handleNext()}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">/month</span>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleBack}
                  className="flex-1 py-3 rounded-full border border-gray-300 bg-white text-gray-700 font-medium hover:bg-gray-50 transition-colors focus-ring"
                >
                  Back
                </button>
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

          {/* Hobbies Step */}
          {step === 'hobbies' && (
            <motion.div
              key="hobbies"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <h2 className="text-2xl font-semibold mb-2 text-gray-900">
                What are your hobbies?
              </h2>
              <p className="text-gray-600 mb-6">Select your interests to find like-minded roommates and friends</p>

              <div className="flex flex-wrap gap-2">
                {hobbies.map((hobby) => (
                  <button
                    key={hobby}
                    type="button"
                    onClick={() => toggleHobby(hobby)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors focus-ring ${
                      selectedHobbies.includes(hobby)
                        ? 'bg-mint text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {hobby}
                  </button>
                ))}
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleBack}
                  className="flex-1 py-3 rounded-full border border-gray-300 bg-white text-gray-700 font-medium hover:bg-gray-50 transition-colors focus-ring"
                >
                  Back
                </button>
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
                  Next
                </button>
              </div>
            </motion.div>
          )}

          {/* Lifestyle Step */}
          {step === 'lifestyle' && (
            <motion.div
              key="lifestyle"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <h2 className="text-2xl font-semibold mb-2 text-gray-900">
                Lifestyle preferences
              </h2>
              <p className="text-gray-600 mb-6">Help us match you with compatible roommates</p>

              <div className="flex flex-wrap gap-2">
                {lifestyleOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => toggleLifestyle(option)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors focus-ring ${
                      selectedLifestyle.includes(option)
                        ? 'bg-mint text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleBack}
                  className="flex-1 py-3 rounded-full border border-gray-300 bg-white text-gray-700 font-medium hover:bg-gray-50 transition-colors focus-ring"
                >
                  Back
                </button>
                <button
                  onClick={handleSkip}
                  className="flex-1 py-3 rounded-full border border-gray-300 bg-white text-gray-700 font-medium hover:bg-gray-50 transition-colors focus-ring"
                >
                  Skip
                </button>
                <button
                  type="button"
                  onClick={handleFinish}
                  disabled={isSaving}
                  className="flex-1 py-3 rounded-full bg-mint text-white font-medium hover:bg-mint-dark transition-colors focus-ring disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? 'Saving...' : 'Finish'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

