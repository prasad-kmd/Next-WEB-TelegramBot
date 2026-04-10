'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
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

export default function SettingsPage() {
  const { data: session } = useSession();
  const [channels, setChannels] = useState<any[]>([]);
  const [newChannel, setNewChannel] = useState('');
  const [loading, setLoading] = useState(false);
  const [tgInfo, setTgInfo] = useState<{telegramId?: string, username?: string} | null>(null);

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
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-8">
          <div className="mx-auto max-w-6xl">
            <header className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight text-foreground">Settings</h1>
              <p className="text-muted-foreground">Configure your account and bot preferences</p>
            </header>

            <Tabs defaultValue="channels" className="space-y-6">
              <TabsList>
                <TabsTrigger value="channels">Channels</TabsTrigger>
                <TabsTrigger value="bot">Bot</TabsTrigger>
                <TabsTrigger value="account">Account</TabsTrigger>
                <TabsTrigger value="ai">AI</TabsTrigger>
              </TabsList>

              <TabsContent value="channels" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Manage Channels</CardTitle>
                    <CardDescription>Add or remove Telegram channels where the bot can post.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Channel Username or ID (e.g. @mychannel or -100...)"
                        value={newChannel}
                        onChange={(e) => setNewChannel(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addChannel()}
                      />
                      <Button onClick={addChannel} disabled={loading || !newChannel}>
                        {loading ? <Plus size={18} className="mr-2 animate-spin" /> : <Plus size={18} className="mr-2" />}
                        Add Channel
                      </Button>
                    </div>

                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>ID</TableHead>
                            <TableHead className="w-[100px]">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {channels.map((ch) => (
                            <TableRow key={ch._id}>
                              <TableCell className="font-medium">{ch.channelTitle}</TableCell>
                              <TableCell className="text-muted-foreground font-mono text-xs">{ch.channelId}</TableCell>
                              <TableCell>
                                <Button variant="ghost" size="icon" onClick={() => removeChannel(ch._id)}>
                                  <Trash2 size={16} className="text-red-500" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                          {channels.length === 0 && (
                            <TableRow>
                              <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
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

              <TabsContent value="bot" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bot size={20} className="text-blue-600" /> Bot Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/30">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                          <Bot size={24} />
                        </div>
                        <div>
                          <p className="font-semibold text-lg">Post Maker Bot</p>
                          <p className="text-sm text-muted-foreground">@PostMakerBot</p>
                        </div>
                      </div>
                      <Badge className="bg-green-500">Active</Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="p-4 border rounded-lg space-y-1">
                        <p className="text-muted-foreground">Token Status</p>
                        <p className="font-medium flex items-center gap-2">
                          <CheckCircle2 size={14} className="text-green-500" /> Valid
                        </p>
                      </div>
                      <div className="p-4 border rounded-lg space-y-1">
                        <p className="text-muted-foreground">Permissions</p>
                        <p className="font-medium flex items-center gap-2">
                          <ShieldCheck size={14} className="text-green-500" /> Administrator
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-blue-50 text-blue-800 dark:bg-blue-950/20 dark:text-blue-400 rounded-lg text-sm">
                      <Info size={18} className="shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold">Setup Instructions:</p>
                        <ul className="list-disc ml-4 mt-2 space-y-1">
                          <li>Create a bot via @BotFather and get the token.</li>
                          <li>Add the bot as an administrator to your channels.</li>
                          <li>Enter the channel username or ID in the Channels tab.</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="account" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User size={20} className="text-blue-600" /> Account Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Name</p>
                          <p className="font-medium">{session?.user?.name || 'N/A'}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Email</p>
                          <p className="font-medium">{session?.user?.email || 'N/A'}</p>
                        </div>
                      </div>
                      <div className="pt-4 border-t">
                        <h4 className="font-semibold mb-4 flex items-center gap-2">
                          <Link2 size={18} /> Telegram Integration
                        </h4>
                        {tgInfo?.telegramId ? (
                          <div className="flex items-center justify-between p-4 border rounded-lg bg-green-50/30 dark:bg-green-950/10 border-green-100 dark:border-green-900/30">
                            <div className="flex items-center gap-3 text-green-800 dark:text-green-400">
                              <CheckCircle2 size={18} />
                              <div>
                                <p className="font-medium">Linked to @{tgInfo.username || tgInfo.telegramId}</p>
                                <p className="text-xs opacity-80">Connected via confirmation code</p>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50">
                              <Unlink size={16} className="mr-2" /> Unlink
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between p-4 border rounded-lg bg-amber-50/30 dark:bg-amber-950/10 border-amber-100 dark:border-amber-900/30">
                            <div className="flex items-center gap-3 text-amber-800 dark:text-amber-400">
                              <AlertCircle size={18} />
                              <div>
                                <p className="font-medium">Not linked to Telegram</p>
                                <p className="text-xs opacity-80">Linking is required to post messages</p>
                              </div>
                            </div>
                            <Button variant="outline" size="sm" className="bg-white" onClick={() => window.location.href = '/'}>
                              Link Now
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="ai" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles size={20} className="text-purple-600" /> AI Providers
                    </CardTitle>
                    <CardDescription>Configure AI assistants for content generation and improvement.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                      <Sparkles size={48} className="text-purple-200" />
                      <div>
                        <p className="text-lg font-medium">AI features coming soon</p>
                        <p className="text-sm text-muted-foreground">We're working on integrating OpenAI and Anthropic to help you write better posts.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}
