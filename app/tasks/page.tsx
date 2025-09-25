'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth-store'
import { useProductivityStore } from '@/store/productivity-store'
import { DashboardLayout } from '@/components/dashboard-layout'
import { 
  Plus, 
  CheckCircle, 
  Circle, 
  Clock, 
  Flag, 
  Trash2, 
  Edit2,
  Filter,
  Calendar,
  AlertCircle
} from 'lucide-react'
import { AnimatedGridPattern } from '@/components/magicui/animated-grid-pattern'
import { TypewriterEffect } from '@/components/ui/typewriter-effect'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'

export default function Tasks() {
  const router = useRouter()
  const { isAuthenticated, loading } = useAuthStore()
  const { tasks, addTask, updateTask, deleteTask } = useProductivityStore()
  
  const [showAddTask, setShowAddTask] = useState(false)
  const [editingTask, setEditingTask] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all')
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    estimatedTime: 30,
    completed: false
  })

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/')
    }
  }, [isAuthenticated, loading, router])

  const handleAddTask = () => {
    if (!newTask.title.trim()) {
      toast.error('Task title is required')
      return
    }
    
    addTask(newTask)
    toast.success('Task added successfully')
    setNewTask({
      title: '',
      description: '',
      priority: 'medium',
      estimatedTime: 30,
      completed: false
    })
    setShowAddTask(false)
  }

  const handleToggleComplete = (taskId: string, completed: boolean) => {
    updateTask(taskId, { 
      completed: !completed,
      completedAt: !completed ? new Date().toISOString() : undefined
    })
    toast.success(completed ? 'Task marked as pending' : 'Task completed!')
  }

  const handleDeleteTask = (taskId: string) => {
    deleteTask(taskId)
    toast.success('Task deleted')
  }

  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') return task.completed
    if (filter === 'pending') return !task.completed
    return true
  })

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400 bg-red-400/10 border-red-400/20'
      case 'medium': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20'
      case 'low': return 'text-green-400 bg-green-400/10 border-green-400/20'
      default: return 'text-light-gray bg-white/10 border-white/20'
    }
  }

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
        <div className="relative z-10 flex items-center justify-between mb-8">
          <div>
            <TypewriterEffect
              words={[
                {
                  text: "Tasks",
                  className: "text-4xl font-bold text-white"
                }
              ]}
              className="mb-2"
            />
            <p className="text-light-gray text-lg">Manage your tasks and priorities</p>
          </div>
          <button
            onClick={() => setShowAddTask(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Add Task</span>
          </button>
        </div>

        {/* Filters */}
        <div className="relative z-10 flex items-center space-x-4 mb-8">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg border transition-all ${
              filter === 'all'
                ? 'bg-white/20 border-white text-white'
                : 'bg-white/5 border-white/10 text-light-gray hover:bg-white/10'
            }`}
          >
            All Tasks ({tasks.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-lg border transition-all ${
              filter === 'pending'
                ? 'bg-white/20 border-white text-white'
                : 'bg-white/5 border-white/10 text-light-gray hover:bg-white/10'
            }`}
          >
            Pending ({tasks.filter(t => !t.completed).length})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 rounded-lg border transition-all ${
              filter === 'completed'
                ? 'bg-white/20 border-white text-white'
                : 'bg-white/5 border-white/10 text-light-gray hover:bg-white/10'
            }`}
          >
            Completed ({tasks.filter(t => t.completed).length})
          </button>
        </div>

        {/* Tasks List */}
        <div className="relative z-10 space-y-4">
          <AnimatePresence>
            {filteredTasks.map((task) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`glass-card p-6 transition-all ${
                  task.completed ? 'opacity-60' : ''
                }`}
              >
                <div className="flex items-start space-x-4">
                  <button
                    onClick={() => handleToggleComplete(task.id, task.completed)}
                    className="mt-1"
                  >
                    {task.completed ? (
                      <CheckCircle className="w-6 h-6 text-green-400" />
                    ) : (
                      <Circle className="w-6 h-6 text-white/40 hover:text-white" />
                    )}
                  </button>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className={`text-lg font-semibold text-white ${
                          task.completed ? 'line-through' : ''
                        }`}>
                          {task.title}
                        </h3>
                        {task.description && (
                          <p className="text-light-gray mt-1">{task.description}</p>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                          getPriorityColor(task.priority)
                        }`}>
                          {task.priority}
                        </span>
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="p-2 text-light-gray hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-light-gray">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{task.estimatedTime} min</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(task.createdAt).toLocaleDateString()}</span>
                      </div>
                      {task.completedAt && (
                        <div className="flex items-center space-x-1">
                          <CheckCircle className="w-4 h-4" />
                          <span>Completed {new Date(task.completedAt).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {filteredTasks.length === 0 && (
            <div className="text-center py-12">
              <AlertCircle className="w-16 h-16 text-light-gray mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No tasks found</h3>
              <p className="text-light-gray">
                {filter === 'completed' ? 'No completed tasks yet' : 'Start by adding a new task'}
              </p>
            </div>
          )}
        </div>

        {/* Add Task Modal */}
        <AnimatePresence>
          {showAddTask && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div 
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={() => setShowAddTask(false)}
              />
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="relative z-10 w-full max-w-lg glass-card p-6"
              >
                <h2 className="text-2xl font-bold text-white mb-6">Add New Task</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Title</label>
                    <input
                      type="text"
                      value={newTask.title}
                      onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-light-gray focus:outline-none focus:border-white/30 focus:ring-2 focus:ring-white/20"
                      placeholder="Enter task title"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Description</label>
                    <textarea
                      value={newTask.description}
                      onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-light-gray focus:outline-none focus:border-white/30 focus:ring-2 focus:ring-white/20 h-24 resize-none"
                      placeholder="Enter task description (optional)"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Priority</label>
                    <div className="grid grid-cols-3 gap-3">
                      {(['low', 'medium', 'high'] as const).map((priority) => (
                        <button
                          key={priority}
                          onClick={() => setNewTask({ ...newTask, priority })}
                          className={`p-3 rounded-lg border capitalize transition-all ${
                            newTask.priority === priority
                              ? 'bg-white/20 border-white text-white'
                              : 'bg-white/5 border-white/10 text-light-gray hover:bg-white/10'
                          }`}
                        >
                          {priority}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Estimated Time (minutes)
                    </label>
                    <input
                      type="number"
                      value={newTask.estimatedTime}
                      onChange={(e) => setNewTask({ ...newTask, estimatedTime: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-light-gray focus:outline-none focus:border-white/30 focus:ring-2 focus:ring-white/20"
                      min="1"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => setShowAddTask(false)}
                    className="btn-secondary px-6 py-2"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddTask}
                    className="btn-primary px-6 py-2"
                  >
                    Add Task
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  )
}
