'use client';

import { useState, useEffect, useCallback } from 'react';
import PostEditor from '@/components/post-maker/PostEditor';
import PostPreview from '@/components/post-maker/PostPreview';
import MediaPanel from '@/components/post-maker/MediaPanel';
import ButtonBuilder from '@/components/post-maker/ButtonBuilder';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Calendar as CalendarIcon, Clock, Send, Save } from 'lucide-react';
import { format } from 'date-fns';
import api from '@/lib/api';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { Media, InlineButton, Channel, PostTemplate } from '@/types';

export default function Composer() {
  const [content, setContent] = useState('');
  const [media, setMedia] = useState<Media | null>(null);
  const [buttons, setButtons] = useState<InlineButton[][]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);
  const [scheduledAt, setScheduledAt] = useState<Date | undefined>(new Date());
  const [silentSend, setSilentSend] = useState(false);
  const [pinMessage, setPinMessage] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchChannels = useCallback(async () => {
    try {
      const res = await api.get('/api/channels');
      setChannels(res.data);
    } catch (err) {
      console.error('Failed to fetch channels');
    }
  }, []);

  useEffect(() => {
    fetchChannels();

    // Check for template load
    const savedTpl = localStorage.getItem('tpl_draft');
    if (savedTpl) {
      try {
        const tpl: PostTemplate = JSON.parse(savedTpl);
        setContent(tpl.message || '');
        setMedia(tpl.media || null);
        setButtons(tpl.replyMarkup?.inline_keyboard || []);
        if (tpl.settings) {
          setSilentSend(tpl.settings.silentSend || false);
          setPinMessage(tpl.settings.pinMessage || false);
        }
        toast.info(`Loaded template: ${tpl.name}`);
        localStorage.removeItem('tpl_draft');
      } catch (e) {
        console.error('Failed to parse template');
      }
    }
  }, [fetchChannels]);

  const handleSend = async (immediate = true) => {
    if (selectedChannels.length === 0) {
      toast.error('Select at least one channel');
      return;
    }
    setLoading(true);
    try {
      const payload = {
        targets: selectedChannels,
        message: content,
        media,
        replyMarkup: buttons.length > 0 ? { inline_keyboard: buttons } : undefined,
        silentSend,
        pinMessage,
        scheduledAt: immediate ? new Date() : scheduledAt,
      };

      if (immediate) {
        await api.post('/api/posts/send', payload);
        toast.success('Sent successfully!');
      } else {
        await api.post('/api/posts/schedule', payload);
        toast.success('Scheduled successfully!');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Action failed';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTemplate = async () => {
    const name = window.prompt('Enter template name');
    if (!name) return;

    try {
      await api.post('/api/templates', {
        name,
        message: content,
        replyMarkup: buttons.length > 0 ? { inline_keyboard: buttons } : undefined,
        media,
        settings: { silentSend, pinMessage }
      });
      toast.success('Template saved!');
    } catch (err) {
      toast.error('Failed to save template');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">
      <div className="lg:col-span-6 space-y-6">
        <Card>
          <CardContent className="pt-6 space-y-6">
            <div className="space-y-2">
              <Label>Target Channels</Label>
              <div className="flex flex-wrap gap-2">
                {channels.map(ch => (
                  <Badge
                    key={ch._id}
                    variant={selectedChannels.includes(ch.channelId) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => {
                      setSelectedChannels(prev =>
                        prev.includes(ch.channelId)
                          ? prev.filter(id => id !== ch.channelId)
                          : [...prev, ch.channelId]
                      );
                    }}
                  >
                    {ch.channelTitle}
                  </Badge>
                ))}
                {channels.length === 0 && <span className="text-xs text-gray-500">No channels added yet. Go to Settings.</span>}
              </div>
            </div>

            <div className="space-y-1">
              <PostEditor content={content} onChange={setContent} />
              <div className="flex items-center gap-2 px-1">
                <Progress
                  value={(content.length / 4096) * 100}
                  className={cn(
                    "h-1.5 flex-1",
                    content.length > 3800 ? "[&>div]:bg-red-500" : content.length > 3200 ? "[&>div]:bg-amber-500" : ""
                  )}
                />
                <span className={cn(
                  "text-[10px] font-mono",
                  content.length > 4096 ? "text-red-500 font-bold" : "text-gray-400"
                )}>
                  {content.length}/4096
                </span>
              </div>
            </div>

            <MediaPanel selectedMedia={media} onSelect={setMedia} />

            <ButtonBuilder rows={buttons} onChange={setButtons} />

            <div className="flex flex-wrap gap-6 pt-4 border-t">
              <div className="flex items-center space-x-2">
                <Switch id="silent" checked={silentSend} onCheckedChange={setSilentSend} />
                <Label htmlFor="silent">Silent</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="pin" checked={pinMessage} onCheckedChange={setPinMessage} />
                <Label htmlFor="pin">Pin</Label>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-4 space-y-6">
        <PostPreview content={content} media={media} buttons={buttons} />

        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-2">
              <Label>Schedule</Label>
              <Popover>
                <PopoverTrigger>
                  <Button variant="outline" className="w-full justify-start text-left font-normal" type="button">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {scheduledAt ? format(scheduledAt, 'PPP p') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={scheduledAt} onSelect={setScheduledAt} />
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button className="w-full" onClick={() => handleSend(true)} disabled={loading} type="button">
                <Send className="mr-2 h-4 w-4" /> Send Now
              </Button>
              <Button variant="outline" className="w-full" onClick={() => handleSend(false)} disabled={loading} type="button">
                <Clock className="mr-2 h-4 w-4" /> Schedule
              </Button>
            </div>
            <Button variant="secondary" className="w-full" onClick={handleSaveTemplate} type="button">
              <Save className="mr-2 h-4 w-4" /> Save Template
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
