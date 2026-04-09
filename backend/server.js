import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import 'express-async-errors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import path from 'path'

import authRoutes from './routes/auth.js'
import botRoutes from './routes/bot.js'
import mediaRoutes from './routes/media.js'
import postsRoutes from './routes/posts.js'
import channelsRoutes from './routes/channels.js'
import templatesRoutes from './routes/templates.js'
import aiRoutes from './routes/ai.js'

import { botHandlers } from './bot/handlers.js'
import { startScheduler } from './scheduler/scheduler.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:3000',
  'http://localhost:3000',
  'http://localhost:3001',
]

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
)

app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))
app.use(cookieParser())

// MongoDB Connection
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log('MongoDB connected')
  } catch (error) {
    console.error('MongoDB connection failed:', error)
    process.exit(1)
  }
}

// Routes
app.use('/auth', authRoutes)
app.use('/api/bot-info', botRoutes)
app.use('/api/media', mediaRoutes)
app.use('/api', postsRoutes)
app.use('/api/channels', channelsRoutes)
app.use('/api/templates', templatesRoutes)

// AI routes (only if API key present)
if (process.env.OPENAI_API_KEY || process.env.ANTHROPIC_API_KEY) {
  app.use('/api/ai', aiRoutes)
}

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() })
})

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  })
})

// Start server
async function start() {
  await connectDB()

  app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`)
  })

  // Initialize bot handlers
  await botHandlers()

  // Start scheduler
  startScheduler()
}

start().catch(console.error)

export default app
