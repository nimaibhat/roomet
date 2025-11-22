'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { checkUserExistsBetter } from '@/lib/auth-utils'

interface AuthScreenProps {
  onSignIn: () => void
  onSignUp: () => void
  onBack?: () => void
}

type AuthMode = 'email' | 'password' | 'signup'

export default function AuthScreen({ onSignIn, onSignUp, onBack }: AuthScreenProps) {
  const [mode, setMode] = useState<AuthMode>('email')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isChecking, setIsChecking] = useState(false)

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

    setIsChecking(true)
    // Default to signup - users can toggle to sign in if they have an account
    // Supabase's security model prevents reliable user existence checks
    setTimeout(() => {
      setMode('signup')
      setIsChecking(false)
    }, 300) // Small delay for UX
  }

  const handlePasswordSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!password) {
      setError('Please enter your password')
      return
    }

    setIsLoading(true)
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      onSignIn()
    } catch (err: any) {
      setError(err.message || 'Invalid email or password')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!password) {
      setError('Please enter a password')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setIsLoading(true)
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        const errorMsg = error.message.toLowerCase()
        
        // If user already exists, switch to password login mode
        if (
          errorMsg.includes('user already registered') ||
          errorMsg.includes('already registered') ||
          errorMsg.includes('email address is already in use') ||
          errorMsg.includes('already exists')
        ) {
          setMode('password')
          setError('An account with this email already exists. Please sign in.')
          setIsLoading(false)
          return
        }
        
        throw error
      }

      onSignUp()
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="glass glass-shadow-strong rounded-[20px] p-8 md:p-12 w-full max-w-md"
      >
        {/* Mint accent line */}
        <div className="h-0.5 bg-mint mb-8" />

        {/* Back button */}
        {onBack && mode !== 'email' && (
          <button
            onClick={() => {
              setMode('email')
              setError('')
              setPassword('')
              setConfirmPassword('')
            }}
            className="mb-4 text-gray-400 hover:text-gray-600 focus-ring rounded-full p-1 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
        )}

        <AnimatePresence mode="wait">
          {/* Email Input Step */}
          {mode === 'email' && (
            <motion.div
              key="email"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
            >
              <h2 className="text-2xl font-semibold mb-2 text-gray-900">Get Started</h2>
              <p className="text-gray-600 mb-6">Enter your .edu email to continue</p>

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
                  disabled={isChecking}
                  className="w-full py-3 rounded-full bg-mint text-white font-medium hover:bg-mint-dark transition-colors focus-ring disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isChecking ? 'Checking...' : 'Continue'}
                </button>
              </form>
            </motion.div>
          )}

          {/* Password Sign In Step */}
          {mode === 'password' && (
            <motion.div
              key="password"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
            >
              <h2 className="text-2xl font-semibold mb-2 text-gray-900">Welcome back</h2>
              <p className="text-gray-600 mb-6">Enter your password to sign in</p>

              <form onSubmit={handlePasswordSignIn} className="space-y-4">
                <div>
                  <label htmlFor="password" className="sr-only">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full px-4 py-3 rounded-full border border-gray-200 bg-white focus-ring transition-colors"
                    required
                    aria-invalid={error ? 'true' : 'false'}
                    aria-describedby={error ? 'password-error' : undefined}
                  />
                  {error && (
                    <p id="password-error" className="mt-2 text-sm text-red-500" role="alert">
                      {error}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 rounded-full bg-mint text-white font-medium hover:bg-mint-dark transition-colors focus-ring disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </button>
              </form>

              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  New? Create account
                </button>
              </div>
            </motion.div>
          )}

          {/* Sign Up Step */}
          {mode === 'signup' && (
            <motion.div
              key="signup"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
            >
              <h2 className="text-2xl font-semibold mb-2 text-gray-900">Create account</h2>
              <p className="text-gray-600 mb-6">Set up your password to get started</p>

              <form onSubmit={handleSignUp} className="space-y-4">
                <div>
                  <label htmlFor="signup-password" className="sr-only">
                    Password
                  </label>
                  <input
                    id="signup-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password"
                    className="w-full px-4 py-3 rounded-full border border-gray-200 bg-white focus-ring transition-colors"
                    required
                    minLength={6}
                  />
                </div>

                <div>
                  <label htmlFor="confirm-password" className="sr-only">
                    Confirm Password
                  </label>
                  <input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    className="w-full px-4 py-3 rounded-full border border-gray-200 bg-white focus-ring transition-colors"
                    required
                    aria-invalid={error ? 'true' : 'false'}
                    aria-describedby={error ? 'signup-error' : undefined}
                  />
                  {error && (
                    <p id="signup-error" className="mt-2 text-sm text-red-500" role="alert">
                      {error}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 rounded-full bg-mint text-white font-medium hover:bg-mint-dark transition-colors focus-ring disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Creating account...' : 'Create Account'}
                </button>
              </form>

              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setMode('password')
                    setError('')
                    setPassword('')
                    setConfirmPassword('')
                  }}
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Already have an account? Sign in
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

