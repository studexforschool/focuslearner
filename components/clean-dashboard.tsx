'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { 
  BarChart3, 
  Clock, 
  Target, 
  Zap, 
  CheckCircle, 
  Brain, 
  Activity,
  TrendingUp,
  Play,
  Plus
} from 'lucide-react'
import { useProductivityStore } from '@/store/productivity-store'
import { AnimatedGridPattern } from '@/components/magicui/animated-grid-pattern'
import { TypewriterEffect } from '@/components/ui/typewriter-effect'

export function CleanDashboard() {
  const { stats, sessions, tasks, currentSession } = useProductivityStore()
  
  // Calculate dashboard metrics
  const dashboardData = useMemo(() => {
    const today = new Date().toDateString()
    
    const completedToday = tasks.filter(task => {
      if (!task.completedAt) return false
      return new Date(task.completedAt).toDateString() === today
    }).length

    const focusTimeToday = sessions
      .filter(session => {
        return new Date(session.startTime).toDateString() === today && session.completed
      })
      .reduce((total, session) => total + session.duration, 0)

    const pendingTasks = tasks.filter(task => !task.completed).slice(0, 5)
    
    const weeklyData = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate())
      const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000)
      
      const dayFocusTime = sessions
        .filter(s => {
          const sessionDate = new Date(s.startTime)
          return sessionDate >= dayStart && sessionDate < dayEnd && s.completed
        })
        .reduce((acc, s) => acc + s.duration, 0)
      
      weeklyData.push({
        date: date.toLocaleDateString('en-US', { weekday: 'short' }),
        focusTime: dayFocusTime
      })
    }

    return {
      completedToday,
      focusTimeToday,
      totalSessions: stats.totalSessions || 0,
      successRate: stats.completionRate || 0,
      pendingTasks,
      weeklyData
    }
  }, [sessions, tasks, stats])

  const maxFocusTime = Math.max(...dashboardData.weeklyData.map(d => d.focusTime), 1)

  return (
    <div className="main-content relative">
      {/* Animated Grid Background */}
      <AnimatedGridPattern
        numSquares={30}
        maxOpacity={0.1}
        duration={3}
        repeatDelay={1}
        className="inset-x-0 inset-y-[-30%] h-[200%] skew-y-12"
      />
      
      {/* Header */}
      <div className="relative z-10 mb-8">
        <TypewriterEffect
          words={[
            {
              text: "Dashboard",
              className: "text-4xl font-bold text-white"
            }
          ]}
          className="mb-2"
        />
        <p className="text-light-gray text-lg">Welcome back! Here's your productivity overview.</p>
      </div>

      {/* Stats Overview */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="glass-card p-6 text-center">
          <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Clock className="w-6 h-6 text-white" />
          </div>
          <div className="text-3xl font-bold text-white mb-1">{dashboardData.focusTimeToday}m</div>
          <div className="text-sm text-light-gray">Focus Time Today</div>
        </div>

        <div className="glass-card p-6 text-center">
          <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-6 h-6 text-white" />
          </div>
          <div className="text-3xl font-bold text-white mb-1">{dashboardData.completedToday}</div>
          <div className="text-sm text-light-gray">Tasks Completed</div>
        </div>

        <div className="glass-card p-6 text-center">
          <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div className="text-3xl font-bold text-white mb-1">{dashboardData.totalSessions}</div>
          <div className="text-sm text-light-gray">Total Sessions</div>
        </div>

        <div className="glass-card p-6 text-center">
          <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div className="text-3xl font-bold text-white mb-1">{dashboardData.successRate}%</div>
          <div className="text-sm text-light-gray">Success Rate</div>
        </div>
      </div>

      {/* Current Session */}
      {currentSession && (
        <div className="relative z-10 glass-card p-6 mb-8 border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">Focus Session Active</h3>
              <p className="text-light-gray">{currentSession.duration} minutes • {currentSession.type}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
              <Link href="/focus" className="btn-primary">
                View Session
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Quick Actions */}
        <div className="glass-card p-6">
          <div className="flex items-center mb-6">
            <Zap className="w-6 h-6 text-white mr-3" />
            <h3 className="text-xl font-semibold text-white">Quick Actions</h3>
          </div>
          <div className="space-y-4">
            <Link href="/focus" className="block w-full btn-primary text-center py-3">
              <Play className="w-5 h-5 inline mr-2" />
              Start Focus Session
            </Link>
            <Link href="/tasks" className="block w-full btn-secondary text-center py-3">
              <Plus className="w-5 h-5 inline mr-2" />
              Add New Task
            </Link>
            <Link href="/analytics" className="block w-full btn-secondary text-center py-3">
              <Brain className="w-5 h-5 inline mr-2" />
              View Analytics
            </Link>
          </div>
        </div>

        {/* Pending Tasks */}
        <div className="glass-card p-6">
          <div className="flex items-center mb-6">
            <Target className="w-6 h-6 text-white mr-3" />
            <h3 className="text-xl font-semibold text-white">Pending Tasks</h3>
          </div>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {dashboardData.pendingTasks.length > 0 ? (
              dashboardData.pendingTasks.map((task, index) => (
                <div key={task.id || index} className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-white mb-1">{task.title}</p>
                      <p className="text-sm text-light-gray">{task.estimatedTime || 30} minutes</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      task.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                      task.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-green-500/20 text-green-400'
                    }`}>
                      {task.priority || 'low'}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-light-gray mx-auto mb-3" />
                <p className="text-light-gray">No pending tasks</p>
                <p className="text-sm text-light-gray/70">Great job staying on top of things!</p>
              </div>
            )}
          </div>
        </div>

        {/* Weekly Progress */}
        <div className="glass-card p-6">
          <div className="flex items-center mb-6">
            <Activity className="w-6 h-6 text-white mr-3" />
            <h3 className="text-xl font-semibold text-white">Weekly Progress</h3>
          </div>
          <div className="space-y-4">
            {dashboardData.weeklyData.map((day, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="w-10 text-sm font-medium text-light-gray">
                  {day.date}
                </div>
                <div className="flex-1">
                  <div className="bg-white/10 rounded-full h-3 relative overflow-hidden">
                    <div
                      className="bg-white h-full rounded-full transition-all duration-500"
                      style={{ width: `${(day.focusTime / maxFocusTime) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="w-12 text-sm font-medium text-white text-right">
                  {day.focusTime}m
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Focus Insights */}
      <div className="relative z-10 glass-card p-8">
        <div className="text-center">
          <Brain className="w-16 h-16 text-white mx-auto mb-4" />
          <h3 className="text-2xl font-semibold text-white mb-2">Focus Insights</h3>
          <p className="text-light-gray mb-6">
            You've completed {sessions.filter(s => s.completed).length} focus sessions with an average of{' '}
            {Math.round(sessions.filter(s => s.completed).reduce((acc, s) => acc + s.duration, 0) / Math.max(sessions.filter(s => s.completed).length, 1))} minutes per session.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">
                {sessions.filter(s => s.completed).length}
              </div>
              <div className="text-sm text-light-gray">Completed Sessions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">
                {Math.round(sessions.filter(s => s.completed).reduce((acc, s) => acc + s.duration, 0) / Math.max(sessions.filter(s => s.completed).length, 1))}m
              </div>
              <div className="text-sm text-light-gray">Average Session</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">
                {sessions.filter(s => s.completed).reduce((acc, s) => acc + s.duration, 0)}m
              </div>
              <div className="text-sm text-light-gray">Total Focus Time</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
