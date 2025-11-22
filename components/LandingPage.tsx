'use client'

import { motion } from 'framer-motion'

interface LandingPageProps {
  onGetStarted: () => void
}

export default function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="text-center max-w-3xl space-y-6"
        >
          {/* Hero Title */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold text-gray-900 leading-tight"
          >
            Find Your Perfect
            <br />
            <span className="text-mint">Intern Roommate</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-600 font-light"
          >
            Find safe, verified intern roommates in seconds.
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="pt-4"
          >
            <button
              onClick={onGetStarted}
              className="glass glass-shadow-strong rounded-full px-8 py-4 text-lg font-semibold text-gray-900 hover:bg-white/80 transition-all focus-ring group"
              aria-label="Get Started"
            >
              Get Started{' '}
              <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">
                →
              </span>
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-center items-center gap-4 md:gap-8 text-sm text-gray-600">
          <a href="#" className="hover:text-gray-900 transition-colors">About</a>
          <a href="#" className="hover:text-gray-900 transition-colors">Privacy</a>
          <a href="#" className="hover:text-gray-900 transition-colors">Contact</a>
        </div>
      </footer>
    </div>
  )
}

