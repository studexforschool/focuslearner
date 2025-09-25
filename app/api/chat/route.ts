import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { message, model = 'gpt-3.5-turbo', hasAttachments } = await request.json()

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    // Validate model
    const allowedModels = ['gpt-4-turbo-preview', 'gpt-4', 'gpt-3.5-turbo']
    const selectedModel = allowedModels.includes(model) ? model : 'gpt-3.5-turbo'

    const completion = await openai.chat.completions.create({
      model: selectedModel,
      messages: [
        {
          role: "system",
          content: "You are a helpful AI assistant for FocusLearner, a productivity app. Provide concise, practical advice about productivity, focus, learning, and time management. Format your responses in markdown when helpful. Keep responses focused and actionable."
        },
        {
          role: "user",
          content: hasAttachments ? `[User has attached files] ${message}` : message
        }
      ],
      max_tokens: selectedModel.includes('gpt-4') ? 1000 : 500,
      temperature: 0.7,
    })

    const response = completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.'

    return NextResponse.json({ response })
  } catch (error) {
    console.error('OpenAI API error:', error)
    return NextResponse.json(
      { error: 'Failed to generate AI response' },
      { status: 500 }
    )
  }
}
