'use client'

import { useState } from 'react'
import { 
  Brain, 
  MessageSquare, 
  Settings, 
  Plus,
  History,
  ChevronDown,
  Upload,
  Volume2,
  FileText,
  Trash2
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface ChatHistory {
  id: string
  title: string
  timestamp: Date
}

interface AISidebarProps {
  selectedModel: string
  onModelChange: (model: string) => void
  chatHistory: ChatHistory[]
  currentChatId: string | null
  onNewChat: () => void
  onSelectChat: (chatId: string) => void
  onDeleteChat: (chatId: string) => void
  isMobile?: boolean
}

export function AISidebar({
  selectedModel,
  onModelChange,
  chatHistory,
  currentChatId,
  onNewChat,
  onSelectChat,
  onDeleteChat,
  isMobile = false
}: AISidebarProps) {
  const [showModelDropdown, setShowModelDropdown] = useState(false)

  const models = [
    { id: 'gpt-4-turbo-preview', name: 'GPT-4 Turbo', description: 'Most capable' },
    { id: 'gpt-4', name: 'GPT-4', description: 'Advanced reasoning' },
    { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', description: 'Fast & efficient' },
  ]

  const currentModel = models.find(m => m.id === selectedModel) || models[2]

  return (
    <div className={cn(
      "w-full sm:w-80 h-full flex flex-col",
      isMobile ? "bg-transparent" : "bg-white/5 border-r border-white/10"
    )}>
      {/* Header */}
      <div className="p-3 sm:p-4 md:p-6 border-b border-white/10">
        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
          <div className="w-8 sm:w-10 h-8 sm:h-10 bg-white/10 rounded-lg sm:rounded-xl flex items-center justify-center">
            <Brain className="w-4 sm:w-5 h-4 sm:h-5 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-base sm:text-lg font-semibold text-white truncate">AI Assistant</h2>
            <p className="text-xs text-light-gray">Powered by OpenAI</p>
          </div>
        </div>

        {/* New Chat Button */}
        <button
          onClick={onNewChat}
          className="w-full bg-white/10 hover:bg-white/20 active:bg-white/30 text-white rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 flex items-center justify-center gap-2 transition-colors text-sm sm:text-base"
        >
          <Plus className="w-4 h-4" />
          <span>New Chat</span>
        </button>
      </div>

      {/* Model Selector */}
      <div className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 border-b border-white/10">
        <div className="text-xs text-light-gray mb-2 font-medium">MODEL</div>
        <div className="relative">
          <button
            onClick={() => setShowModelDropdown(!showModelDropdown)}
            className="w-full bg-white/5 hover:bg-white/10 active:bg-white/15 text-white rounded-lg px-3 py-2.5 flex items-center justify-between transition-colors min-h-[44px]"
          >
            <div className="text-left min-w-0 flex-1">
              <div className="text-sm font-medium truncate">{currentModel.name}</div>
              <div className="text-xs text-light-gray truncate">{currentModel.description}</div>
            </div>
            <ChevronDown className={cn(
              "w-4 h-4 transition-transform flex-shrink-0 ml-2",
              showModelDropdown && "rotate-180"
            )} />
          </button>

          {showModelDropdown && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-pure-black border border-white/20 rounded-lg overflow-hidden z-50 shadow-xl">
              {models.map((model) => (
                <button
                  key={model.id}
                  onClick={() => {
                    onModelChange(model.id)
                    setShowModelDropdown(false)
                  }}
                  className={cn(
                    "w-full px-3 py-3 text-left hover:bg-white/10 active:bg-white/15 transition-colors min-h-[44px]",
                    selectedModel === model.id && "bg-white/10"
                  )}
                >
                  <div className="text-sm font-medium text-white truncate">{model.name}</div>
                  <div className="text-xs text-light-gray truncate">{model.description}</div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Features */}
      <div className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 border-b border-white/10">
        <div className="text-xs text-light-gray mb-3 font-medium">FEATURES</div>
        <div className="space-y-2.5">
          <div className="flex items-center gap-3 text-sm min-h-[32px]">
            <Upload className="w-4 h-4 text-light-gray flex-shrink-0" />
            <span className="text-white truncate">File Upload Support</span>
          </div>
          <div className="flex items-center gap-3 text-sm min-h-[32px]">
            <Volume2 className="w-4 h-4 text-light-gray flex-shrink-0" />
            <span className="text-white truncate">Text to Speech</span>
          </div>
          <div className="flex items-center gap-3 text-sm min-h-[32px]">
            <FileText className="w-4 h-4 text-light-gray flex-shrink-0" />
            <span className="text-white truncate">Document Analysis</span>
          </div>
        </div>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto px-3 sm:px-4 md:px-6 py-3 sm:py-4">
        <div className="text-xs text-light-gray mb-3 flex items-center gap-2 font-medium">
          <History className="w-3 h-3 flex-shrink-0" />
          <span>CHAT HISTORY</span>
        </div>
        <div className="space-y-1">
          {chatHistory.length === 0 ? (
            <div className="text-sm text-light-gray py-6 text-center">
              No chat history yet
            </div>
          ) : (
            chatHistory.map((chat) => (
              <div
                key={chat.id}
                className={cn(
                  "group flex items-center justify-between rounded-lg px-3 py-2.5 hover:bg-white/10 active:bg-white/15 cursor-pointer transition-colors min-h-[48px]",
                  currentChatId === chat.id && "bg-white/10"
                )}
                onClick={() => onSelectChat(chat.id)}
              >
                <div className="flex-1 min-w-0 pr-2">
                  <div className="text-sm text-white truncate font-medium">{chat.title}</div>
                  <div className="text-xs text-light-gray truncate">
                    {chat.timestamp.toLocaleDateString()}
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onDeleteChat(chat.id)
                  }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-white/10 rounded flex-shrink-0"
                >
                  <Trash2 className="w-3 h-3 text-light-gray hover:text-white" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Settings */}
      <div className="p-3 sm:p-4 border-t border-white/10">
        <button className="w-full flex items-center gap-3 text-sm text-light-gray hover:text-white active:text-white transition-colors px-3 py-2.5 hover:bg-white/5 active:bg-white/10 rounded-lg min-h-[44px]">
          <Settings className="w-4 h-4 flex-shrink-0" />
          <span>Settings</span>
        </button>
      </div>
    </div>
  )
}
