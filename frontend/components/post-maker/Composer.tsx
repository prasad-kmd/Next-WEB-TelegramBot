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
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import {
  Calendar as CalendarIcon,
  Clock,
  Send,
  Save,
  Check,
  Plus,
  Bell,
  BellOff,
  Pin,
  CalendarDays,
  Info,
  Globe,
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
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export default function Composer() {
  const { data: session } = useSession();
  const [content, setContent] = useState('');
  const [media, setMedia] = useState<{ file_id: string; file_type: string; url?: string } | null>(null);
  const [buttons, setButtons] = useState<{ text: string; url?: string; callback_data?: string }[][]>([]);
  const [channels, setChannels] = useState<{ channelId: string; channelTitle: string }[]>([]);
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);
  const [scheduledAt, setScheduledAt] = useState<Date | undefined>(new Date());
  const [silentSend, setSilentSend] = useState(false);
  const [pinMessage, setPinMessage] = useState(false);
  const [linkPreview, setLinkPreview] = useState(true);
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

    const charCount = content.replace(/<[^>]*>/g, '').length;
    if (charCount > charLimit) {
      toast.error(`Message exceeds character limit (${charCount}/${charLimit})`);
      return;
    }

    setLoading(true);
    try {
      const payload: Record<string, any> = {
        targets: selectedChannels,
        message: content,
        media,
        replyMarkup: buttons.length > 0 ? { inline_keyboard: buttons } : undefined,
        silentSend,
        pinMessage,
        linkPreview: media ? false : linkPreview,
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
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      toast.error(error.response?.data?.error || 'Action failed');
    } finally {
      setLoading(false);
    }
  };

  const charLimit = media ? 1024 : 4096;

  // Enforce mutual exclusivity
  useEffect(() => {
    if (media && linkPreview) {
      setLinkPreview(false);
    }
  }, [media, linkPreview]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-32">
      <div className="lg:col-span-7 space-y-8">
        <Card className="rounded-2xl border-border/50 bg-card shadow-sm overflow-hidden">
          <CardHeader className="bg-muted/30 border-b border-border/50">
            <CardTitle className="text-lg mozilla-headline">Post Content</CardTitle>
            <CardDescription className="google-sans">Draft your message and configure media attachments</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8 p-6">
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground google-sans ml-1">Destination Channels</label>
              <div className="relative">
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="w-full justify-between h-12 rounded-xl bg-muted/30 border-border/50 hover:bg-muted/50 transition-all font-medium google-sans"
                    >
                      {selectedChannels.length > 0
                        ? `${selectedChannels.length} channel(s) selected`
                        : "Select destination..."}
                      <Plus className={cn("ml-2 h-4 w-4 shrink-0 transition-transform", open ? "rotate-45" : "")} />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[400px] p-0 rounded-2xl border-border/50 shadow-2xl overflow-hidden" align="start">
                    <Command className="bg-card">
                      <CommandInput placeholder="Search channels..." className="h-12 google-sans" />
                      <CommandList>
                        <CommandEmpty className="py-6 text-center text-sm google-sans text-muted-foreground">No channels found.</CommandEmpty>
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
                              className="py-3 px-4 aria-selected:bg-primary/10 google-sans font-medium"
                            >
                              <div className={cn(
                                "mr-3 h-5 w-5 rounded-md border flex items-center justify-center transition-all",
                                selectedChannels.includes(ch.channelId) ? "bg-primary border-primary text-primary-foreground" : "border-border bg-muted/50"
                              )}>
                                {selectedChannels.includes(ch.channelId) && <Check className="h-3 w-3" />}
                              </div>
                              {ch.channelTitle}
                              <span className="ml-auto text-[10px] font-mono text-muted-foreground">{ch.channelId}</span>
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
                    <Badge key={id} variant="secondary" className="pl-3 pr-2 py-1 gap-2 rounded-lg bg-primary/10 text-primary border-none text-[10px] font-bold uppercase tracking-wider google-sans animate-in zoom-in-95">
                      {ch?.channelTitle || id}
                      <button onClick={() => setSelectedChannels(prev => prev.filter(p => p !== id))} className="rounded-full hover:bg-primary/20 p-0.5">
                        <Plus className="rotate-45 h-3 w-3" />
                      </button>
                    </Badge>
                  );
                })}
              </div>
            </div>

            <div className="space-y-3">
               <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground google-sans ml-1">Message Body</label>
               <PostEditor content={content} onChange={setContent} charLimit={charLimit} />
            </div>

            <div className="space-y-3">
               <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground google-sans ml-1">Media Attachments</label>
               <MediaPanel selectedMedia={media} onSelect={setMedia} />
            </div>

            <div className="space-y-3">
               <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground google-sans ml-1">Interactive Components</label>
               <ButtonBuilder rows={buttons} onChange={setButtons} />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-5 hidden lg:block">
        <div className="sticky top-24 space-y-6">
           <div className="flex items-center gap-2 mb-2 ml-1">
              <div className="h-2 w-2 rounded-full bg-primary" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground google-sans">Live Simulation</span>
           </div>
           <PostPreview content={content} media={media || undefined} buttons={buttons} linkPreview={linkPreview} />

           <Card className="rounded-2xl border-border/50 bg-primary/5 p-6">
              <div className="flex gap-4">
                 <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <Info size={20} />
                 </div>
                 <div className="space-y-1">
                    <p className="text-sm font-bold google-sans">Telegram Protocol Notice</p>
                    <p className="text-xs text-muted-foreground leading-relaxed google-sans">
                      Your message will be formatted according to Telegram&apos;s HTML entities. Media captions are limited to 1024 characters.
                    </p>
                 </div>
              </div>
           </Card>
        </div>
      </div>

      {/* Sticky Bottom Actions Bar */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-bottom-8 duration-500">
         <div className="bg-zinc-950/90 backdrop-blur-xl border border-white/10 rounded-full p-2 shadow-2xl flex items-center gap-1">
            <Tooltip>
               <TooltipTrigger>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "h-12 w-12 rounded-full transition-all",
                      silentSend ? "text-amber-500 bg-amber-500/10" : "text-zinc-400 hover:text-white hover:bg-white/10"
                    )}
                    onClick={() => setSilentSend(!silentSend)}
                  >
                     {silentSend ? <BellOff size={20} /> : <Bell size={20} />}
                  </Button>
               </TooltipTrigger>
               <TooltipContent side="top" className="font-bold">Silent Notification</TooltipContent>
            </Tooltip>

            <Tooltip>
               <TooltipTrigger>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "h-12 w-12 rounded-full transition-all",
                      pinMessage ? "text-blue-500 bg-blue-500/10" : "text-zinc-400 hover:text-white hover:bg-white/10"
                    )}
                    onClick={() => setPinMessage(!pinMessage)}
                  >
                     <Pin size={20} />
                  </Button>
               </TooltipTrigger>
               <TooltipContent side="top" className="font-bold">Pin Message</TooltipContent>
            </Tooltip>

            <Tooltip>
               <TooltipTrigger>
                  <Button
                    variant="ghost"
                    size="icon"
                    disabled={!!media}
                    className={cn(
                      "h-12 w-12 rounded-full transition-all",
                      linkPreview && !media ? "text-emerald-500 bg-emerald-500/10" : "text-zinc-400 hover:text-white hover:bg-white/10",
                      media && "opacity-20 cursor-not-allowed"
                    )}
                    onClick={() => setLinkPreview(!linkPreview)}
                  >
                     <Globe size={20} />
                  </Button>
               </TooltipTrigger>
               <TooltipContent side="top" className="font-bold">
                  {media ? "Link Preview unavailable with media" : "Link Preview"}
               </TooltipContent>
            </Tooltip>

            <div className="h-8 w-px bg-white/10 mx-1" />

            <Popover>
               <Tooltip>
                  <TooltipTrigger>
                     <PopoverTrigger>
                        <Button variant="ghost" size="icon" className="h-12 w-12 rounded-full text-zinc-400 hover:text-white hover:bg-white/10">
                           <CalendarDays size={20} />
                        </Button>
                     </PopoverTrigger>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="font-bold">Schedule Time</TooltipContent>
               </Tooltip>
               <PopoverContent className="w-auto p-0 rounded-2xl border-white/10 bg-zinc-950 shadow-2xl" align="center" sideOffset={16}>
                  <div className="p-4 bg-zinc-900 border-b border-white/5">
                     <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 google-sans">Departure Protocol</p>
                  </div>
                  <Calendar
                    mode="single"
                    selected={scheduledAt}
                    onSelect={setScheduledAt}
                    className="bg-zinc-950 text-white"
                  />
                  <div className="p-4 border-t border-white/5 space-y-3">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 google-sans">Exact Time</label>
                    <Input
                      type="time"
                      className="bg-zinc-900 border-white/10 text-white h-10 rounded-lg"
                      onChange={(e) => {
                        if (scheduledAt) {
                          const [hours, minutes] = e.target.value.split(':').map(Number);
                          const newDate = new Date(scheduledAt);
                          newDate.setHours(hours, minutes);
                          setScheduledAt(newDate);
                        }
                      }}
                    />
                    <div className="flex items-center gap-2 text-primary font-mono text-[10px]">
                       <Clock size={12} />
                       {scheduledAt ? format(scheduledAt, 'PPP p') : "Not set"}
                    </div>
                  </div>
               </PopoverContent>
            </Popover>

            <div className="h-8 w-px bg-white/10 mx-1" />

            <Tooltip>
               <TooltipTrigger>
                  <Button variant="ghost" size="icon" className="h-12 w-12 rounded-full text-zinc-400 hover:text-white hover:bg-white/10">
                     <Save size={20} />
                  </Button>
               </TooltipTrigger>
               <TooltipContent side="top" className="font-bold">Save as Template</TooltipContent>
            </Tooltip>

            <div className="flex gap-2 ml-2 pr-1">
               <Button
                 variant="outline"
                 className="h-12 rounded-full bg-white/5 border-white/10 text-white hover:bg-white/10 px-6 font-bold uppercase tracking-widest text-[10px]"
                 onClick={() => handleSend(false)}
                 disabled={loading}
               >
                 {loading ? <Clock className="mr-2 h-4 w-4 animate-spin" /> : "Schedule"}
               </Button>

               <Button
                 className="h-12 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground px-8 font-bold uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20"
                 onClick={() => handleSend(true)}
                 disabled={loading}
               >
                 {loading ? <Clock className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                 Transmit
               </Button>
            </div>
         </div>
      </div>
    </div>
  );
}
