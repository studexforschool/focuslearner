'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

interface GlobeProps {
  className?: string
}

export function Globe({ className = '' }: GlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const size = 200
    canvas.width = size
    canvas.height = size

    let animationId: number
    let rotation = 0

    const drawGlobe = () => {
      ctx.clearRect(0, 0, size, size)
      
      const centerX = size / 2
      const centerY = size / 2
      const radius = 80

      // Draw globe background
      const gradient = ctx.createRadialGradient(centerX - 20, centerY - 20, 0, centerX, centerY, radius)
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)')
      gradient.addColorStop(0.7, 'rgba(255, 255, 255, 0.1)')
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0.05)')
      
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
      ctx.fill()

      // Draw globe outline
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
      ctx.stroke()

      // Draw latitude lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
      ctx.lineWidth = 0.5
      
      for (let i = -2; i <= 2; i++) {
        const y = centerY + (i * radius / 3)
        const width = Math.sqrt(radius * radius - (i * radius / 3) * (i * radius / 3))
        
        ctx.beginPath()
        ctx.ellipse(centerX, y, width, width * 0.2, 0, 0, Math.PI * 2)
        ctx.stroke()
      }

      // Draw longitude lines
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3 + rotation
        
        ctx.save()
        ctx.translate(centerX, centerY)
        ctx.rotate(angle)
        
        ctx.beginPath()
        ctx.ellipse(0, 0, radius * 0.3, radius, 0, 0, Math.PI * 2)
        ctx.stroke()
        
        ctx.restore()
      }

      // Draw connection points (dots)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)'
      const points = [
        { x: centerX + Math.cos(rotation) * 60, y: centerY + Math.sin(rotation) * 30 },
        { x: centerX + Math.cos(rotation + 1) * 50, y: centerY + Math.sin(rotation + 1) * 40 },
        { x: centerX + Math.cos(rotation + 2) * 70, y: centerY + Math.sin(rotation + 2) * 20 },
        { x: centerX + Math.cos(rotation + 3) * 45, y: centerY + Math.sin(rotation + 3) * 35 },
      ]

      points.forEach(point => {
        ctx.beginPath()
        ctx.arc(point.x, point.y, 2, 0, Math.PI * 2)
        ctx.fill()
      })

      // Draw connecting lines between points
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
      ctx.lineWidth = 1
      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          ctx.beginPath()
          ctx.moveTo(points[i].x, points[i].y)
          ctx.lineTo(points[j].x, points[j].y)
          ctx.stroke()
        }
      }

      rotation += 0.01
      animationId = requestAnimationFrame(drawGlobe)
    }

    drawGlobe()

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, ease: 'easeOut' }}
      className={`relative ${className}`}
    >
      <canvas
        ref={canvasRef}
        className="drop-shadow-lg"
        style={{ filter: 'blur(0.5px)' }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/5 rounded-full" />
    </motion.div>
  )
}
