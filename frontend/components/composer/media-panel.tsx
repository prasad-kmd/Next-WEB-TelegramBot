'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface MediaPanelProps {
  postData: any
  setPostData: (data: any) => void
}

export function MediaPanel({ postData, setPostData }: MediaPanelProps) {
  const [isLoading, setIsLoading] = useState(false)

  const attachPendingMedia = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/media/pending`,
        {
          credentials: 'include',
        }
      )
      const data = await response.json()
      if (data) {
        setPostData({
          ...postData,
          media: data,
        })
      }
    } catch (error) {
      console.error('Failed to attach media:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <div className="p-4 border-b border-border">
        <h3 className="font-semibold">Media</h3>
      </div>
      <div className="p-4 space-y-4">
        {postData.media && (
          <div className="p-3 bg-accent/10 rounded-lg">
            <p className="text-sm font-medium">{postData.media.file_type}</p>
            <p className="text-xs text-muted-foreground">
              {postData.media.file_name || 'Media attached'}
            </p>
            <Button
              size="sm"
              variant="destructive"
              className="mt-2"
              onClick={() => setPostData({ ...postData, media: null })}
            >
              Remove
            </Button>
          </div>
        )}
        {!postData.media && (
          <div className="space-y-3 p-3 bg-muted/20 rounded-lg text-center">
            <p className="text-sm text-muted-foreground">
              Forward any file to the bot in Telegram
            </p>
            <Button
              size="sm"
              onClick={attachPendingMedia}
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : 'Attach from Telegram'}
            </Button>
          </div>
        )}
      </div>
    </Card>
  )
}
