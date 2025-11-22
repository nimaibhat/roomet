'use client'

import { motion } from 'framer-motion'

interface MatchCardProps {
  name: string
  location: string
  budget?: string
  startDate?: string
  endDate?: string
  hobbies?: string[]
  lifestylePreferences?: string[]
  index: number
}

export default function MatchCard({
  name,
  location,
  budget,
  startDate,
  endDate,
  hobbies = [],
  lifestylePreferences = [],
  index,
}: MatchCardProps) {
  const formatDateRange = () => {
    if (!startDate || !endDate) return null
    const start = new Date(startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    const end = new Date(endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    return `${start} - ${end}`
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="glass glass-shadow rounded-[16px] p-6 hover:shadow-lg transition-shadow cursor-pointer"
    >
      {/* Mint accent line */}
      <div className="h-1 w-full bg-mint rounded-t-[16px] -mt-6 -mx-6 mb-4" />

      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{name}</h3>
            <p className="text-sm text-gray-600 flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {location}
            </p>
          </div>
          {budget && (
            <span className="text-sm font-medium text-mint bg-mint/10 px-3 py-1 rounded-full">
              ${budget}/mo
            </span>
          )}
        </div>

        {/* Date Range */}
        {formatDateRange() && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {formatDateRange()}
          </div>
        )}

        {/* Hobbies */}
        {hobbies.length > 0 && (
          <div>
            <p className="text-xs font-medium text-gray-500 mb-2">Hobbies</p>
            <div className="flex flex-wrap gap-1.5">
              {hobbies.slice(0, 4).map((hobby, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700"
                >
                  {hobby}
                </span>
              ))}
              {hobbies.length > 4 && (
                <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-500">
                  +{hobbies.length - 4}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Lifestyle Preferences */}
        {lifestylePreferences.length > 0 && (
          <div>
            <p className="text-xs font-medium text-gray-500 mb-2">Lifestyle</p>
            <div className="flex flex-wrap gap-1.5">
              {lifestylePreferences.slice(0, 3).map((pref, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 text-xs rounded-full bg-mint/10 text-mint"
                >
                  {pref}
                </span>
              ))}
              {lifestylePreferences.length > 3 && (
                <span className="px-2 py-1 text-xs rounded-full bg-mint/10 text-mint/70">
                  +{lifestylePreferences.length - 3}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}

