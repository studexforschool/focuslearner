'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/dashboard-layout'
import { AIChat } from '@/components/ai-chat'
import { AISidebar } from '@/components/ai-sidebar'
import { Menu, X } from 'lucide-react'

interface ChatHistory {
  id: string
  title: string
  timestamp: Date
  messages?: any[]
}

export default function AIAssistantPage() {
  const [selectedModel, setSelectedModel] = useState('gpt-3.5-turbo')
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([])
  const [currentChatId, setCurrentChatId] = useState<string | null>(null)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  // Load chat history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('ai-chat-history')
    if (savedHistory) {
      const parsed = JSON.parse(savedHistory)
      setChatHistory(parsed.map((chat: any) => ({
        ...chat,
        timestamp: new Date(chat.timestamp)
      })))
    }
  }, [])

  // Save chat history to localStorage
  useEffect(() => {
    if (chatHistory.length > 0) {
      localStorage.setItem('ai-chat-history', JSON.stringify(chatHistory))
    }
  }, [chatHistory])

  const handleNewChat = () => {
    const newChat: ChatHistory = {
      id: Date.now().toString(),
      title: 'New Chat',
      timestamp: new Date()
    }
    setChatHistory(prev => [newChat, ...prev])
    setCurrentChatId(newChat.id)
  }

  const handleSelectChat = (chatId: string) => {
    setCurrentChatId(chatId)
  }

  const handleDeleteChat = (chatId: string) => {
    setChatHistory(prev => prev.filter(chat => chat.id !== chatId))
    if (currentChatId === chatId) {
      setCurrentChatId(null)
    }
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-80px)]">
        {/* Header */}
        <div className="bg-white/5 border-b border-white/10 px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-white">FocusAI</h1>
              <p className="text-xs md:text-sm text-light-gray">Your intelligent productivity assistant</p>
            </div>
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
              className="md:hidden p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            >
              {isMobileSidebarOpen ? (
                <X className="w-5 h-5 text-white" />
              ) : (
                <Menu className="w-5 h-5 text-white" />
              )}
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-1 min-h-0 relative">
          {/* Desktop Sidebar */}
          <div className="hidden md:block">
            <AISidebar
              selectedModel={selectedModel}
              onModelChange={setSelectedModel}
              chatHistory={chatHistory}
              currentChatId={currentChatId}
              onNewChat={handleNewChat}
              onSelectChat={handleSelectChat}
              onDeleteChat={handleDeleteChat}
            />
          </div>

          {/* Mobile Sidebar Overlay */}
          {isMobileSidebarOpen && (
            <>
              {/* Backdrop */}
              <div 
                className="md:hidden fixed inset-0 bg-black/80 z-40"
                onClick={() => setIsMobileSidebarOpen(false)}
              />
              {/* Sidebar */}
              <div className="md:hidden fixed left-0 top-0 bottom-0 w-full max-w-sm z-50 bg-pure-black border-r border-white/20">
                <AISidebar
                  selectedModel={selectedModel}
                  onModelChange={setSelectedModel}
                  chatHistory={chatHistory}
                  currentChatId={currentChatId}
                  onNewChat={() => {
                    handleNewChat()
                    setIsMobileSidebarOpen(false)
                  }}
                  onSelectChat={(chatId) => {
                    handleSelectChat(chatId)
                    setIsMobileSidebarOpen(false)
                  }}
                  onDeleteChat={handleDeleteChat}
                  isMobile={true}
                />
              </div>
            </>
          )}

          {/* Main Chat Area */}
          <div className="flex-1 bg-pure-black">
            <AIChat 
              className="h-full" 
              selectedModel={selectedModel}
              chatId={currentChatId || undefined}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
