'use client';

import React, { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileIcon, ImageIcon, VideoIcon, MoreHorizontal, ExternalLink } from 'lucide-react';

interface Props {
  content: string;
  media?: {
    file_id: string;
    file_type: string;
    url?: string;
  };
  buttons?: any[][];
  linkPreview?: boolean;
}

export default function PostPreview({ content, media, buttons, linkPreview }: Props) {
  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const detectedLink = useMemo(() => {
    if (!content || !linkPreview || media) return null;
    const match = content.match(/href="([^"]+)"/);
    return match ? match[1] : null;
  }, [content, linkPreview, media]);

  return (
    <div className="flex flex-col gap-4 max-w-[420px] mx-auto animate-in fade-in slide-in-from-right-4 duration-700">
      <div className="relative group">
        {/* Telegram Bubble Background Style */}
        <div className="absolute -inset-4 bg-primary/5 rounded-[32px] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <Card className="relative bg-[#1c1c1d] dark:bg-[#1c1c1d] text-white rounded-[22px] overflow-hidden border-none shadow-2xl">
          {media && (
            <div className="relative aspect-square bg-[#121213] flex items-center justify-center overflow-hidden">
               <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary via-transparent to-transparent" />

               {media.file_type === 'photo' && <ImageIcon className="text-white/10" size={64} strokeWidth={1} />}
               {media.file_type === 'video' && <VideoIcon className="text-white/10" size={64} strokeWidth={1} />}
               {!['photo', 'video'].includes(media.file_type) && <FileIcon className="text-white/10" size={64} strokeWidth={1} />}

               <div className="absolute top-4 right-4">
                  <Badge className="bg-black/60 backdrop-blur-md border-white/10 text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">{media.file_type}</Badge>
               </div>
            </div>
          )}

          <div className="p-4 relative min-h-[60px]">
            <div
              className="text-[15px] leading-[1.4] break-words tg-preview-content"
              dangerouslySetInnerHTML={{ __html: content || '<span class="text-white/20 italic">No message content drafted...</span>' }}
            />

            {detectedLink && (
              <div className="mt-3 bg-[#2b2b2d] rounded-xl overflow-hidden border border-white/5 animate-in zoom-in-95 duration-300">
                <div className="p-3 space-y-2">
                   <div className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-widest">
                      <ExternalLink size={10} />
                      Link Preview
                   </div>
                   <div className="space-y-1">
                      <div className="h-4 w-3/4 bg-white/10 rounded" />
                      <div className="h-3 w-full bg-white/5 rounded" />
                      <div className="h-3 w-1/2 bg-white/5 rounded" />
                   </div>
                   <div className="text-[11px] text-white/40 truncate font-mono">
                      {detectedLink}
                   </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-end gap-1.5 mt-2">
               <span className="text-[10px] text-white/40 font-medium">{currentTime}</span>
               <div className="flex">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-primary translate-x-1 opacity-80">
                    <path d="M7 13L10 16L17 9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-primary opacity-80">
                    <path d="M7 13L10 16L17 9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
               </div>
            </div>
          </div>

          {buttons && buttons.length > 0 && (
            <div className="px-2 pb-2 mt-1 flex flex-col gap-1.5">
              {buttons.map((row, i) => (
                <div key={i} className="flex gap-1.5">
                  {row.map((btn, j) => (
                    <div
                      key={j}
                      className="flex-1 bg-[#2b2b2d] hover:bg-[#363638] transition-colors py-2.5 px-3 rounded-[10px] text-center text-[13px] font-medium text-[#4da3ff] cursor-default border border-white/5 shadow-sm"
                    >
                      {btn.text}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <style jsx global>{`
        .tg-preview-content .tg-spoiler {
          background-color: #3e3e3e;
          color: transparent;
          border-radius: 3px;
        }
        .tg-preview-content .tg-code {
          background-color: #2b2b2d;
          color: #e4e4e7;
          font-family: var(--font-jetbrains);
          padding: 0 4px;
          border-radius: 4px;
        }
        .tg-preview-content .tg-link {
          color: #4da3ff;
          text-decoration: none;
        }
        .tg-preview-content blockquote {
          border-left: 3px solid #4da3ff;
          padding-left: 12px;
          margin: 8px 0;
          color: #e4e4e7;
        }
        .tg-preview-content pre {
          background-color: #121213;
          padding: 12px;
          border-radius: 8px;
          font-family: var(--font-jetbrains);
          font-size: 13px;
          margin: 8px 0;
          border: 1px solid rgba(255,255,255,0.05);
        }
      `}</style>
    </div>
  );
}
