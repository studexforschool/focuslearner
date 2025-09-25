import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface Task {
  id: string
  title: string
  description?: string
  completed: boolean
  priority: 'low' | 'medium' | 'high'
  estimatedTime: number
  completedAt?: string
  createdAt: string
}

interface Session {
  id: string
  type: 'pomodoro' | 'shortBreak' | 'longBreak' | 'custom'
  duration: number
  startTime: string
  completed: boolean
  distractions?: any[]
}

interface Stats {
  totalSessions: number
  completionRate: number
  totalFocusTime: number
  averageSessionLength: number
}

interface ProductivityState {
  tasks: Task[]
  sessions: Session[]
  currentSession: Session | null
  stats: Stats
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  deleteTask: (id: string) => void
  startSession: (session: Omit<Session, 'id'>) => void
  completeSession: (id: string) => void
  updateStats: () => void
}

export const useProductivityStore = create<ProductivityState>()(
  persist(
    (set, get) => ({
      tasks: [
        {
          id: '1',
          title: 'Complete project proposal',
          description: 'Write and review the Q4 project proposal',
          completed: false,
          priority: 'high',
          estimatedTime: 60,
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          title: 'Review team feedback',
          completed: false,
          priority: 'medium',
          estimatedTime: 30,
          createdAt: new Date().toISOString()
        },
        {
          id: '3',
          title: 'Update documentation',
          completed: true,
          priority: 'low',
          estimatedTime: 45,
          completedAt: new Date().toISOString(),
          createdAt: new Date(Date.now() - 86400000).toISOString()
        }
      ],
      sessions: [
        {
          id: '1',
          type: 'pomodoro',
          duration: 25,
          startTime: new Date(Date.now() - 3600000).toISOString(),
          completed: true
        },
        {
          id: '2',
          type: 'pomodoro',
          duration: 25,
          startTime: new Date(Date.now() - 7200000).toISOString(),
          completed: true
        }
      ],
      currentSession: null,
      stats: {
        totalSessions: 2,
        completionRate: 85,
        totalFocusTime: 50,
        averageSessionLength: 25
      },

      addTask: (taskData) => {
        const newTask: Task = {
          ...taskData,
          id: Date.now().toString(),
          createdAt: new Date().toISOString()
        }
        set(state => ({
          tasks: [...state.tasks, newTask]
        }))
      },

      updateTask: (id, updates) => {
        set(state => ({
          tasks: state.tasks.map(task =>
            task.id === id ? { ...task, ...updates } : task
          )
        }))
        get().updateStats()
      },

      deleteTask: (id) => {
        set(state => ({
          tasks: state.tasks.filter(task => task.id !== id)
        }))
      },

      startSession: (sessionData) => {
        const newSession: Session = {
          ...sessionData,
          id: Date.now().toString()
        }
        set({ currentSession: newSession })
      },

      completeSession: (id) => {
        set(state => ({
          sessions: [...state.sessions, { ...state.currentSession!, completed: true }],
          currentSession: null
        }))
        get().updateStats()
      },

      updateStats: () => {
        const { sessions, tasks } = get()
        const completedSessions = sessions.filter(s => s.completed)
        const completedTasks = tasks.filter(t => t.completed)
        
        const stats: Stats = {
          totalSessions: completedSessions.length,
          completionRate: tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0,
          totalFocusTime: completedSessions.reduce((acc, s) => acc + s.duration, 0),
          averageSessionLength: completedSessions.length > 0 
            ? Math.round(completedSessions.reduce((acc, s) => acc + s.duration, 0) / completedSessions.length)
            : 0
        }
        
        set({ stats })
      }
    }),
    {
      name: 'productivity-storage',
    }
  )
)
