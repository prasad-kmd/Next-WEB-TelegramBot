'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PostEditor from '@/components/post-maker/PostEditor';
import PostPreview from '@/components/post-maker/PostPreview';
import MediaPanel from '@/components/post-maker/MediaPanel';
import ButtonBuilder from '@/components/post-maker/ButtonBuilder';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Calendar as CalendarIcon,
  Clock,
  Send,
  Save,
  Settings2,
  Check,
  Plus,
  Copy
} from 'lucide-react';
import { format } from 'date-fns';
import api from '@/lib/api';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

export default function Composer() {
  const { data: session } = useSession();
  const [content, setContent] = useState('');
  const [media, setMedia] = useState<any>(null);
  const [buttons, setButtons] = useState<any[][]>([]);
  const [channels, setChannels] = useState<any[]>([]);
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);
  const [scheduledAt, setScheduledAt] = useState<Date | undefined>(new Date());
  const [silentSend, setSilentSend] = useState(false);
  const [pinMessage, setPinMessage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    api.get('/api/channels').then(res => setChannels(res.data)).catch(() => {});
  }, []);

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

      const headers = { 'x-user-email': session?.user?.email };

      if (immediate) {
        await api.post('/api/posts/send', payload, { headers });
        toast.success('Sent successfully!');
      } else {
        await api.post('/api/posts/schedule', payload, { headers });
        toast.success('Scheduled successfully!');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Action failed');
    } finally {
      setLoading(false);
    }
  };

  const copyRawHtml = () => {
    navigator.clipboard.writeText(content);
    toast.success('HTML copied to clipboard');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-12">
      <div className="lg:col-span-7 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Content</CardTitle>
            <CardDescription>Draft your message and add media</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Target Channels</Label>
              <div className="relative">
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger >
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="w-full justify-between"
                    >
                      {selectedChannels.length > 0
                        ? `${selectedChannels.length} channel(s) selected`
                        : "Select channels..."}
                      <Plus className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[400px] p-0">
                    <Command>
                      <CommandInput placeholder="Search channels..." />
                      <CommandList>
                        <CommandEmpty>No channel found.</CommandEmpty>
                        <CommandGroup>
                          {channels.map((ch) => (
                            <CommandItem
                              key={ch.channelId}
                              value={ch.channelTitle}
                              onSelect={() => {
                                setSelectedChannels(prev =>
                                  prev.includes(ch.channelId)
                                    ? prev.filter(id => id !== ch.channelId)
                                    : [...prev, ch.channelId]
                                );
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  selectedChannels.includes(ch.channelId) ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {ch.channelTitle}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedChannels.map(id => {
                  const ch = channels.find(c => c.channelId === id);
                  return (
                    <Badge key={id} variant="secondary" className="pl-2 pr-1 gap-1">
                      {ch?.channelTitle || id}
                      <button onClick={() => setSelectedChannels(prev => prev.filter(p => p !== id))} className="rounded-full hover:bg-muted p-0.5">
                        <Plus className="rotate-45 h-3 w-3" />
                      </button>
                    </Badge>
                  );
                })}
              </div>
            </div>

            <PostEditor content={content} onChange={setContent} />

            <MediaPanel selectedMedia={media} onSelect={setMedia} />

            <ButtonBuilder rows={buttons} onChange={setButtons} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Settings2 size={18} /> Options
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-8">
            <div className="flex items-center space-x-2">
              <Switch id="silent" checked={silentSend} onCheckedChange={setSilentSend} />
              <Label htmlFor="silent" className="cursor-pointer">Silent Notification</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="pin" checked={pinMessage} onCheckedChange={setPinMessage} />
              <Label htmlFor="pin" className="cursor-pointer">Pin Message</Label>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-5 space-y-6">
        <Tabs defaultValue="preview" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="raw">Raw HTML</TabsTrigger>
          </TabsList>
          <TabsContent value="preview" className="mt-4">
            <PostPreview content={content} media={media} buttons={buttons} />
          </TabsContent>
          <TabsContent value="raw" className="mt-4">
            <Card>
              <CardContent className="pt-6">
                <div className="relative">
                  <pre className="bg-muted p-4 rounded-md text-xs font-mono overflow-auto max-h-[400px]">
                    {content}
                  </pre>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute top-2 right-2"
                    onClick={copyRawHtml}
                  >
                    <Copy size={16} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card className="border-blue-100 bg-blue-50/30 dark:border-blue-900/30 dark:bg-blue-900/10">
          <CardHeader>
            <CardTitle className="text-lg">Publish</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Scheduled Time</Label>
              <Popover>
                <PopoverTrigger >
                  <Button variant="outline" className="w-full justify-start text-left font-normal bg-background">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {scheduledAt ? format(scheduledAt, 'PPP p') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={scheduledAt} onSelect={setScheduledAt} />
                  <div className="p-3 border-t">
                    <Input
                      type="time"
                      onChange={(e) => {
                        if (scheduledAt) {
                          const [hours, minutes] = e.target.value.split(':').map(Number);
                          const newDate = new Date(scheduledAt);
                          newDate.setHours(hours, minutes);
                          setScheduledAt(newDate);
                        }
                      }}
                    />
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <Button
                className="w-full h-11 bg-blue-600 hover:bg-blue-700 shadow-md"
                onClick={() => handleSend(true)}
                disabled={loading}
              >
                {loading ? <Clock className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                Send Now
              </Button>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  className="w-full h-11"
                  onClick={() => handleSend(false)}
                  disabled={loading}
                >
                  Schedule
                </Button>
                <Button variant="secondary" className="w-full h-11">
                  <Save className="mr-2 h-4 w-4" /> Save
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
