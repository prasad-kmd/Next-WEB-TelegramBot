import express from 'express'
import { OpenAI } from 'openai'
import Anthropic from '@anthropic-ai/sdk'
import { verifyAuthToken } from '../middleware/auth.js'

const router = express.Router()

let aiClient = null
let aiProvider = null

if (process.env.ANTHROPIC_API_KEY) {
  aiClient = new Anthropic()
  aiProvider = 'anthropic'
} else if (process.env.OPENAI_API_KEY) {
  aiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  aiProvider = 'openai'
}

// Helper to call AI
async function callAI(prompt) {
  if (!aiClient) {
    throw new Error('AI not configured')
  }

  if (aiProvider === 'anthropic') {
    const response = await aiClient.messages.create({
      model: 'claude-haiku-3-200k-20250122',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    })
    return response.content[0].text
  } else {
    const response = await aiClient.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1024,
    })
    return response.choices[0].message.content
  }
}

// Improve writing
router.post('/improve', verifyAuthToken, async (req, res) => {
  try {
    const { text } = req.body

    if (!text) {
      return res.status(400).json({ error: 'Text required' })
    }

    const prompt = `Improve the following Telegram post text while keeping it concise and engaging. Only return the improved text without any explanations:

${text}`

    const improved = await callAI(prompt)

    res.json({ improved })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Generate post from brief
router.post('/generate', verifyAuthToken, async (req, res) => {
  try {
    const { brief } = req.body

    if (!brief) {
      return res.status(400).json({ error: 'Brief required' })
    }

    const prompt = `Write a Telegram post based on this brief. Keep it under 4096 characters and engaging. Only return the post text:

${brief}`

    const post = await callAI(prompt)

    res.json({ post })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Translate
router.post('/translate', verifyAuthToken, async (req, res) => {
  try {
    const { text, language } = req.body

    if (!text || !language) {
      return res.status(400).json({ error: 'Text and language required' })
    }

    const prompt = `Translate the following text to ${language}. Only return the translated text:

${text}`

    const translated = await callAI(prompt)

    res.json({ translated })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Suggest buttons
router.post('/suggest-buttons', verifyAuthToken, async (req, res) => {
  try {
    const { text } = req.body

    if (!text) {
      return res.status(400).json({ error: 'Text required' })
    }

    const prompt = `Suggest 3-5 inline button labels and URLs for this Telegram post. Return as JSON array like:
[
  { "label": "Button Text", "url": "https://example.com" },
  ...
]

Only return the JSON array, no other text.

Post:
${text}`

    const response = await callAI(prompt)
    const buttons = JSON.parse(response)

    res.json({ buttons })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router
