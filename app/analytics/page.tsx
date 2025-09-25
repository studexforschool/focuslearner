'use client'

import { useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth-store'
import { useProductivityStore } from '@/store/productivity-store'
import { DashboardLayout } from '@/components/dashboard-layout'
import { 
  BarChart3,
  TrendingUp,
  Clock,
  Target,
  Calendar,
  Activity,
  Award,
  Zap,
  Brain
} from 'lucide-react'
import { AnimatedGridPattern } from '@/components/magicui/animated-grid-pattern'
import { TypewriterEffect } from '@/components/ui/typewriter-effect'
import { motion } from 'framer-motion'

export default function Analytics() {
  const router = useRouter()
  const { isAuthenticated, loading } = useAuthStore()
  const { sessions, tasks, stats } = useProductivityStore()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/')
    }
  }, [isAuthenticated, loading, router])

  // Calculate analytics data
  const analyticsData = useMemo(() => {
    const now = new Date()
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    // Monthly data
    const monthlySessions = sessions.filter(s => 
      new Date(s.startTime) >= last30Days && s.completed
    )
    const monthlyTasks = tasks.filter(t => 
      t.completedAt && new Date(t.completedAt) >= last30Days
    )

    // Weekly data
    const weeklySessions = sessions.filter(s => 
      new Date(s.startTime) >= last7Days && s.completed
    )
    const weeklyTasks = tasks.filter(t => 
      t.completedAt && new Date(t.completedAt) >= last7Days
    )

    // Daily breakdown for chart
    const dailyData = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate())
      const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000)
      
      const daySessionsCount = sessions.filter(s => {
        const sessionDate = new Date(s.startTime)
        return sessionDate >= dayStart && sessionDate < dayEnd && s.completed
      }).length

      const dayTasksCount = tasks.filter(t => {
        if (!t.completedAt) return false
        const taskDate = new Date(t.completedAt)
        return taskDate >= dayStart && taskDate < dayEnd
      }).length

      const dayFocusTime = sessions
        .filter(s => {
          const sessionDate = new Date(s.startTime)
          return sessionDate >= dayStart && sessionDate < dayEnd && s.completed
        })
        .reduce((acc, s) => acc + s.duration, 0)
      
      dailyData.push({
        date: date.toLocaleDateString('en-US', { weekday: 'short' }),
        sessions: daySessionsCount,
        tasks: dayTasksCount,
        focusTime: dayFocusTime
      })
    }

    // Productivity score
    const productivityScore = Math.round(
      (stats.completionRate * 0.5) + 
      (Math.min(monthlySessions.length / 30, 1) * 30) +
      (Math.min(monthlyTasks.length / 50, 1) * 20)
    )

    // Best day
    const bestDay = dailyData.reduce((best, day) => 
      day.focusTime > best.focusTime ? day : best
    , dailyData[0])

    return {
      totalFocusTime: sessions.filter(s => s.completed).reduce((acc, s) => acc + s.duration, 0),
      totalSessions: sessions.filter(s => s.completed).length,
      totalTasks: tasks.filter(t => t.completed).length,
      avgSessionLength: Math.round(
        sessions.filter(s => s.completed).reduce((acc, s) => acc + s.duration, 0) / 
        Math.max(sessions.filter(s => s.completed).length, 1)
      ),
      monthlySessions: monthlySessions.length,
      monthlyTasks: monthlyTasks.length,
      weeklySessions: weeklySessions.length,
      weeklyTasks: weeklyTasks.length,
      dailyData,
      productivityScore,
      bestDay,
      completionRate: stats.completionRate
    }
  }, [sessions, tasks, stats])

  if (loading) {
    return (
      <div className="min-h-screen bg-pure-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  const maxFocusTime = Math.max(...analyticsData.dailyData.map(d => d.focusTime), 1)
  const maxSessions = Math.max(...analyticsData.dailyData.map(d => d.sessions), 1)
  const maxTasks = Math.max(...analyticsData.dailyData.map(d => d.tasks), 1)

  return (
    <DashboardLayout>
      <div className="main-content relative">
        {/* Animated Grid Background */}
        <AnimatedGridPattern
          numSquares={20}
          maxOpacity={0.05}
          duration={4}
          repeatDelay={1}
          className="absolute inset-0"
        />
        
        {/* Header */}
        <div className="relative z-10 mb-8">
          <TypewriterEffect
            words={[
              {
                text: "Analytics",
                className: "text-4xl font-bold text-white"
              }
            ]}
            className="mb-2"
          />
          <p className="text-light-gray text-lg">Track your productivity and progress</p>
        </div>

        {/* Productivity Score */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 glass-card p-8 mb-8 text-center"
        >
          <div className="flex items-center justify-center mb-4">
            <Brain className="w-8 h-8 text-white mr-3" />
            <h2 className="text-2xl font-bold text-white">Productivity Score</h2>
          </div>
          <div className="text-6xl font-bold text-white mb-2">{analyticsData.productivityScore}</div>
          <div className="text-light-gray">Out of 100</div>
          <div className="w-full max-w-md mx-auto mt-4">
            <div className="bg-white/10 rounded-full h-4 overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${analyticsData.productivityScore}%` }}
                transition={{ duration: 1, delay: 0.5 }}
                className="bg-white h-full rounded-full"
              />
            </div>
          </div>
        </motion.div>

        {/* Key Metrics */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6 text-center"
          >
            <Clock className="w-8 h-8 text-white mx-auto mb-3" />
            <div className="text-3xl font-bold text-white mb-1">{analyticsData.totalFocusTime}m</div>
            <div className="text-sm text-light-gray">Total Focus Time</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-6 text-center"
          >
            <Activity className="w-8 h-8 text-white mx-auto mb-3" />
            <div className="text-3xl font-bold text-white mb-1">{analyticsData.totalSessions}</div>
            <div className="text-sm text-light-gray">Completed Sessions</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-6 text-center"
          >
            <Target className="w-8 h-8 text-white mx-auto mb-3" />
            <div className="text-3xl font-bold text-white mb-1">{analyticsData.totalTasks}</div>
            <div className="text-sm text-light-gray">Tasks Completed</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="glass-card p-6 text-center"
          >
            <TrendingUp className="w-8 h-8 text-white mx-auto mb-3" />
            <div className="text-3xl font-bold text-white mb-1">{analyticsData.completionRate}%</div>
            <div className="text-sm text-light-gray">Success Rate</div>
          </motion.div>
        </div>

        {/* Charts Section */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Focus Time Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-card p-6"
          >
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Daily Focus Time
            </h3>
            <div className="space-y-4">
              {analyticsData.dailyData.map((day, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="w-12 text-sm text-light-gray">{day.date}</div>
                  <div className="flex-1">
                    <div className="bg-white/10 rounded-full h-3 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(day.focusTime / maxFocusTime) * 100}%` }}
                        transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                        className="bg-white h-full rounded-full"
                      />
                    </div>
                  </div>
                  <div className="w-16 text-sm text-white text-right">{day.focusTime}m</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Sessions & Tasks Chart */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-card p-6"
          >
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Daily Activity
            </h3>
            <div className="space-y-4">
              {analyticsData.dailyData.map((day, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-light-gray">{day.date}</span>
                    <div className="flex items-center space-x-4">
                      <span className="text-white">{day.sessions} sessions</span>
                      <span className="text-white">{day.tasks} tasks</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <div className="flex-1">
                      <div className="bg-white/10 rounded-full h-2 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(day.sessions / maxSessions) * 100}%` }}
                          transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                          className="bg-white/60 h-full rounded-full"
                        />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="bg-white/10 rounded-full h-2 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(day.tasks / maxTasks) * 100}%` }}
                          transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                          className="bg-white h-full rounded-full"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Period Comparison */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="glass-card p-6"
          >
            <div className="flex items-center mb-4">
              <Calendar className="w-5 h-5 text-white mr-2" />
              <h3 className="text-lg font-semibold text-white">This Week</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-light-gray">Sessions</span>
                <span className="text-white font-semibold">{analyticsData.weeklySessions}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-light-gray">Tasks</span>
                <span className="text-white font-semibold">{analyticsData.weeklyTasks}</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="glass-card p-6"
          >
            <div className="flex items-center mb-4">
              <Award className="w-5 h-5 text-white mr-2" />
              <h3 className="text-lg font-semibold text-white">This Month</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-light-gray">Sessions</span>
                <span className="text-white font-semibold">{analyticsData.monthlySessions}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-light-gray">Tasks</span>
                <span className="text-white font-semibold">{analyticsData.monthlyTasks}</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="glass-card p-6"
          >
            <div className="flex items-center mb-4">
              <Zap className="w-5 h-5 text-white mr-2" />
              <h3 className="text-lg font-semibold text-white">Best Day</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-light-gray">Date</span>
                <span className="text-white font-semibold">{analyticsData.bestDay.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-light-gray">Focus Time</span>
                <span className="text-white font-semibold">{analyticsData.bestDay.focusTime}m</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Insights */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="relative z-10 glass-card p-8 text-center"
        >
          <h3 className="text-2xl font-bold text-white mb-4">Key Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-xl font-bold text-white mb-2">
                {analyticsData.avgSessionLength} minutes
              </div>
              <p className="text-light-gray">Average session length</p>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-white mb-2">
                {Math.round(analyticsData.totalFocusTime / 60)} hours
              </div>
              <p className="text-light-gray">Total hours focused</p>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-white mb-2">
                {analyticsData.completionRate}%
              </div>
              <p className="text-light-gray">Task completion rate</p>
            </div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}
