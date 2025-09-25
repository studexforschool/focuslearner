import OpenAI from 'openai'

// Function to create OpenAI client - only initialize when needed
export const createOpenAIClient = () => {
  return new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || '',
    dangerouslyAllowBrowser: true // Required for client-side usage
  })
}

export const AVAILABLE_MODELS = [
  { id: 'gpt-4-turbo-preview', name: 'GPT-4 Turbo', description: 'Most capable, best for complex tasks' },
  { id: 'gpt-4', name: 'GPT-4', description: 'Advanced reasoning and creativity' },
  { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', description: 'Fast and efficient for most tasks' },
  { id: 'gpt-3.5-turbo-16k', name: 'GPT-3.5 Turbo 16K', description: 'Extended context window' },
]

export interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
}
