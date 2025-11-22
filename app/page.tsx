'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import LandingPage from '@/components/LandingPage'
import AuthScreen from '@/components/AuthScreen'
import OnboardingWizard from '@/components/OnboardingWizard'
import Dashboard from '@/components/Dashboard'
import { useAuth } from '@/hooks/useAuth'
import { hasCompletedOnboarding } from '@/lib/auth-utils'

type AppState = 'landing' | 'auth' | 'onboarding' | 'dashboard'

function HomeContent() {
  const searchParams = useSearchParams()
  const { user, loading } = useAuth()
  const [appState, setAppState] = useState<AppState>('landing')
  const [checkingOnboarding, setCheckingOnboarding] = useState(false)

  const checkOnboardingStatus = async () => {
    if (!user) return

    setCheckingOnboarding(true)
    try {
      const completed = await hasCompletedOnboarding(user.id)
      setAppState(completed ? 'dashboard' : 'onboarding')
    } catch (error) {
      // If error checking, assume not completed and show onboarding
      console.error('Error checking onboarding status:', error)
      setAppState('onboarding')
    } finally {
      setCheckingOnboarding(false)
    }
  }

  // Check auth state and routing
  useEffect(() => {
    console.log('🔄 useEffect triggered - user:', user?.id, 'loading:', loading, 'appState:', appState)

    if (loading) {
      console.log('⏳ Still loading auth state...')
      return
    }

    if (user) {
      console.log('✅ User is authenticated:', user.id)
      // User is logged in, check if they've completed onboarding
      // Only check if we're not already on dashboard
      if (appState !== 'dashboard') {
        console.log('🔍 Checking onboarding status...')
        checkOnboardingStatus()
      }
    } else {
      console.log('❌ No user found')
      // User is not logged in, show landing page (unless already on auth screen)
      if (appState !== 'auth') {
        console.log('🏠 Redirecting to landing page')
        setAppState('landing')
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loading])

  const handleGetStarted = () => {
    setAppState('auth')
  }

  const handleSignIn = async () => {
    console.log('📍 handleSignIn called')
    // Wait for user state to be updated by useAuth hook
    // useEffect will check onboarding status once user is available
  }

  const handleSignUp = () => {
    console.log('📍 handleSignUp called')
    // Wait for user state to be updated by useAuth hook
    // useEffect will show onboarding once user is available
  }

  const handleOnboardingComplete = () => {
    console.log('🎯 handleOnboardingComplete called in page.tsx')
    console.log('📍 Current appState:', appState)
    console.log('📍 Setting appState to dashboard')
    setAppState('dashboard')
    console.log('✅ appState updated to dashboard')
  }

  // Show loading state while checking auth
  if (loading || checkingOnboarding) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-gray-400">Loading...</div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-white">
      <AnimatePresence mode="wait">
        {appState === 'landing' && (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <LandingPage onGetStarted={handleGetStarted} />
          </motion.div>
        )}

        {appState === 'auth' && (
          <motion.div
            key="auth"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <AuthScreen
              onSignIn={handleSignIn}
              onSignUp={handleSignUp}
              onBack={() => setAppState('landing')}
            />
          </motion.div>
        )}

        {appState === 'onboarding' && (
          <motion.div
            key="onboarding"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <OnboardingWizard onComplete={handleOnboardingComplete} />
          </motion.div>
        )}

        {appState === 'dashboard' && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Dashboard />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}

export default function Home() {
  return (
    <Suspense fallback={
      <main className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-gray-400">Loading...</div>
      </main>
    }>
      <HomeContent />
    </Suspense>
  )
}

