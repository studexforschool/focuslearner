"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Moon, Sun } from "lucide-react"
import { flushSync } from "react-dom"
import { useTheme } from "next-themes"

import { cn } from "@/lib/utils"

type Props = {
  className?: string
}

export const AnimatedThemeToggler = ({ className }: Props) => {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = theme === 'dark'

  const toggleTheme = useCallback(async () => {
    if (!buttonRef.current) return

    const newTheme = isDark ? 'light' : 'dark'
    
    // Check if View Transition API is supported
    if ('startViewTransition' in document) {
      try {
        await (document as any).startViewTransition(() => {
          flushSync(() => {
            setTheme(newTheme)
          })
        }).ready

        const { top, left, width, height } =
          buttonRef.current.getBoundingClientRect()
        const x = left + width / 2
        const y = top + height / 2
        const maxRadius = Math.hypot(
          Math.max(left, window.innerWidth - left),
          Math.max(top, window.innerHeight - top)
        )

        document.documentElement.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${maxRadius}px at ${x}px ${y}px)`,
            ],
          },
          {
            duration: 700,
            easing: "ease-in-out",
            pseudoElement: "::view-transition-new(root)",
          }
        )
      } catch (error) {
        console.log('View Transition API not fully supported, using fallback')
        setTheme(newTheme)
      }
    } else {
      setTheme(newTheme)
    }
  }, [isDark, setTheme])

  if (!mounted) {
    return (
      <div className="p-2 w-9 h-9 rounded-lg bg-black/10 dark:bg-white/10">
        {/* Placeholder to prevent layout shift */}
      </div>
    )
  }

  return (
    <button 
      ref={buttonRef} 
      onClick={toggleTheme} 
      className={cn(
        "p-2 rounded-lg bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20 transition-colors",
        className
      )}
      aria-label="Toggle theme"
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-yellow-400" />
      ) : (
        <Moon className="w-5 h-5 text-gray-800 dark:text-white" />
      )}
    </button>
  )
}
