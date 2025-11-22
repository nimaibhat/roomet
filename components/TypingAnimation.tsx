'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface TypingAnimationProps {
  text: string
  speed?: number
  onComplete?: () => void
}

export default function TypingAnimation({ 
  text, 
  speed = 50,
  onComplete 
}: TypingAnimationProps) {
  const [displayedText, setDisplayedText] = useState('')
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    if (displayedText.length < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(text.slice(0, displayedText.length + 1))
      }, speed)

      return () => clearTimeout(timeout)
    } else if (!isComplete) {
      setIsComplete(true)
      onComplete?.()
    }
  }, [displayedText, text, speed, isComplete, onComplete])

  return (
    <span>
      {displayedText}
      {!isComplete && <span className="animate-pulse">|</span>}
    </span>
  )
}

