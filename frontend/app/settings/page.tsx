'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  Trash2,
  Plus,
  Info,
  Bot,
  User,
  Link2,
  Unlink,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';
import { PageLayout } from '@/components/layout/PageLayout';

export default function SettingsPage() {
  const { data: session } = useSession();
  const [channels, setChannels] = useState<any[]>([]);
  const [newChannel, setNewChannel] = useState('');
  const [loading, setLoading] = useState(false);
  const [tgInfo, setTgInfo] = useState<{telegramId?: string, username?: string} | null>(null);
  const [botInfo, setBotInfo] = useState<{first_name?: string, username?: string} | null>(null);

  useEffect(() => {
    fetchChannels();
    fetchTgInfo();
  }, [session]);

  const fetchChannels = async () => {
    try {
      const res = await api.get('/api/channels');
      setChannels(res.data);
    } catch (e) {}
  };

  const fetchTgInfo = async () => {
    if (session?.user?.email) {
      try {
        const res = await api.get('/auth/tg-link-info', { headers: { 'x-user-email': session.user.email } });
        setTgInfo(res.data);
      } catch (e) {}
    }
  };

  const fetchBotInfo = async () => {
    try {
      const res = await api.get('/api/bot-info');
      setBotInfo(res.data);
    } catch (e) {}
  };

  useEffect(() => {
    fetchBotInfo();
  }, []);

  const addChannel = async () => {
    if (!newChannel) return;
    setLoading(true);
    try {
      await api.post('/api/channels', { channelId: newChannel });
      setNewChannel('');
      fetchChannels();
      toast.success('Channel added successfully');
    } catch (err) {
      toast.error('Could not add channel. Make sure the bot is an admin.');
    } finally {
      setLoading(false);
    }
  };

  const removeChannel = async (id: string) => {
    try {
      await api.delete(`/api/channels/${id}`);
      setChannels(prev => prev.filter(ch => ch._id !== id));
      toast.success('Channel removed');
    } catch (err) {
      toast.error('Failed to remove channel');
    }
  };

  return (
    <PageLayout>
      <Tabs defaultValue="channels" className="space-y-8">
        <header className="space-y-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-foreground mozilla-headline">Settings</h1>
            <p className="text-muted-foreground google-sans">Configure your account and bot preferences</p>
          </div>

          <TabsList className="bg-muted/50 p-1 rounded-xl h-11">
            <TabsTrigger value="channels" className="rounded-lg font-bold google-sans text-xs uppercase tracking-widest px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm">Channels</TabsTrigger>
            <TabsTrigger value="bot" className="rounded-lg font-bold google-sans text-xs uppercase tracking-widest px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm">Bot</TabsTrigger>
            <TabsTrigger value="account" className="rounded-lg font-bold google-sans text-xs uppercase tracking-widest px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm">Account</TabsTrigger>
            <TabsTrigger value="ai" className="rounded-lg font-bold google-sans text-xs uppercase tracking-widest px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm">AI</TabsTrigger>
          </TabsList>
        </header>

        <TabsContent value="bot" className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300 mt-0">
          <Card className="rounded-2xl border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 mozilla-headline">
                <Bot size={20} className="text-primary" /> Bot Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-6 border border-border/50 rounded-2xl bg-muted/20">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                    <Bot size={28} />
                  </div>
                  <div>
                    <p className="font-bold text-xl mozilla-headline">{botInfo?.first_name || "Loading..."}</p>
                    <p className="text-sm text-muted-foreground font-mono">@{botInfo?.username || "..."}</p>
                  </div>
                </div>
                <Badge className="bg-green-500/10 text-green-500 border-none px-4 py-1 rounded-full font-bold uppercase tracking-widest text-[9px]">Active</Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="p-4 border border-border/50 rounded-2xl bg-muted/10 space-y-2">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground google-sans">Token Status</p>
                  <p className="font-bold flex items-center gap-2 google-sans">
                    <CheckCircle2 size={16} className="text-green-500" /> Valid
                  </p>
                </div>
                <div className="p-4 border border-border/50 rounded-2xl bg-muted/10 space-y-2">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground google-sans">Permissions</p>
                  <p className="font-bold flex items-center gap-2 google-sans">
                    <ShieldCheck size={16} className="text-green-500" /> Administrator
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 bg-primary/5 text-primary border border-primary/10 rounded-2xl text-sm google-sans">
                <Info size={20} className="shrink-0 mt-0.5 opacity-60" />
                <div className="space-y-2">
                  <p className="font-bold uppercase tracking-widest text-xs">Setup Instructions:</p>
                  <ul className="list-disc ml-4 space-y-2 text-foreground/80">
                    <li>Create a bot via @BotFather and get the token.</li>
                    <li>Add the bot as an administrator to your channels.</li>
                    <li>Enter the channel username or ID in the Channels tab.</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account" className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300 mt-0">
          <Card className="rounded-2xl border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 mozilla-headline">
                <User size={20} className="text-primary" /> Account Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-[0.2em] google-sans">Identity Name</p>
                  <p className="text-lg font-bold mozilla-headline">{session?.user?.name || 'Authorized User'}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-[0.2em] google-sans">Access Email</p>
                  <p className="text-lg font-bold mozilla-headline">{session?.user?.email || 'N/A'}</p>
                </div>
              </div>

              <div className="pt-8 border-t border-border/50">
                <h4 className="text-sm font-bold uppercase tracking-widest mb-6 flex items-center gap-2 google-sans">
                  <Link2 size={18} className="text-primary" /> Telegram Identity Link
                </h4>
                {tgInfo?.telegramId ? (
                  <div className="flex items-center justify-between p-6 border border-green-500/20 rounded-2xl bg-green-500/5">
                    <div className="flex items-center gap-4 text-green-600">
                      <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
                         <CheckCircle2 size={20} />
                      </div>
                      <div className="google-sans">
                        <p className="font-bold">Linked to @{tgInfo.username || tgInfo.telegramId}</p>
                        <p className="text-xs opacity-70">Secured via confirmation code protocol</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="h-10 rounded-xl text-xs font-bold uppercase tracking-widest text-destructive hover:bg-destructive/10">
                      <Unlink size={14} className="mr-2" /> Disconnect
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-6 border border-amber-500/20 rounded-2xl bg-amber-500/5">
                    <div className="flex items-center gap-4 text-amber-600">
                      <div className="h-10 w-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                         <AlertCircle size={20} />
                      </div>
                      <div className="google-sans">
                        <p className="font-bold">Unlinked Security Profile</p>
                        <p className="text-xs opacity-70">Identity confirmation required to broadcast messages</p>
                      </div>
                    </div>
                    <Button size="sm" className="h-10 rounded-xl text-xs font-bold uppercase tracking-widest px-6 shadow-lg shadow-primary/20" onClick={() => window.location.href = '/?link=true'}>
                      Link Identity
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="channels" className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300 mt-0">
          <Card className="rounded-2xl border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
            <CardHeader>
              <CardTitle className="mozilla-headline">Manage Channels</CardTitle>
              <CardDescription className="google-sans">Add or remove Telegram channels where the bot can post.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex gap-2">
                <Input
                  placeholder="Channel Username or ID (e.g. @mychannel or -100...)"
                  value={newChannel}
                  onChange={(e) => setNewChannel(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addChannel()}
                  className="h-11 rounded-xl bg-muted/30 border-border/50 focus:border-primary/50"
                />
                <Button onClick={addChannel} disabled={loading || !newChannel} className="h-11 rounded-xl font-bold uppercase tracking-widest text-[10px] px-6">
                  {loading ? <Plus size={16} className="mr-2 animate-spin" /> : <Plus size={16} className="mr-2" />}
                  Add Channel
                </Button>
              </div>

              <div className="rounded-xl border border-border/50 overflow-hidden">
                <Table>
                  <TableHeader className="bg-muted/30">
                    <TableRow className="hover:bg-transparent border-border/50">
                      <TableHead className="google-sans font-bold text-xs uppercase tracking-widest py-4">Title</TableHead>
                      <TableHead className="google-sans font-bold text-xs uppercase tracking-widest py-4">ID</TableHead>
                      <TableHead className="w-[100px] text-right pr-6 google-sans font-bold text-xs uppercase tracking-widest py-4">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {channels.map((ch) => (
                      <TableRow key={ch._id} className="border-border/50">
                        <TableCell className="font-bold google-sans py-4">{ch.channelTitle}</TableCell>
                        <TableCell className="text-muted-foreground font-mono text-[10px] py-4">{ch.channelId}</TableCell>
                        <TableCell className="text-right pr-6 py-4">
                          <Button variant="ghost" size="icon" onClick={() => removeChannel(ch._id)} className="rounded-lg h-8 w-8 hover:bg-destructive/10">
                            <Trash2 size={16} className="text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {channels.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={3} className="h-32 text-center text-muted-foreground google-sans italic">
                          No channels added yet.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>


        <TabsContent value="ai" className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300 mt-0">
          <Card className="rounded-2xl border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 mozilla-headline">
                <Sparkles size={20} className="text-primary" /> AI Intelligence
              </CardTitle>
              <CardDescription className="google-sans">Configure neural assistants for advanced content generation.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center justify-center py-20 text-center space-y-6 animate-pulse">
                <div className="h-20 w-20 rounded-3xl bg-primary/10 flex items-center justify-center text-primary/40 rotate-12">
                   <Sparkles size={40} />
                </div>
                <div className="space-y-2">
                  <p className="text-xl font-bold mozilla-headline uppercase tracking-tighter">Protocol Integration Pending</p>
                  <p className="text-sm text-muted-foreground google-sans max-w-sm mx-auto">Neural pathways for OpenAI and Anthropic are currently under development. Advanced broadcast optimization coming soon.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
}
