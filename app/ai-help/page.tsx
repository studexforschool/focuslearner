'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth-store'
import { DashboardLayout } from '@/components/dashboard-layout'
import { 
  Send, 
  Bot, 
  User,
  Sparkles,
  Copy,
  Check,
  ChevronDown,
  Brain,
  Zap,
  Code,
  FileText,
  Lightbulb,
  AlertCircle
} from 'lucide-react'
import { AnimatedGridPattern } from '@/components/magicui/animated-grid-pattern'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import OpenAI from 'openai'

const AVAILABLE_MODELS = [
  { id: 'gpt-4-turbo-preview', name: 'GPT-4 Turbo', description: 'Most capable, best for complex tasks' },
  { id: 'gpt-4', name: 'GPT-4', description: 'Advanced reasoning and creativity' },
  { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', description: 'Fast and efficient for most tasks' },
  { id: 'gpt-3.5-turbo-16k', name: 'GPT-3.5 Turbo 16K', description: 'Extended context window' },
]

interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
}

export default function AIHelp() {
  const router = useRouter()
  const { isAuthenticated, loading } = useAuthStore()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedModel, setSelectedModel] = useState(AVAILABLE_MODELS[2].id)
  const [showModelSelector, setShowModelSelector] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [openai, setOpenai] = useState<OpenAI | null>(null)

  useEffect(() => {
    // Initialize OpenAI with your API key from environment variables
    const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY
    
    if (apiKey) {
      const client = new OpenAI({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true
      })
      setOpenai(client)
    } else {
      toast.error('OpenAI API key not found')
    }
  }, [])

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/')
    }
  }, [isAuthenticated, loading, router])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading || !openai) {
      if (!openai) {
        toast.error('OpenAI not initialized. Please refresh the page.')
      }
      return
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    const currentInput = input
    setInput('')
    setIsLoading(true)

    try {
      const completion = await openai.chat.completions.create({
        model: selectedModel,
        messages: [
          { 
            role: 'system', 
            content: 'You are a helpful AI assistant focused on productivity, coding, and learning. Be concise but thorough. Use clear formatting with headers (##), bullet points (-), and code blocks (```). Always be helpful and encouraging.' 
          },
          ...messages.map(m => ({ role: m.role as 'user' | 'assistant', content: m.content })),
          { role: 'user', content: currentInput }
        ],
        temperature: 0.7,
        max_tokens: 1500,
      })

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: completion.choices[0].message.content || 'Sorry, I could not generate a response.',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
      toast.success('AI response received!')
    } catch (error) {
      console.error('OpenAI API Error:', error)
      toast.error('Failed to get AI response. Please check your API key or try again.')
      
      // Add error message to chat
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error while processing your request. Please try again or check if the API key is valid.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopyMessage = (content: string, id: string) => {
    navigator.clipboard.writeText(content)
    setCopiedId(id)
    toast.success('Copied to clipboard')
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-pure-black dark:bg-pure-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white dark:border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  const selectedModelInfo = AVAILABLE_MODELS.find(m => m.id === selectedModel)

  return (
    <DashboardLayout>
      <div className="main-content relative flex flex-col h-[calc(100vh-4rem)]">
        {/* Animated Grid Background */}
        <AnimatedGridPattern
          numSquares={20}
          maxOpacity={0.05}
          duration={4}
          repeatDelay={1}
          className="absolute inset-0"
        />
        
        {/* Header */}
        <div className="relative z-10 flex items-center justify-between mb-6 px-2">
          <div>
            <h1 className="text-4xl font-bold text-white dark:text-white mb-2">AI Assistant</h1>
            <p className="text-light-gray dark:text-light-gray text-lg">Get help with productivity, coding, and more</p>
          </div>
          
          {/* Model Selector */}
          <div className="relative">
            <button
              onClick={() => setShowModelSelector(!showModelSelector)}
              className="flex items-center space-x-2 px-4 py-2 bg-white/10 dark:bg-white/10 rounded-lg hover:bg-white/20 dark:hover:bg-white/20 transition-colors"
            >
              <Brain className="w-5 h-5 text-white dark:text-white" />
              <span className="text-white dark:text-white">{selectedModelInfo?.name}</span>
              <ChevronDown className="w-4 h-4 text-white dark:text-white" />
            </button>
            
            <AnimatePresence>
              {showModelSelector && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-72 glass-card dark:glass-card p-4 z-50"
                >
                  <h3 className="text-sm font-semibold text-white dark:text-white mb-3">Select Model</h3>
                  <div className="space-y-2">
                    {AVAILABLE_MODELS.map(model => (
                      <button
                        key={model.id}
                        onClick={() => {
                          setSelectedModel(model.id)
                          setShowModelSelector(false)
                        }}
                        className={`w-full text-left p-3 rounded-lg transition-colors ${
                          selectedModel === model.id
                            ? 'bg-white/20 dark:bg-white/20 text-white dark:text-white'
                            : 'hover:bg-white/10 dark:hover:bg-white/10 text-light-gray dark:text-light-gray'
                        }`}
                      >
                        <div className="font-medium">{model.name}</div>
                        <div className="text-xs opacity-70">{model.description}</div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Chat Container */}
        <div className="relative z-10 flex-1 glass-card dark:glass-card overflow-hidden flex flex-col">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-12">
                <Bot className="w-16 h-16 text-white/30 dark:text-white/30 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white dark:text-white mb-2">Start a Conversation</h3>
                <p className="text-light-gray dark:text-light-gray mb-8">Ask me anything about productivity, coding, or learning!</p>
                
                {/* Quick Prompts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                  {[
                    { icon: Code, prompt: 'Help me write a React component', color: 'bg-blue-500/20' },
                    { icon: Lightbulb, prompt: 'Give me productivity tips', color: 'bg-yellow-500/20' },
                    { icon: FileText, prompt: 'Explain a complex concept', color: 'bg-green-500/20' },
                    { icon: Zap, prompt: 'Optimize my code', color: 'bg-purple-500/20' }
                  ].map((item, index) => (
                    <button
                      key={index}
                      onClick={() => setInput(item.prompt)}
                      className={`${item.color} border border-white/10 dark:border-white/10 rounded-lg p-4 hover:bg-white/10 dark:hover:bg-white/10 transition-colors text-left`}
                    >
                      <item.icon className="w-5 h-5 text-white dark:text-white mb-2" />
                      <p className="text-sm text-white dark:text-white">{item.prompt}</p>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-3xl ${message.role === 'user' ? 'order-2' : 'order-1'}`}>
                      <div className="flex items-start space-x-3">
                        {message.role === 'assistant' && (
                          <div className="w-8 h-8 bg-white/10 dark:bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Bot className="w-5 h-5 text-white dark:text-white" />
                          </div>
                        )}
                        <div className={`flex-1 ${message.role === 'user' ? 'bg-white/10 dark:bg-white/10' : 'bg-white/5 dark:bg-white/5'} rounded-lg p-4`}>
                          <div className="text-white dark:text-white whitespace-pre-wrap">
                            {message.content}
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-light-gray/50 dark:text-light-gray/50">
                              {message.timestamp.toLocaleTimeString()}
                            </span>
                            <button
                              onClick={() => handleCopyMessage(message.content, message.id)}
                              className="p-1 hover:bg-white/10 dark:hover:bg-white/10 rounded transition-colors"
                            >
                              {copiedId === message.id ? (
                                <Check className="w-4 h-4 text-green-400" />
                              ) : (
                                <Copy className="w-4 h-4 text-light-gray dark:text-light-gray" />
                              )}
                            </button>
                          </div>
                        </div>
                        {message.role === 'user' && (
                          <div className="w-8 h-8 bg-white/10 dark:bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                            <User className="w-5 h-5 text-white dark:text-white" />
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-white/10 dark:bg-white/10 rounded-lg flex items-center justify-center">
                        <Bot className="w-5 h-5 text-white dark:text-white" />
                      </div>
                      <div className="bg-white/5 dark:bg-white/5 rounded-lg p-4">
                        <div className="flex space-x-2">
                          <div className="w-2 h-2 bg-white dark:bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                          <div className="w-2 h-2 bg-white dark:bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                          <div className="w-2 h-2 bg-white dark:bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-white/10 dark:border-white/10 p-4">
            <div className="flex items-end space-x-4">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything..."
                className="flex-1 px-4 py-3 bg-white/5 dark:bg-white/5 border border-white/10 dark:border-white/10 rounded-lg text-white dark:text-white placeholder-light-gray dark:placeholder-light-gray focus:outline-none focus:border-white/30 dark:focus:border-white/30 focus:ring-2 focus:ring-white/20 dark:focus:ring-white/20 resize-none"
                rows={2}
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading || !input.trim()}
                className="p-3 bg-white dark:bg-white hover:bg-white/90 dark:hover:bg-white/90 disabled:bg-white/20 dark:disabled:bg-white/20 text-black dark:text-black disabled:text-white/50 dark:disabled:text-white/50 rounded-lg transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-light-gray/50 dark:text-light-gray/50 mt-2">
              Press Enter to send, Shift+Enter for new line • Powered by {selectedModelInfo?.name}
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
