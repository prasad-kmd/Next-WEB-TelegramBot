'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface ButtonBuilderProps {
  postData: any
  setPostData: (data: any) => void
}

export function ButtonBuilder({ postData, setPostData }: ButtonBuilderProps) {
  const [buttonText, setButtonText] = useState('')
  const [buttonUrl, setButtonUrl] = useState('')

  const addButton = () => {
    if (!buttonText.trim()) return

    const newButton = {
      id: Date.now(),
      text: buttonText,
      url: buttonUrl || undefined,
      type: buttonUrl ? 'url' : 'callback',
    }

    setPostData({
      ...postData,
      buttons: [...postData.buttons, newButton],
    })

    setButtonText('')
    setButtonUrl('')
  }

  const removeButton = (id: number) => {
    setPostData({
      ...postData,
      buttons: postData.buttons.filter((btn: any) => btn.id !== id),
    })
  }

  return (
    <Card>
      <div className="p-4 border-b border-border">
        <h3 className="font-semibold">Inline Buttons</h3>
      </div>
      <div className="p-4 space-y-4">
        {postData.buttons.length > 0 && (
          <div className="grid grid-cols-2 gap-2 p-3 bg-muted/20 rounded-lg">
            {postData.buttons.map((btn: any) => (
              <div
                key={btn.id}
                className="flex items-center justify-between p-2 bg-background rounded border border-border"
              >
                <span className="text-sm truncate">{btn.text}</span>
                <button
                  onClick={() => removeButton(btn.id)}
                  className="text-destructive hover:text-destructive/80 text-sm"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="space-y-2">
          <input
            type="text"
            placeholder="Button label"
            value={buttonText}
            onChange={(e) => setButtonText(e.target.value)}
            className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            onKeyPress={(e) => e.key === 'Enter' && addButton()}
          />
          <input
            type="url"
            placeholder="URL (optional)"
            value={buttonUrl}
            onChange={(e) => setButtonUrl(e.target.value)}
            className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            onKeyPress={(e) => e.key === 'Enter' && addButton()}
          />
          <Button onClick={addButton} className="w-full">
            Add Button
          </Button>
        </div>
      </div>
    </Card>
  )
}
