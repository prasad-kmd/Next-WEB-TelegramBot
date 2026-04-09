import express from 'express'
import { Template } from '../models/Template.js'
import { verifyAuthToken } from '../middleware/auth.js'

const router = express.Router()

// Get templates
router.get('/', verifyAuthToken, async (req, res) => {
  try {
    const templates = await Template.find({ userId: req.userId })
    res.json(templates)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Create template
router.post('/', verifyAuthToken, async (req, res) => {
  try {
    const { name, message, replyMarkup, media, settings } = req.body

    if (!name || !message) {
      return res.status(400).json({ error: 'Name and message required' })
    }

    const template = new Template({
      userId: req.userId,
      name,
      message,
      replyMarkup,
      media,
      settings,
    })

    await template.save()

    res.json({
      success: true,
      template,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Delete template
router.delete('/:id', verifyAuthToken, async (req, res) => {
  try {
    const template = await Template.findById(req.params.id)

    if (!template || template.userId !== req.userId) {
      return res.status(404).json({ error: 'Template not found' })
    }

    await Template.deleteOne({ _id: req.params.id })

    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router
