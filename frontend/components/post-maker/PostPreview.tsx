'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileIcon, ImageIcon, VideoIcon } from 'lucide-react';
import { Media, InlineButton } from '@/types';

interface Props {
  content: string;
  media?: Media | null;
  buttons?: InlineButton[][];
}

export default function PostPreview({ content, media, buttons }: Props) {
  return (
    <div className="flex flex-col gap-4 max-w-[400px] mx-auto w-full">
      <div className="text-sm font-semibold text-gray-500 uppercase tracking-wider px-2">Telegram Preview</div>
      <Card className="bg-[#212121] text-white rounded-2xl overflow-hidden border-none shadow-xl">
        {media && (
          <div className="relative aspect-video bg-black/20 flex items-center justify-center border-b border-white/10">
            {media.file_type === 'photo' && <ImageIcon className="text-white/20" size={48} />}
            {media.file_type === 'video' && <VideoIcon className="text-white/20" size={48} />}
            {!['photo', 'video'].includes(media.file_type) && <FileIcon className="text-white/20" size={48} />}
            <Badge className="absolute top-2 right-2 bg-black/50 border-none">{media.file_type}</Badge>
          </div>
        )}
        <div className="p-3">
          <div
            className="text-[15px] leading-relaxed break-words tg-post-content prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>

        {buttons && buttons.length > 0 && (
          <div className="px-3 pb-3 flex flex-col gap-1">
            {buttons.map((row, i) => (
              <div key={i} className="flex gap-1">
                {row.map((btn, j) => (
                  <div
                    key={j}
                    className="flex-1 bg-white/10 hover:bg-white/15 py-1.5 px-2 rounded-lg text-center text-[14px] font-medium cursor-default"
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
  );
}
