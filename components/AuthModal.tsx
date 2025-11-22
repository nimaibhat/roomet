'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/lib/supabase'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
  startWithOnboarding?: boolean
}

type AuthStep = 'email' | 'check-inbox' | 'onboarding'
type OnboardingStep = 'location' | 'budget' | 'linkedin'

export default function AuthModal({ isOpen, onClose, onSuccess, startWithOnboarding = false }: AuthModalProps) {
  const [authStep, setAuthStep] = useState<AuthStep>(startWithOnboarding ? 'onboarding' : 'email')
  const [onboardingStep, setOnboardingStep] = useState<OnboardingStep>('location')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [location, setLocation] = useState('')
  const [dates, setDates] = useState('')
  const [budget, setBudget] = useState('')
  const [lifestyleTags, setLifestyleTags] = useState<string[]>([])

  // Update auth step when startWithOnboarding prop changes
  useEffect(() => {
    if (isOpen && startWithOnboarding) {
      setAuthStep('onboarding')
    } else if (isOpen && !startWithOnboarding) {
      setAuthStep('email')
    }
  }, [isOpen, startWithOnboarding])

  const validateEmail = (email: string) => {
    return email.toLowerCase().endsWith('.edu')
  }

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!validateEmail(email)) {
      setError('Please use a valid .edu email address')
      return
    }

    setIsLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) throw error

      setAuthStep('check-inbox')
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOnboardingNext = () => {
    if (onboardingStep === 'location') {
      setOnboardingStep('budget')
    } else if (onboardingStep === 'budget') {
      setOnboardingStep('linkedin')
    } else {
      // Complete onboarding
      onSuccess?.()
      handleClose()
    }
  }

  const handleOnboardingSkip = () => {
    if (onboardingStep === 'location') {
      setOnboardingStep('budget')
    } else if (onboardingStep === 'budget') {
      setOnboardingStep('linkedin')
    } else {
      onSuccess?.()
      handleClose()
    }
  }

  const handleClose = () => {
    setAuthStep('email')
    setOnboardingStep('location')
    setEmail('')
    setError('')
    setLocation('')
    setDates('')
    setBudget('')
    setLifestyleTags([])
    onClose()
  }

  const lifestyleOptions = ['Early bird', 'Night owl', 'Clean', 'Social', 'Quiet', 'Pet-friendly']

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/10 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="glass glass-shadow-strong rounded-[20px] w-full max-w-md relative overflow-hidden"
          role="dialog"
          aria-modal="true"
          aria-labelledby="auth-modal-title"
        >
          {/* Mint accent line */}
          <div className="h-0.5 bg-mint" />

          <div className="p-8">
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus-ring rounded-full p-1"
              aria-label="Close modal"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Email step */}
            {authStep === 'email' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <h2 id="auth-modal-title" className="text-2xl font-semibold mb-2 text-gray-900">
                  Almost done
                </h2>
                <p className="text-gray-600 mb-6">
                  Verify with your .edu email to see your roommate matches.
                </p>

                <form onSubmit={handleEmailSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="email" className="sr-only">
                      Email address
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@university.edu"
                      className="w-full px-4 py-3 rounded-full border border-gray-200 bg-white focus-ring transition-colors"
                      required
                      aria-invalid={error ? 'true' : 'false'}
                      aria-describedby={error ? 'email-error' : undefined}
                    />
                    {error && (
                      <p id="email-error" className="mt-2 text-sm text-red-500" role="alert">
                        {error}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 rounded-full bg-mint text-white font-medium hover:bg-mint-dark transition-colors focus-ring disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Sending...' : 'Continue with .edu Email'}
                  </button>
                </form>

                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">or</span>
                    </div>
                  </div>

                  <button
                    className="mt-4 w-full py-3 rounded-full border border-gray-300 bg-white text-gray-700 font-medium hover:bg-gray-50 transition-colors focus-ring"
                  >
                    Continue with LinkedIn
                  </button>
                </div>
              </motion.div>
            )}

            {/* Check inbox step */}
            {authStep === 'check-inbox' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center"
              >
                <div className="mb-6">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-mint/10 flex items-center justify-center">
                    <svg className="w-8 h-8 text-mint" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-semibold mb-2 text-gray-900">Check your inbox</h2>
                  <p className="text-gray-600">
                    We sent a magic link to <strong>{email}</strong>
                  </p>
                </div>
              </motion.div>
            )}

            {/* Onboarding step */}
            {authStep === 'onboarding' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <h2 className="text-2xl font-semibold mb-6 text-gray-900">Tell us about yourself</h2>

                {/* Progress dots */}
                <div className="flex justify-center gap-2 mb-8">
                  {(['location', 'budget', 'linkedin'] as OnboardingStep[]).map((step, idx) => {
                    const stepIdx = ['location', 'budget', 'linkedin'].indexOf(onboardingStep)
                    return (
                      <div
                        key={step}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          idx <= stepIdx ? 'bg-mint' : 'bg-gray-300'
                        }`}
                        aria-label={`Step ${idx + 1}`}
                      />
                    )}
                  )}
                </div>

                {/* Location step */}
                {onboardingStep === 'location' && (
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                        Internship Location
                      </label>
                      <input
                        id="location"
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="San Francisco, CA"
                        className="w-full px-4 py-3 rounded-full border border-gray-200 bg-white focus-ring"
                      />
                    </div>
                    <div>
                      <label htmlFor="dates" className="block text-sm font-medium text-gray-700 mb-2">
                        Dates
                      </label>
                      <input
                        id="dates"
                        type="text"
                        value={dates}
                        onChange={(e) => setDates(e.target.value)}
                        placeholder="June - August 2024"
                        className="w-full px-4 py-3 rounded-full border border-gray-200 bg-white focus-ring"
                      />
                    </div>
                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={handleOnboardingSkip}
                        className="flex-1 py-3 rounded-full border border-gray-300 bg-white text-gray-700 font-medium hover:bg-gray-50 transition-colors focus-ring"
                      >
                        Skip
                      </button>
                      <button
                        onClick={handleOnboardingNext}
                        className="flex-1 py-3 rounded-full bg-mint text-white font-medium hover:bg-mint-dark transition-colors focus-ring"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}

                {/* Budget step */}
                {onboardingStep === 'budget' && (
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2">
                        Monthly Budget
                      </label>
                      <input
                        id="budget"
                        type="text"
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                        placeholder="$1200"
                        className="w-full px-4 py-3 rounded-full border border-gray-200 bg-white focus-ring"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Lifestyle Preferences
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {lifestyleOptions.map((option) => (
                          <button
                            key={option}
                            type="button"
                            onClick={() => {
                              setLifestyleTags((prev) =>
                                prev.includes(option)
                                  ? prev.filter((t) => t !== option)
                                  : [...prev, option]
                              )
                            }}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors focus-ring ${
                              lifestyleTags.includes(option)
                                ? 'bg-mint text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={handleOnboardingSkip}
                        className="flex-1 py-3 rounded-full border border-gray-300 bg-white text-gray-700 font-medium hover:bg-gray-50 transition-colors focus-ring"
                      >
                        Skip
                      </button>
                      <button
                        onClick={handleOnboardingNext}
                        className="flex-1 py-3 rounded-full bg-mint text-white font-medium hover:bg-mint-dark transition-colors focus-ring"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}

                {/* LinkedIn step */}
                {onboardingStep === 'linkedin' && (
                  <div className="space-y-4">
                    <p className="text-gray-600 text-center mb-4">
                      Connect your LinkedIn profile to help others learn more about you
                    </p>
                    <button
                      className="w-full py-3 rounded-full border border-gray-300 bg-white text-gray-700 font-medium hover:bg-gray-50 transition-colors focus-ring flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                      Connect LinkedIn
                    </button>
                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={handleOnboardingSkip}
                        className="flex-1 py-3 rounded-full border border-gray-300 bg-white text-gray-700 font-medium hover:bg-gray-50 transition-colors focus-ring"
                      >
                        Skip
                      </button>
                      <button
                        onClick={handleOnboardingNext}
                        className="flex-1 py-3 rounded-full bg-mint text-white font-medium hover:bg-mint-dark transition-colors focus-ring"
                      >
                        Complete
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

