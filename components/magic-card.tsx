'use client'

import React, { useEffect, useRef } from 'react'
import { useTheme } from 'next-themes'

interface MagicCardProps {
  children: React.ReactNode
  className?: string
  gradientColor?: string
}

export function MagicCard({ 
  children, 
  className = "", 
  gradientColor
}: MagicCardProps) {
  const { theme } = useTheme()
  const cardRef = useRef<HTMLDivElement>(null)
  
  const defaultGradientColor = theme === "dark" ? "#262626" : "#D9D9D955"
  const finalGradientColor = gradientColor || defaultGradientColor

  useEffect(() => {
    const card = cardRef.current
    if (!card) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      
      // Create magic gradient effect
      const gradient = `radial-gradient(circle 150px at ${x}px ${y}px, ${finalGradientColor}, transparent)`
      card.style.setProperty('--magic-gradient', gradient)
    }

    const handleMouseEnter = () => {
      card.style.setProperty('--magic-opacity', '1')
    }

    const handleMouseLeave = () => {
      card.style.setProperty('--magic-opacity', '0')
    }

    card.addEventListener('mousemove', handleMouseMove)
    card.addEventListener('mouseenter', handleMouseEnter)
    card.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      card.removeEventListener('mousemove', handleMouseMove)
      card.removeEventListener('mouseenter', handleMouseEnter)
      card.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [finalGradientColor])

  return (
    <div 
      ref={cardRef}
      className={`magic-card ${className}`}
      style={{
        '--magic-gradient': `radial-gradient(circle 150px at 50% 50%, ${finalGradientColor}00, transparent)`,
        '--magic-opacity': '0'
      } as React.CSSProperties}
    >
      <div className="magic-card-content">
        {children}
      </div>
    </div>
  )
}
