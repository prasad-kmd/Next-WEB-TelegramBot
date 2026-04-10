'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Paperclip, RefreshCw, X, Check, ArrowRight } from 'lucide-react';
import api from '@/lib/api';
import { cn } from '@/lib/utils';

interface Media {
  file_id: string;
  file_type: string;
  file_name?: string;
  thumb_file_id?: string;
}

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
    <div className="space-y-4 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
           <Paperclip size={14} className="text-muted-foreground" />
           <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground google-sans">Media Management</span>
        </div>
        <Button variant="ghost" size="sm" onClick={fetchPending} disabled={loading} className="h-8 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-primary/10 hover:text-primary">
          <RefreshCw size={12} className={cn("mr-2", loading ? 'animate-spin' : '')} />
          Poll Media
        </Button>
      </div>

      {!selectedMedia ? (
        <div
          className="group cursor-pointer flex flex-col items-center justify-center py-8 px-4 rounded-2xl border-2 border-dashed border-border/50 bg-muted/20 hover:bg-muted/30 hover:border-primary/30 transition-all text-center"
          onClick={fetchPending}
        >
          <div className="h-12 w-12 rounded-2xl bg-muted/50 flex items-center justify-center text-muted-foreground mb-4 group-hover:scale-110 group-hover:bg-primary/10 group-hover:text-primary transition-all">
             <Paperclip size={24} />
          </div>
          <p className="text-sm font-bold google-sans mb-1">No media attached</p>
          <p className="text-xs text-muted-foreground google-sans max-w-[200px]">
            Forward a file to the bot and click poll to detect and attach.
          </p>
        </div>
      ) : (
        <Card className="rounded-2xl border-primary/20 bg-primary/5 overflow-hidden border-2">
          <CardContent className="flex items-center justify-between py-4 px-6">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary font-bold text-[10px] uppercase">
                {selectedMedia.file_type.substring(0, 3)}
              </div>
              <div className="space-y-0.5">
                 <Badge variant="outline" className="text-[8px] uppercase font-bold tracking-widest px-2 py-0 h-4 border-primary/30 text-primary rounded-full">{selectedMedia.file_type}</Badge>
                 <div className="text-sm font-bold truncate max-w-[200px] google-sans">
                    {selectedMedia.file_name || "Attachment " + selectedMedia.file_id.substring(0, 8)}
                 </div>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => onSelect(null)} className="h-10 w-10 rounded-xl hover:bg-destructive/10 hover:text-destructive transition-colors">
              <X size={18} />
            </Button>
          </CardContent>
        </Card>
      )}

      {pending && !selectedMedia && (
        <div className="flex items-center justify-between p-4 rounded-2xl border border-green-500/20 bg-green-500/5 animate-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-3">
             <div className="h-8 w-8 rounded-lg bg-green-500/20 flex items-center justify-center text-green-600">
                <Check size={18} />
             </div>
             <div className="google-sans">
               <p className="text-xs font-bold text-green-600 uppercase tracking-widest">New Media Detected</p>
               <p className="text-xs text-green-600/70">{pending.file_type}: {pending.file_name || pending.file_id.substring(0, 8)}</p>
             </div>
          </div>
          <Button size="sm" className="h-9 rounded-xl bg-green-600 hover:bg-green-700 text-[10px] font-bold uppercase tracking-widest px-4" onClick={() => onSelect(pending)}>
            Attach <ArrowRight size={12} className="ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
}
