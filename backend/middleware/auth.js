import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET
const AUTH_USERS = process.env.AUTH_USERS
  ? process.env.AUTH_USERS.split(',').map((id) => parseInt(id.trim()))
  : []

export function verifyAuthToken(req, res, next) {
  const token = req.cookies.auth_token

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    
    // Check authorization list if set
    if (AUTH_USERS.length > 0 && !AUTH_USERS.includes(decoded.userId)) {
      return res.status(403).json({ error: 'User not authorized' })
    }

    req.userId = decoded.userId
    req.username = decoded.username
    next()
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' })
  }
}
