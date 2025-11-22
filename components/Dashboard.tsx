'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import MatchCard from '@/components/MatchCard'

interface MockMatch {
  name: string
  location: string
  budget?: string
  startDate?: string
  endDate?: string
  hobbies?: string[]
  lifestylePreferences?: string[]
}

export default function Dashboard() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  // Mock matches data
  const mockMatches: MockMatch[] = [
    {
      name: 'Alex M.',
      location: 'San Francisco, CA',
      budget: '1200',
      startDate: '2024-06-01',
      endDate: '2024-08-31',
      hobbies: ['Fitness & Gym', 'Hiking & Outdoors', 'Photography', 'Cooking'],
      lifestylePreferences: ['Early bird', 'Clean & organized', 'Social & outgoing'],
    },
    {
      name: 'Jordan K.',
      location: 'San Francisco, CA',
      budget: '1100',
      startDate: '2024-05-15',
      endDate: '2024-08-15',
      hobbies: ['Gaming', 'Music', 'Movies & TV'],
      lifestylePreferences: ['Night owl', 'Pet-friendly', 'Likes to host'],
    },
    {
      name: 'Sam T.',
      location: 'New York, NY',
      budget: '1500',
      startDate: '2024-06-10',
      endDate: '2024-09-10',
      hobbies: ['Reading', 'Art & Design', 'Yoga & Meditation'],
      lifestylePreferences: ['Quiet & introverted', 'Prefers quiet space'],
    },
    {
      name: 'Morgan L.',
      location: 'Seattle, WA',
      budget: '1000',
      startDate: '2024-05-20',
      endDate: '2024-08-20',
      hobbies: ['Travel', 'Food & Dining', 'Volunteering', 'Photography'],
      lifestylePreferences: ['Social & outgoing', 'Vegetarian/Vegan', 'Non-smoker'],
    },
    {
      name: 'Casey R.',
      location: 'San Francisco, CA',
      budget: '1300',
      startDate: '2024-06-05',
      endDate: '2024-08-30',
      hobbies: ['Sports', 'Fitness & Gym', 'Dancing'],
      lifestylePreferences: ['Early bird', 'Clean & organized'],
    },
    {
      name: 'Taylor B.',
      location: 'Austin, TX',
      budget: '900',
      startDate: '2024-06-01',
      endDate: '2024-08-31',
      hobbies: ['Music', 'Gaming', 'Movies & TV', 'Cooking'],
      lifestylePreferences: ['Night owl', 'Pet-friendly'],
    },
    {
      name: 'Riley C.',
      location: 'Boston, MA',
      budget: '1400',
      startDate: '2024-05-25',
      endDate: '2024-08-25',
      hobbies: ['Reading', 'Art & Design', 'Travel'],
      lifestylePreferences: ['Quiet & introverted', 'Non-smoker'],
    },
    {
      name: 'Quinn D.',
      location: 'San Francisco, CA',
      budget: '1250',
      startDate: '2024-06-15',
      endDate: '2024-09-15',
      hobbies: ['Hiking & Outdoors', 'Yoga & Meditation', 'Volunteering'],
      lifestylePreferences: ['Early bird', 'Social & outgoing', 'Vegetarian/Vegan'],
    },
  ]

  useEffect(() => {
    if (user) {
      loadProfile()
    }
  }, [user])

  const loadProfile = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') {
        // PGRST116 is "not found" error, which is okay for new users
        console.error('Error loading profile:', error)
      } else {
        setProfile(data)
      }
    } catch (error) {
      console.error('Error loading profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-gray-400">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-gray-100 p-6 flex flex-col">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Roomet</h1>
        </div>
        <nav className="flex-1 space-y-2">
          <a href="#" className="block px-4 py-2 rounded-lg bg-mint/10 text-mint font-medium">
            Dashboard
          </a>
          <a href="#" className="block px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
            Matches
          </a>
          <a href="#" className="block px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
            Profile
          </a>
          <a href="#" className="block px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
            Settings
          </a>
        </nav>
        <button
          onClick={handleSignOut}
          className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors text-left"
        >
          Sign Out
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Welcome Message */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back{user?.email ? `, ${user.email.split('@')[0]}` : ''}!
            </h2>
            <p className="text-gray-600">Find your perfect roommate match</p>
          </div>

          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by location, budget, hobbies..."
                className="glass glass-shadow w-full pl-12 pr-4 py-4 rounded-full border border-gray-200 bg-white/55 text-gray-900 placeholder-gray-500 focus-ring text-lg"
              />
            </div>
          </div>

          {/* Matches Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockMatches.map((match, index) => (
              <MatchCard
                key={index}
                name={match.name}
                location={match.location}
                budget={match.budget}
                startDate={match.startDate}
                endDate={match.endDate}
                hobbies={match.hobbies}
                lifestylePreferences={match.lifestylePreferences}
                index={index}
              />
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  )
}

