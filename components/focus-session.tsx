'use client'

import { useState, useEffect, useRef } from 'react'
import { 
  Play, 
  Pause, 
  Square, 
  Settings, 
  Target,
  Coffee,
  Zap,
  AlertTriangle,
  CheckCircle
} from 'lucide-react'
import { useProductivityStore } from '@/store/productivity-store'
import { TypewriterEffect } from '@/components/ui/typewriter-effect'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'

export function FocusSession() {
  const { currentSession, startSession, completeSession } = useProductivityStore()
  const [timeLeft, setTimeLeft] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [sessionType, setSessionType] = useState('pomodoro')
  const [duration, setDuration] = useState(25)
  const [distractions, setDistractions] = useState<any[]>([])
  const [showSettings, setShowSettings] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const sessionTypes = {
    pomodoro: { name: 'Pomodoro', defaultDuration: 25, color: 'electric-blue' },
    shortBreak: { name: 'Short Break', defaultDuration: 5, color: 'green-500' },
    longBreak: { name: 'Long Break', defaultDuration: 15, color: 'yellow-500' },
    custom: { name: 'Custom', defaultDuration: 30, color: 'purple-500' }
  }

  useEffect(() => {
    if (currentSession) {
      const elapsed = Math.floor((Date.now() - new Date(currentSession.startTime).getTime()) / 1000 / 60)
      setTimeLeft(Math.max(0, currentSession.duration - elapsed))
      setIsRunning(true)
      setSessionType(currentSession.type)
      setDuration(currentSession.duration)
      setDistractions(currentSession.distractions || [])
    } else {
      setTimeLeft(duration)
      setIsRunning(false)
    }
  }, [currentSession, duration])

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleSessionComplete()
            return 0
          }
          return prev - 1
        })
      }, 60000) // Update every minute
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning, timeLeft])

  const handleStartSession = () => {
    if (!currentSession) {
      startSession({
        duration,
        type: sessionType as any,
        startTime: new Date().toISOString(),
        completed: false
      })
      setTimeLeft(duration)
      setIsRunning(true)
      toast.success('Focus session started!')
    } else {
      setIsRunning(true)
    }
  }

  const handlePauseSession = () => {
    setIsRunning(false)
    toast('Session paused')
  }

  const handleStopSession = () => {
    setIsRunning(false)
    if (currentSession) {
      completeSession(currentSession.id)
      toast('Session stopped')
    }
    setTimeLeft(duration)
  }

  const handleSessionComplete = () => {
    setIsRunning(false)
    if (currentSession) {
      completeSession(currentSession.id)
      toast.success('🎉 Focus session completed!')
    }
    
    // Request notification permission and show notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Focus Session Complete!', {
        body: `Great job! You completed a ${duration}-minute ${sessionType} session.`,
        icon: '/favicon.ico'
      })
    }
  }

  const addDistraction = () => {
    const distraction = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      type: 'manual'
    }
    const newDistractions = [...distractions, distraction]
    setDistractions(newDistractions)
    toast('Distraction logged')
  }

  const formatTime = (minutes: number) => {
    const hrs = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}`
    }
    return `${mins}`
  }

  const getProgressPercentage = () => {
    if (!currentSession && !isRunning) return 0
    return ((duration - timeLeft) / duration) * 100
  }

  const requestNotificationPermission = () => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }

  useEffect(() => {
    requestNotificationPermission()
  }, [])

  return (
    <div className="main-content max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <TypewriterEffect
          words={[
            {
              text: "Focus",
              className: "text-3xl font-bold text-electric-blue"
            },
            {
              text: "Session",
              className: "text-3xl font-bold text-white"
            }
          ]}
          className="mb-2"
        />
        <p className="text-light-gray">
          Stay focused and track your productivity with AI-powered insights
        </p>
      </div>

      {/* Main Timer */}
      <div className="glass-card text-center max-w-2xl mx-auto relative overflow-hidden mb-8">
        {/* Content */}
        <div className="relative z-10 p-8">
          <div className="mb-6">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Target className="h-6 w-6 text-electric-blue" />
              <h2 className="text-xl font-semibold text-white">
                {sessionTypes[sessionType as keyof typeof sessionTypes].name}
              </h2>
            </div>
            
            {/* Circular Progress */}
            <div className="relative w-48 h-48 mx-auto mb-6">
              <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="transparent"
                  className="text-white/20"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 45}`}
                  strokeDashoffset={`${2 * Math.PI * 45 * (1 - getProgressPercentage() / 100)}`}
                  className="text-electric-blue transition-all duration-1000"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl font-bold text-white">
                    {formatTime(timeLeft)}
                  </div>
                  <div className="text-sm text-light-gray">
                    {timeLeft === 1 ? 'minute' : 'minutes'} left
                  </div>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center space-x-4">
              {!isRunning ? (
                <button
                  onClick={handleStartSession}
                  className="btn-primary inline-flex items-center space-x-2 px-6 py-3"
                >
                  <Play className="h-5 w-5" />
                  <span>{currentSession ? 'Resume' : 'Start'}</span>
                </button>
              ) : (
                <button
                  onClick={handlePauseSession}
                  className="btn-secondary inline-flex items-center space-x-2 px-6 py-3"
                >
                  <Pause className="h-5 w-5" />
                  <span>Pause</span>
                </button>
              )}
              
              <button
                onClick={handleStopSession}
                className="btn-secondary inline-flex items-center space-x-2 px-4 py-3"
                disabled={!currentSession}
              >
                <Square className="h-4 w-4" />
                <span>Stop</span>
              </button>
              
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="btn-secondary inline-flex items-center space-x-2 px-4 py-3"
                disabled={isRunning}
              >
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </button>
            </div>
          </div>

          {/* Session Info */}
          {currentSession && (
            <div className="border-t border-white/10 pt-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-light-gray">Started:</span>
                  <div className="font-medium text-white">
                    {new Date(currentSession.startTime).toLocaleTimeString()}
                  </div>
                </div>
                <div>
                  <span className="text-light-gray">Distractions:</span>
                  <div className="font-medium text-white">{distractions.length}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="glass-card max-w-2xl mx-auto mb-8"
          >
            <div className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Session Settings</h3>
              
              <div className="space-y-4">
                {/* Session Type */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Session Type
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {Object.entries(sessionTypes).map(([key, type]) => (
                      <button
                        key={key}
                        onClick={() => {
                          setSessionType(key)
                          setDuration(type.defaultDuration)
                          setTimeLeft(type.defaultDuration)
                        }}
                        disabled={isRunning}
                        className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                          sessionType === key
                            ? 'bg-electric-blue/20 border-electric-blue text-electric-blue'
                            : 'bg-white/5 border-white/10 text-light-gray hover:bg-white/10'
                        } ${isRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {type.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="120"
                    value={duration}
                    onChange={(e) => {
                      const newDuration = parseInt(e.target.value) || 1
                      setDuration(newDuration)
                      if (!isRunning) setTimeLeft(newDuration)
                    }}
                    disabled={isRunning}
                    className="w-full max-w-xs px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-electric-blue focus:ring-2 focus:ring-electric-blue/20"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto mb-8">
        <button
          onClick={addDistraction}
          disabled={!isRunning}
          className="glass-card p-6 hover:bg-white/10 transition-colors duration-200 text-center border-l-4 border-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <AlertTriangle className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
          <h3 className="font-semibold text-white">Log Distraction</h3>
          <p className="text-sm text-light-gray">Track interruptions</p>
        </button>

        <div className="glass-card p-6 text-center border-l-4 border-electric-blue">
          <Zap className="h-8 w-8 text-electric-blue mx-auto mb-2" />
          <h3 className="font-semibold text-white">Focus Score</h3>
          <p className="text-sm text-light-gray">
            {distractions.length === 0 ? 'Perfect!' : `${Math.max(0, 100 - distractions.length * 10)}%`}
          </p>
        </div>

        <div className="glass-card p-6 text-center border-l-4 border-green-500">
          <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
          <h3 className="font-semibold text-white">Progress</h3>
          <p className="text-sm text-light-gray">
            {Math.round(getProgressPercentage())}% complete
          </p>
        </div>
      </div>

      {/* Tips */}
      <div className="glass-card max-w-2xl mx-auto bg-electric-blue/10 border-electric-blue/20">
        <div className="p-6">
          <div className="flex items-start space-x-3">
            <Coffee className="h-5 w-5 text-electric-blue mt-0.5" />
            <div>
              <h3 className="font-semibold text-electric-blue mb-1">Focus Tips</h3>
              <ul className="text-sm text-white space-y-1">
                <li>• Turn off notifications on your devices</li>
                <li>• Keep a glass of water nearby</li>
                <li>• Use the distraction log when you feel unfocused</li>
                <li>• Take breaks between sessions</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
