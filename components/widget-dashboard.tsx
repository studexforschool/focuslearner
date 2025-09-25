'use client'

import { useState, useMemo } from 'react'
import { 
  BarChart3, 
  Clock, 
  Target, 
  Zap, 
  CheckCircle, 
  Brain, 
  Settings, 
  Plus,
  X,
  Activity,
  TrendingUp
} from 'lucide-react'
import { useProductivityStore } from '@/store/productivity-store'
import { AnimatedGridPattern } from '@/components/magicui/animated-grid-pattern'

export function WidgetDashboard() {
  const { stats, sessions, tasks, currentSession } = useProductivityStore()
  
  // Widget configuration
  const [widgets, setWidgets] = useState([
    { id: 'stats', type: 'stats', enabled: true },
    { id: 'current-session', type: 'current-session', enabled: true },
    { id: 'quick-actions', type: 'quick-actions', enabled: true },
    { id: 'pending-tasks', type: 'pending-tasks', enabled: true },
    { id: 'productivity-chart', type: 'productivity-chart', enabled: true },
    { id: 'focus-insights', type: 'focus-insights', enabled: true }
  ])

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

  const toggleWidget = (widgetId: string) => {
    setWidgets(prev => prev.map(widget => 
      widget.id === widgetId 
        ? { ...widget, enabled: !widget.enabled }
        : widget
    ))
  }

  const removeWidget = (widgetId: string) => {
    setWidgets(prev => prev.filter(widget => widget.id !== widgetId))
  }

  // Widget Components
  const StatsWidget = () => (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Today's Stats</h3>
        <BarChart3 className="h-5 w-5 text-electric-blue" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-electric-blue">{dashboardData.focusTimeToday}m</div>
          <div className="text-xs text-light-gray">Focus Time</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-electric-blue">{dashboardData.completedToday}</div>
          <div className="text-xs text-light-gray">Tasks Done</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-electric-blue">{dashboardData.totalSessions}</div>
          <div className="text-xs text-light-gray">Total Sessions</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-electric-blue">{dashboardData.successRate}%</div>
          <div className="text-xs text-light-gray">Success Rate</div>
        </div>
      </div>
    </div>
  )

  const CurrentSessionWidget = () => (
    currentSession ? (
      <div className="glass-card p-6 border-electric-blue">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white mb-1">Focus Session Active</h3>
            <p className="text-light-gray">{currentSession.duration} minutes • {currentSession.type}</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-electric-blue rounded-full animate-pulse"></div>
            <a href="/focus" className="btn-primary">
              View Session
            </a>
          </div>
        </div>
      </div>
    ) : null
  )

  const QuickActionsWidget = () => (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Quick Actions</h3>
        <Zap className="h-5 w-5 text-electric-blue" />
      </div>
      <div className="space-y-3">
        <a href="/focus" className="block w-full btn-primary text-center">
          <Clock className="h-4 w-4 inline mr-2" />
          Start Focus Session
        </a>
        <a href="/tasks" className="block w-full btn-secondary text-center">
          <Plus className="h-4 w-4 inline mr-2" />
          Add Task
        </a>
        <a href="/chat" className="block w-full btn-secondary text-center">
          <Brain className="h-4 w-4 inline mr-2" />
          AI Assistant
        </a>
      </div>
    </div>
  )

  const PendingTasksWidget = () => (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Pending Tasks</h3>
        <Target className="h-5 w-5 text-electric-blue" />
      </div>
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {dashboardData.pendingTasks.length > 0 ? (
          dashboardData.pendingTasks.map((task, index) => (
            <div key={task.id || index} className="bg-white/5 border border-white/10 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white">{task.title}</p>
                  <p className="text-xs text-light-gray">{task.estimatedTime || 30} minutes</p>
                </div>
                <div className="px-2 py-1 bg-electric-blue/20 text-electric-blue rounded text-xs font-medium">
                  {task.priority || 'low'}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <CheckCircle className="h-8 w-8 text-light-gray mx-auto mb-2" />
            <p className="text-light-gray text-sm">No pending tasks</p>
          </div>
        )}
      </div>
    </div>
  )

  const ProductivityChartWidget = () => {
    const maxFocusTime = Math.max(...dashboardData.weeklyData.map(d => d.focusTime), 1)
    
    return (
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">7-Day Productivity</h3>
          <Activity className="h-5 w-5 text-electric-blue" />
        </div>
        <div className="space-y-3">
          {dashboardData.weeklyData.map((day, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className="w-8 text-xs font-medium text-light-gray">
                {day.date}
              </div>
              <div className="flex-1">
                <div className="bg-white/10 rounded-full h-2 relative overflow-hidden">
                  <div
                    className="bg-electric-blue h-full rounded-full transition-all duration-500"
                    style={{ width: `${(day.focusTime / maxFocusTime) * 100}%` }}
                  />
                </div>
              </div>
              <div className="w-12 text-xs font-medium text-white text-right">
                {day.focusTime}m
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const FocusInsightsWidget = () => (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Insights</h3>
        <Brain className="h-5 w-5 text-electric-blue" />
      </div>
      <div className="space-y-4">
        <div className="text-center">
          <div className="text-xl font-bold text-electric-blue">
            {sessions.filter(s => s.completed).length}
          </div>
          <div className="text-xs text-light-gray">Completed Sessions</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-electric-blue">
            {Math.round(sessions.filter(s => s.completed).reduce((acc, s) => acc + s.duration, 0) / Math.max(sessions.filter(s => s.completed).length, 1))}m
          </div>
          <div className="text-xs text-light-gray">Avg Session</div>
        </div>
        <a href="/analytics" className="block w-full btn-secondary text-center text-xs">
          <TrendingUp className="h-3 w-3 inline mr-1" />
          View Analytics
        </a>
      </div>
    </div>
  )

  const renderWidget = (widget: any) => {
    if (!widget.enabled) return null

    const widgetComponents: Record<string, JSX.Element> = {
      'stats': <StatsWidget />,
      'current-session': <CurrentSessionWidget />,
      'quick-actions': <QuickActionsWidget />,
      'pending-tasks': <PendingTasksWidget />,
      'productivity-chart': <ProductivityChartWidget />,
      'focus-insights': <FocusInsightsWidget />
    }

    return (
      <div key={widget.id} className="relative group">
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <button
            onClick={() => removeWidget(widget.id)}
            className="p-1 bg-red-500/80 hover:bg-red-500 rounded text-white"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
        {widgetComponents[widget.type]}
      </div>
    )
  }

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
      <div className="flex items-center justify-between mb-8 relative z-10">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-light-gray">Welcome back! Here's your productivity overview.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="btn-secondary">
            <Settings className="h-4 w-4 mr-2" />
            Customize
          </button>
        </div>
      </div>

      {/* Widgets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8 relative z-10">
        {widgets.map(widget => renderWidget(widget))}
      </div>

      {/* Widget Customization Panel */}
      <div className="glass-card p-6 relative z-10">
        <h3 className="text-lg font-semibold text-white mb-4">Available Widgets</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {widgets.map(widget => (
            <button
              key={widget.id}
              onClick={() => toggleWidget(widget.id)}
              className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                widget.enabled
                  ? 'bg-electric-blue/20 border-electric-blue text-electric-blue'
                  : 'bg-white/5 border-white/10 text-light-gray hover:bg-white/10'
              }`}
            >
              <div className="flex items-center justify-center mb-1">
                {widget.type === 'stats' && <BarChart3 className="h-4 w-4" />}
                {widget.type === 'current-session' && <Clock className="h-4 w-4" />}
                {widget.type === 'quick-actions' && <Zap className="h-4 w-4" />}
                {widget.type === 'pending-tasks' && <Target className="h-4 w-4" />}
                {widget.type === 'productivity-chart' && <Activity className="h-4 w-4" />}
                {widget.type === 'focus-insights' && <Brain className="h-4 w-4" />}
              </div>
              <div className="text-xs">
                {widget.type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
