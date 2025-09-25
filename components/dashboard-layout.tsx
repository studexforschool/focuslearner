'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth-store'
import { FocusNavbar } from '@/components/focus-navbar'
import { AboutModal } from '@/components/about-modal'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [aboutOpen, setAboutOpen] = useState(false)
  const router = useRouter()
  const { isAuthenticated, loading } = useAuthStore()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/')
    }
  }, [isAuthenticated, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-pure-black dark:bg-pure-black light:bg-white flex items-center justify-center">
        <div className="text-white dark:text-white light:text-black">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-pure-black dark:bg-pure-black light:bg-white">
      {/* New Resizable Navbar */}
      <FocusNavbar />
      
      {/* Main content with padding for navbar */}
      <main className="pt-16">
        {children}
      </main>

      <AboutModal isOpen={aboutOpen} onClose={() => setAboutOpen(false)} />
    </div>
  )
}
