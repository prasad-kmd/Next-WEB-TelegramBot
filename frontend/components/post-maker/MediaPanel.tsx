'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Paperclip, RefreshCw, X } from 'lucide-react';
import api from '@/lib/api';
import { Media } from '@/types';

interface Props {
  selectedMedia: Media | null;
  onSelect: (media: Media | null) => void;
}

export default function MediaPanel({ selectedMedia, onSelect }: Props) {
  const [loading, setLoading] = useState(false);
  const [pending, setPending] = useState<Media | null>(null);

  const fetchPending = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/media/pending');
      setPending(res.data);
    } catch (err) {
      setPending(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Media Attachment</label>
        <Button variant="ghost" size="sm" onClick={fetchPending} disabled={loading} type="button">
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          <span className="ml-2">Poll Media</span>
        </Button>
      </div>

      {!selectedMedia ? (
        <Card className="border-dashed border-2">
          <CardContent className="flex flex-col items-center justify-center py-6 text-center space-y-2">
            <Paperclip className="text-gray-400" />
            <div className="text-sm text-gray-600">
              Forward a file to the bot and click &quot;Poll Media&quot;
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="bg-white">{selectedMedia.file_type}</Badge>
              <div className="text-sm font-medium truncate max-w-[150px]">
                {selectedMedia.file_name || selectedMedia.file_id}
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={() => onSelect(null)} type="button">
              <X size={16} />
            </Button>
          </CardContent>
        </Card>
      )}

      {pending && !selectedMedia && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="flex items-center justify-between py-3">
            <div className="text-xs">
              <span className="font-bold">New Media Detected:</span> {pending.file_type}
            </div>
            <Button size="sm" className="h-7" onClick={() => onSelect(pending)} type="button">Attach</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
