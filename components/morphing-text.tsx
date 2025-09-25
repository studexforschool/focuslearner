'use client'

import { useEffect, useRef } from 'react'
import { motion, useAnimation, useInView } from 'framer-motion'

interface MorphingTextProps {
  texts: string[]
  className?: string
  interval?: number
}

export function MorphingText({ texts, className = '', interval = 3000 }: MorphingTextProps) {
  const controls = useAnimation()
  const ref = useRef(null)
  const isInView = useInView(ref)
  const currentIndex = useRef(0)

  useEffect(() => {
    if (!isInView) return

    const animateText = async () => {
      await controls.start({
        opacity: 0,
        filter: 'blur(10px)',
        transition: { duration: 0.5 }
      })

      currentIndex.current = (currentIndex.current + 1) % texts.length

      await controls.start({
        opacity: 1,
        filter: 'blur(0px)',
        transition: { duration: 0.5 }
      })
    }

    const intervalId = setInterval(animateText, interval)
    
    return () => clearInterval(intervalId)
  }, [controls, texts, interval, isInView])

  return (
    <div ref={ref} className={`relative ${className}`}>
      <motion.div
        animate={controls}
        initial={{ opacity: 1, filter: 'blur(0px)' }}
        className="text-center"
      >
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-white/90 to-white/80">
          {texts[0]}
        </span>
      </motion.div>
    </div>
  )
}
