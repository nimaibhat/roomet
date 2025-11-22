import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Roomet - Find Your Intern Roommate',
  description: 'Connect with fellow interns and find your perfect roommate match',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}

