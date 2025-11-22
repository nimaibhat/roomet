'use client'

import { motion } from 'framer-motion'

interface RoommateCardProps {
  name: string
  location: string
  dates: string
  budget: string
  tags?: string[]
  index: number
}

export default function RoommateCard({ 
  name, 
  location, 
  dates, 
  budget, 
  tags = [],
  index 
}: RoommateCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 0.6, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
      className="glass glass-shadow rounded-[16px] p-4 opacity-60 hover:opacity-80 transition-opacity"
    >
      <div className="h-1 w-full bg-mint rounded-t-[16px] -mt-4 -mx-4 mb-3" />
      <div className="space-y-2">
        <div className="flex items-start justify-between">
          <h3 className="font-medium text-gray-900">{name}</h3>
          <span className="text-sm text-gray-500">{budget}/mo</span>
        </div>
        <p className="text-sm text-gray-600">{location}</p>
        <p className="text-xs text-gray-500">{dates}</p>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 text-xs rounded-full bg-mint/10 text-mint"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}

