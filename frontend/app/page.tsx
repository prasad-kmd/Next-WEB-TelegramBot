'use client'

import { useState } from 'react'
import { Composer } from '@/components/composer/composer'
import { Preview } from '@/components/preview/preview'

export default function Home() {
  const [postData, setPostData] = useState({
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

  return (
    <div className="flex min-h-screen bg-background">
      <div className="w-3/5 border-r border-border">
        <Composer postData={postData} setPostData={setPostData} />
      </div>
      <div className="w-2/5 bg-card p-6">
        <Preview postData={postData} />
      </div>
    </div>
  )
}
