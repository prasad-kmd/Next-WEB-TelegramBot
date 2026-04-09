import express from 'express'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { User } from '../models/User.js'
import { verifyAuthToken } from '../middleware/auth.js'

const router = express.Router()

const BOT_TOKEN = process.env.BOT_TOKEN
const JWT_SECRET = process.env.JWT_SECRET
const AUTH_USERS = process.env.AUTH_USERS
  ? process.env.AUTH_USERS.split(',').map((id) => parseInt(id.trim()))
  : []

// Verify Telegram hash and issue JWT
router.post('/telegram', async (req, res) => {
  const { id, first_name, last_name, username, photo_url, auth_date, hash } =
    req.body

  // Verify hash
  const data_check_string = [
    `id=${id}`,
    `first_name=${first_name}`,
    `last_name=${last_name}`,
    `username=${username}`,
    `photo_url=${photo_url}`,
    `auth_date=${auth_date}`,
  ]
    .sort()
    .join('\n')

  const hmac = crypto
    .createHmac('sha256', crypto.createHash('sha256').update(BOT_TOKEN).digest())
    .update(data_check_string)
    .digest('hex')

  if (hmac !== hash) {
    return res.status(401).json({ error: 'Invalid hash' })
  }

  // Check authorization
  if (AUTH_USERS.length > 0 && !AUTH_USERS.includes(id)) {
    return res.status(403).json({ error: 'User not authorized' })
  }

  // Create or update user
  let user = await User.findOne({ telegramId: id })

  if (!user) {
    user = new User({
      telegramId: id,
      firstName: first_name,
      lastName: last_name,
      username,
      photoUrl: photo_url,
      isAuthorized: true,
    })
  } else {
    user.firstName = first_name
    user.lastName = last_name
    user.username = username
    user.photoUrl = photo_url
    user.isAuthorized = true
    user.lastLogin = new Date()
  }

  await user.save()

  // Issue JWT
  const token = jwt.sign(
    {
      userId: id,
      username,
    },
    JWT_SECRET,
    { expiresIn: '15d' }
  )

  // Set httpOnly cookie
  res.cookie('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
  })

  res.json({
    success: true,
    user: {
      id: user.telegramId,
      username: user.username,
    },
  })
})

// Get current user info
router.get('/me', verifyAuthToken, async (req, res) => {
  const user = await User.findOne({ telegramId: req.userId })

  if (!user) {
    return res.status(404).json({ error: 'User not found' })
  }

  res.json({
    id: user.telegramId,
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
  })
})

// Logout
router.post('/logout', (req, res) => {
  res.clearCookie('auth_token')
  res.json({ success: true })
})

export default router
