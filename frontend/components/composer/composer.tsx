'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Toolbar } from './toolbar'
import { MediaPanel } from './media-panel'
import { ButtonBuilder } from './button-builder'
import { SchedulePanel } from './schedule-panel'

interface PostData {
  text: string
  media: any
  buttons: any[]
  quote: any
  scheduledAt: any
  pinMessage: boolean
  silentSend: boolean
  protectContent: boolean
  disableLinkPreview: boolean
}

interface ComposerProps {
  postData: PostData
  setPostData: (data: PostData) => void
}

export function Composer({ postData, setPostData }: ComposerProps) {
  const [editorKey, setEditorKey] = useState(0)

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Card className="m-4 rounded-none border-0">
        <div className="p-4">
          <h2 className="text-xl font-bold">Compose Post</h2>
          <p className="text-sm text-muted-foreground">
            Create and send Telegram posts
          </p>
        </div>
      </Card>

      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-4">
          <Card>
            <Toolbar postData={postData} setPostData={setPostData} />
          </Card>

          <Card>
            <textarea
              placeholder="Write your Telegram post here..."
              className="w-full p-4 border-0 rounded-lg resize-none focus:outline-none bg-background text-foreground min-h-48"
              value={postData.text}
              onChange={(e) =>
                setPostData({ ...postData, text: e.target.value })
              }
            />
            <div className="p-4 text-xs text-muted-foreground border-t border-border">
              {postData.text.length} / 4096 characters
            </div>
          </Card>

          <MediaPanel postData={postData} setPostData={setPostData} />
          <ButtonBuilder postData={postData} setPostData={setPostData} />
          <SchedulePanel postData={postData} setPostData={setPostData} />
        </div>
      </div>
    </div>
  )
}
