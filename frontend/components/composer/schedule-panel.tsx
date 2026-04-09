'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface SchedulePanelProps {
  postData: any
  setPostData: (data: any) => void
}

export function SchedulePanel({ postData, setPostData }: SchedulePanelProps) {
  const [showSchedule, setShowSchedule] = useState(false)
  const [dateTime, setDateTime] = useState('')

  const handleSend = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/send`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            text: postData.text,
            media: postData.media,
            buttons: postData.buttons,
            pinMessage: postData.pinMessage,
            silentSend: postData.silentSend,
            protectContent: postData.protectContent,
            disableLinkPreview: postData.disableLinkPreview,
          }),
        }
      )

      if (response.ok) {
        alert('Post sent successfully!')
        setPostData({
          text: '',
          media: null,
          buttons: [],
          quote: null,
          scheduledAt: null,
          pinMessage: false,
          silentSend: false,
          protectContent: false,
          disableLinkPreview: false,
        })
      }
    } catch (error) {
      console.error('Failed to send post:', error)
      alert('Failed to send post')
    }
  }

  const handleSchedule = async () => {
    if (!dateTime) {
      alert('Please select a date and time')
      return
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/schedule`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            text: postData.text,
            media: postData.media,
            buttons: postData.buttons,
            scheduledAt: new Date(dateTime).toISOString(),
            pinMessage: postData.pinMessage,
            silentSend: postData.silentSend,
            protectContent: postData.protectContent,
            disableLinkPreview: postData.disableLinkPreview,
          }),
        }
      )

      if (response.ok) {
        alert('Post scheduled successfully!')
        setPostData({
          text: '',
          media: null,
          buttons: [],
          quote: null,
          scheduledAt: null,
          pinMessage: false,
          silentSend: false,
          protectContent: false,
          disableLinkPreview: false,
        })
        setShowSchedule(false)
        setDateTime('')
      }
    } catch (error) {
      console.error('Failed to schedule post:', error)
      alert('Failed to schedule post')
    }
  }

  return (
    <Card>
      <div className="p-4 border-b border-border">
        <h3 className="font-semibold">Send & Schedule</h3>
      </div>
      <div className="p-4 space-y-4">
        <div className="flex gap-2">
          <Button onClick={handleSend} className="flex-1">
            Send Now
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowSchedule(!showSchedule)}
            className="flex-1"
          >
            Schedule
          </Button>
        </div>

        {showSchedule && (
          <div className="space-y-2 p-3 bg-muted/20 rounded-lg">
            <input
              type="datetime-local"
              value={dateTime}
              onChange={(e) => setDateTime(e.target.value)}
              className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <Button onClick={handleSchedule} className="w-full">
              Schedule Post
            </Button>
          </div>
        )}

        <div className="space-y-2 p-3 bg-muted/20 rounded-lg">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={postData.pinMessage}
              onChange={(e) =>
                setPostData({ ...postData, pinMessage: e.target.checked })
              }
              className="rounded"
            />
            <span className="text-sm">Pin message</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={postData.silentSend}
              onChange={(e) =>
                setPostData({ ...postData, silentSend: e.target.checked })
              }
              className="rounded"
            />
            <span className="text-sm">Send silently</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={postData.protectContent}
              onChange={(e) =>
                setPostData({ ...postData, protectContent: e.target.checked })
              }
              className="rounded"
            />
            <span className="text-sm">Protect content</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={postData.disableLinkPreview}
              onChange={(e) =>
                setPostData({
                  ...postData,
                  disableLinkPreview: e.target.checked,
                })
              }
              className="rounded"
            />
            <span className="text-sm">Disable link preview</span>
          </label>
        </div>
      </div>
    </Card>
  )
}
