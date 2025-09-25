'use client'

import { useState, useRef, useEffect } from 'react'
import { MarkdownRenderer } from '@/components/ui/markdown-renderer'
import { PlaceholdersAndVanishInput } from '@/components/ui/placeholders-and-vanish-input'
import { Brain, User, Loader2, Paperclip, Volume2, VolumeX } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  attachments?: File[]
}

interface AIChatProps {
  className?: string
  selectedModel?: string
  chatId?: string
}

export function AIChat({ className, selectedModel = 'gpt-3.5-turbo', chatId }: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! How can I help you today? I can assist with productivity tips, learning strategies, task management, and more.',
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [attachedFiles, setAttachedFiles] = useState<File[]>([])
  const [isSpeaking, setIsSpeaking] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const speechSynthesis = typeof window !== 'undefined' ? window.speechSynthesis : null

  const handleSend = async (inputValue?: string) => {
    const messageContent = inputValue || input
    if (!messageContent.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageContent,
      timestamp: new Date(),
      attachments: attachedFiles.length > 0 ? [...attachedFiles] : undefined
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setAttachedFiles([])
    setIsLoading(true)

    try {
      // Call actual AI API with model selection
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: messageContent,
          model: selectedModel,
          hasAttachments: attachedFiles.length > 0
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get AI response')
      }

      const data = await response.json()
      
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response || 'Sorry, I could not process your request.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiResponse])
    } catch (error) {
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I am currently unavailable. Please try again later.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorResponse])
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    handleSend()
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      setAttachedFiles(Array.from(files))
    }
  }

  const handleTextToSpeech = (text: string) => {
    if (!speechSynthesis) return

    if (isSpeaking) {
      speechSynthesis.cancel()
      setIsSpeaking(false)
    } else {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.onend = () => setIsSpeaking(false)
      speechSynthesis.speak(utterance)
      setIsSpeaking(true)
    }
  }

  useEffect(() => {
    return () => {
      if (speechSynthesis) {
        speechSynthesis.cancel()
      }
    }
  }, [])

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-4 sm:space-y-6 min-h-0">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              'flex gap-3',
              message.role === 'user' ? 'justify-end' : 'justify-start'
            )}
          >
            {message.role === 'assistant' && (
              <div className="w-7 sm:w-8 h-7 sm:h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <Brain className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-white" />
              </div>
            )}
            
            <div
              className={cn(
                'max-w-[90%] sm:max-w-[85%] md:max-w-[80%] rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3',
                message.role === 'user'
                  ? 'bg-white/20 text-white ml-6 sm:ml-8 md:ml-12'
                  : 'bg-white/5 dark:bg-white/5 light:bg-black/5 border border-white/10 dark:border-white/10 light:border-black/10'
              )}
            >
              {message.role === 'user' ? (
                <div>
                  <p className="text-white">{message.content}</p>
                  {message.attachments && message.attachments.length > 0 && (
                    <div className="mt-2 text-xs text-light-gray">
                      {message.attachments.map(file => file.name).join(', ')}
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <div className="markdown-ai-response">
                    <MarkdownRenderer 
                      content={message.content}
                      className="text-sm"
                    />
                  </div>
                  <button
                    onClick={() => handleTextToSpeech(message.content)}
                    className="mt-2 p-1.5 sm:p-2 bg-white/10 hover:bg-white/20 active:bg-white/30 rounded-lg transition-colors min-h-[32px] min-w-[32px] flex items-center justify-center"
                    title={isSpeaking ? "Stop speaking" : "Read aloud"}
                  >
                    {isSpeaking ? <VolumeX className="w-3 h-3 text-white" /> : <Volume2 className="w-3 h-3 text-white" />}
                  </button>
                </div>
              )}
              
              <div className="text-xs opacity-60 mt-2">
                {message.timestamp.toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </div>
            </div>

            {message.role === 'user' && (
              <div className="w-7 sm:w-8 h-7 sm:h-8 bg-white/10 dark:bg-white/10 light:bg-black/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <User className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-white dark:text-white light:text-black" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="w-7 sm:w-8 h-7 sm:h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <Brain className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-white" />
            </div>
            <div className="bg-white/5 dark:bg-white/5 light:bg-black/5 border border-white/10 dark:border-white/10 light:border-black/10 rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span className="text-sm text-light-gray dark:text-light-gray light:text-gray-600">
                  AI is thinking...
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-white/10 dark:border-white/10 light:border-black/10 p-3 md:p-4">
        {attachedFiles.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-2">
            {attachedFiles.map((file, index) => (
              <div key={index} className="bg-white/10 rounded-lg px-2 md:px-3 py-1 text-xs md:text-sm text-white flex items-center gap-2">
                <Paperclip className="w-3 h-3" />
                <span className="truncate max-w-[120px] md:max-w-none">{file.name}</span>
                <button
                  onClick={() => setAttachedFiles(attachedFiles.filter((_, i) => i !== index))}
                  className="text-light-gray hover:text-white"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="flex items-center gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors flex-shrink-0"
            title="Attach file"
          >
            <Paperclip className="w-4 h-4 text-white" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
          <div className="flex-1 min-w-0">
            <PlaceholdersAndVanishInput
              placeholders={[
                "How can I improve my focus?",
                "Best study techniques?",
                "Manage procrastination?",
                "Create a productivity plan",
                "Explain Pomodoro technique",
                "How to set SMART goals?",
                "Time management tips?",
                "Build better habits?",
              ]}
              onChange={handleInputChange}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

