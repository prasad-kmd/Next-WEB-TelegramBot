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
  Copy,
  Zap,
  Target
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
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-20 font-google-sans">
      <div className="lg:col-span-7 space-y-8">
        {/* Destination Section */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <Card className="overflow-hidden border-primary/10 shadow-lg shadow-primary/5">
            <div className="h-1 bg-gradient-to-r from-primary via-blue-500 to-primary/10" />
            <CardHeader>
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <Target className="text-primary w-5 h-5" /> Targets
              </CardTitle>
              <CardDescription className="font-google-sans">Choose where your post will be broadcasted</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="w-full h-12 justify-between rounded-xl border-dashed hover:border-primary/50 hover:bg-primary/5 transition-all font-google-sans"
                    >
                      {selectedChannels.length > 0
                        ? `${selectedChannels.length} channel(s) selected`
                        : "Select destinations..."}
                      <Plus className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[400px] p-0 rounded-2xl overflow-hidden shadow-2xl border-primary/20">
                    <Command className="font-google-sans">
                      <CommandInput placeholder="Search channels..." className="h-12 border-none focus:ring-0" />
                      <CommandList>
                        <CommandEmpty className="py-6 text-center text-sm text-muted-foreground">No channels found.</CommandEmpty>
                        <CommandGroup>
                          {channels.map((ch) => (
                            <CommandItem
                              key={ch.channelId}
                              value={ch.channelTitle}
                              className="py-3 px-4 aria-selected:bg-primary/10 cursor-pointer transition-colors"
                              onSelect={() => {
                                setSelectedChannels(prev =>
                                  prev.includes(ch.channelId)
                                    ? prev.filter(id => id !== ch.channelId)
                                    : [...prev, ch.channelId]
                                );
                              }}
                            >
                              <div className={cn(
                                "mr-3 flex h-5 w-5 items-center justify-center rounded-md border border-primary transition-all",
                                selectedChannels.includes(ch.channelId) ? "bg-primary text-white" : "opacity-50"
                              )}>
                                {selectedChannels.includes(ch.channelId) && <Check className="h-3 w-3" />}
                              </div>
                              <span className="font-medium">{ch.channelTitle}</span>
                              <span className="ml-auto text-[10px] font-jetbrains-mono opacity-40">{ch.channelId}</span>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>

                <AnimatePresence>
                  {selectedChannels.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex flex-wrap gap-2 pt-2"
                    >
                      {selectedChannels.map(id => {
                        const ch = channels.find(c => c.channelId === id);
                        return (
                          <Badge key={id} variant="secondary" className="pl-3 pr-1 py-1 gap-2 rounded-full bg-primary/10 text-primary border-primary/10 hover:bg-primary/20 transition-colors">
                            <span className="text-xs font-bold">{ch?.channelTitle || id}</span>
                            <button
                              onClick={() => setSelectedChannels(prev => prev.filter(p => p !== id))}
                              className="rounded-full hover:bg-primary/20 p-0.5 transition-colors"
                            >
                              <Plus className="rotate-45 h-3 w-3" />
                            </button>
                          </Badge>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Editor Section */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
          <Card className="overflow-hidden border-primary/10 shadow-lg shadow-primary/5">
             <CardHeader>
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                  <Zap className="text-amber-500 w-5 h-5" /> Visual Composition
                </CardTitle>
                <CardDescription className="font-google-sans">Rich text editor with Telegram HTML support</CardDescription>
             </CardHeader>
             <CardContent className="space-y-8">
                <PostEditor content={content} onChange={setContent} />
                <MediaPanel selectedMedia={media} onSelect={setMedia} />
                <ButtonBuilder rows={buttons} onChange={setButtons} />
             </CardContent>
          </Card>
        </motion.div>

        {/* Advanced Options */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
          <Card className="border-primary/10 bg-muted/20">
            <CardHeader className="py-4">
              <CardTitle className="text-sm font-bold flex items-center gap-2 uppercase tracking-widest opacity-60">
                <Settings2 size={16} /> Advanced Parameters
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-10 pb-6">
              <div className="flex items-center space-x-3 group cursor-pointer">
                <Switch id="silent" checked={silentSend} onCheckedChange={setSilentSend} className="data-[state=checked]:bg-primary" />
                <Label htmlFor="silent" className="cursor-pointer font-google-sans text-sm group-hover:text-primary transition-colors">Silent Notification</Label>
              </div>
              <div className="flex items-center space-x-3 group cursor-pointer">
                <Switch id="pin" checked={pinMessage} onCheckedChange={setPinMessage} className="data-[state=checked]:bg-primary" />
                <Label htmlFor="pin" className="cursor-pointer font-google-sans text-sm group-hover:text-primary transition-colors">Pin Message</Label>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="lg:col-span-5 space-y-8">
        <Tabs defaultValue="preview" className="w-full">
          <TabsList className="grid w-full grid-cols-2 p-1 bg-muted/50 rounded-2xl h-12">
            <TabsTrigger value="preview" className="rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-sm font-bold">Live Preview</TabsTrigger>
            <TabsTrigger value="raw" className="rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-sm font-bold font-jetbrains-mono text-xs">RAW HTML</TabsTrigger>
          </TabsList>

          <TabsContent value="preview" className="mt-6">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <PostPreview content={content} media={media} buttons={buttons} />
            </motion.div>
          </TabsContent>

          <TabsContent value="raw" className="mt-6">
            <Card className="overflow-hidden border-primary/10">
              <CardContent className="p-0">
                <div className="relative">
                  <pre className="bg-black/95 text-green-400 p-6 rounded-none text-[10px] font-jetbrains-mono overflow-auto max-h-[500px] leading-relaxed">
                    {content || '// No content yet'}
                  </pre>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute top-4 right-4 text-white/40 hover:text-white hover:bg-white/10"
                    onClick={copyRawHtml}
                  >
                    <Copy size={16} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card className="relative overflow-hidden border-primary/20 bg-gradient-to-br from-primary/10 to-transparent shadow-2xl shadow-primary/10">
          <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
          <CardHeader>
            <CardTitle className="text-xl font-bold font-mozilla-headline">Deployment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label className="text-xs uppercase tracking-widest opacity-50 font-jetbrains-mono">Scheduled Release</Label>
              <Popover>
                <PopoverTrigger>
                  <Button variant="outline" className="w-full h-12 justify-start text-left font-normal bg-background border-primary/10 hover:border-primary/30 transition-all rounded-xl">
                    <CalendarIcon className="mr-3 h-4 w-4 text-primary" />
                    <span className="font-google-sans">{scheduledAt ? format(scheduledAt, 'PPP p') : <span>Pick a date</span>}</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 rounded-2xl border-primary/20 shadow-2xl overflow-hidden">
                  <Calendar mode="single" selected={scheduledAt} onSelect={setScheduledAt} />
                  <div className="p-4 border-t bg-muted/30">
                    <Input
                      type="time"
                      className="h-10 bg-background border-primary/10 rounded-lg"
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

            <div className="grid grid-cols-1 gap-4 pt-4">
              <Button
                className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-2xl shadow-xl shadow-primary/20 group transition-all"
                onClick={() => handleSend(true)}
                disabled={loading}
              >
                {loading ? <Clock className="mr-2 h-5 w-5 animate-spin" /> : <Send className="mr-2 h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
                Transmit Immediately
              </Button>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className="w-full h-12 rounded-xl border-primary/20 hover:bg-primary/5 hover:text-primary transition-all font-bold"
                  onClick={() => handleSend(false)}
                  disabled={loading}
                >
                  Schedule
                </Button>
                <Button variant="secondary" className="w-full h-12 rounded-xl font-bold flex items-center gap-2">
                  <Save className="w-4 h-4" /> Backup
                </Button>
              </div>
            </div>

            <p className="text-[10px] text-center text-muted-foreground font-jetbrains-mono uppercase tracking-tighter opacity-50">
              Verified by Telegram Enterprise Security
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
