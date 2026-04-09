'use client'

import { Button } from '@/components/ui/button'

interface ToolbarProps {
  postData: any
  setPostData: (data: any) => void
}

export function Toolbar({ postData, setPostData }: ToolbarProps) {
  const formatText = (before: string, after: string = '') => {
    const textarea = document.querySelector('textarea')
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = postData.text.substring(start, end)
    const newText =
      postData.text.substring(0, start) +
      before +
      selectedText +
      after +
      postData.text.substring(end)

    setPostData({ ...postData, text: newText })
  }

  return (
    <div className="flex flex-wrap gap-2 p-4 border-b border-border">
      <Button
        size="sm"
        variant="outline"
        onClick={() => formatText('<b>', '</b>')}
        title="Bold"
      >
        B
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={() => formatText('<i>', '</i>')}
        title="Italic"
      >
        I
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={() => formatText('<u>', '</u>')}
        title="Underline"
      >
        U
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={() => formatText('<s>', '</s>')}
        title="Strikethrough"
      >
        S
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={() => formatText('<code>', '</code>')}
        title="Inline Code"
      >
        Code
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={() => formatText('<pre>', '</pre>')}
        title="Code Block"
      >
        Block
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={() => formatText('<tg-spoiler>', '</tg-spoiler>')}
        title="Spoiler"
      >
        Spoiler
      </Button>
    </div>
  )
}
