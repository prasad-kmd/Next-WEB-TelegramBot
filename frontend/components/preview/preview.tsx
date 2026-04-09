'use client'

import { Card } from '@/components/ui/card'

interface PreviewProps {
  postData: any
}

export function Preview({ postData }: PreviewProps) {
  const parseHtml = (html: string) => {
    const div = document.createElement('div')
    div.innerHTML = html
    return div.innerHTML
  }

  return (
    <div className="space-y-4">
      <Card className="bg-slate-900">
        <div className="p-6 space-y-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <div
                className="text-sm text-white rounded-lg bg-slate-800 p-3 break-words"
                dangerouslySetInnerHTML={{
                  __html: postData.text || 'Your post will appear here',
                }}
              />
            </div>
          </div>

          {postData.media && (
            <div className="p-3 bg-slate-800 rounded-lg text-center">
              <p className="text-xs text-slate-400 mb-1">
                [{postData.media.file_type?.toUpperCase()}]
              </p>
              <p className="text-xs text-white">
                {postData.media.file_name || 'Media'}
              </p>
            </div>
          )}

          {postData.buttons.length > 0 && (
            <div className="space-y-2">
              {postData.buttons.map((btn: any, idx: number) => (
                <button
                  key={btn.id}
                  className="w-full px-4 py-2 text-sm text-blue-400 border border-blue-400 rounded-lg hover:bg-blue-400/10 transition"
                >
                  {btn.text}
                </button>
              ))}
            </div>
          )}
        </div>
      </Card>

      <Card>
        <div className="p-4">
          <p className="text-xs text-muted-foreground">
            <strong>Characters:</strong> {postData.text.length} / 4096
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            <strong>Buttons:</strong> {postData.buttons.length}
          </p>
          {postData.scheduledAt && (
            <p className="text-xs text-muted-foreground mt-2">
              <strong>Scheduled for:</strong>{' '}
              {new Date(postData.scheduledAt).toLocaleString()}
            </p>
          )}
        </div>
      </Card>
    </div>
  )
}
