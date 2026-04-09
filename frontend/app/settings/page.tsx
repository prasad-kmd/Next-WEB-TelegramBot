'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus, Info } from 'lucide-react';
import api from '@/lib/api';

export default function SettingsPage() {
  const [channels, setChannels] = useState<any[]>([]);
  const [newChannel, setNewChannel] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchChannels();
  }, []);

  const fetchChannels = async () => {
    const res = await api.get('/api/channels');
    setChannels(res.data);
  };

  const addChannel = async () => {
    if (!newChannel) return;
    setLoading(true);
    try {
      await api.post('/api/channels', { channelId: newChannel });
      setNewChannel('');
      fetchChannels();
    } catch (err) {
      alert('Could not add channel. Make sure the bot is an admin.');
    } finally {
      setLoading(false);
    }
  };

  const removeChannel = async (id: string) => {
    await api.delete(`/api/channels/${id}`);
    fetchChannels();
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-4xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          </header>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Manage Channels</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Channel Username or ID (e.g. @mychannel or -100...)"
                    value={newChannel}
                    onChange={(e) => setNewChannel(e.target.value)}
                  />
                  <Button onClick={addChannel} disabled={loading}>
                    <Plus size={18} className="mr-2" /> Add
                  </Button>
                </div>

                <div className="space-y-2">
                  {channels.map((ch) => (
                    <div key={ch._id} className="flex items-center justify-between p-3 bg-white border rounded-lg">
                      <div>
                        <div className="font-medium">{ch.channelTitle}</div>
                        <div className="text-xs text-gray-500">{ch.channelId}</div>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => removeChannel(ch._id)}>
                        <Trash2 size={16} className="text-red-500" />
                      </Button>
                    </div>
                  ))}
                  {channels.length === 0 && (
                    <div className="text-center py-8 text-gray-500 text-sm">No channels added yet.</div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Bot Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3 p-4 bg-blue-50 text-blue-800 rounded-lg text-sm">
                  <Info size={18} className="shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Setup Instructions:</p>
                    <ul className="list-disc ml-4 mt-2 space-y-1">
                      <li>Create a bot via @BotFather and get the token.</li>
                      <li>Add the bot as an administrator to your channels.</li>
                      <li>Enter the channel username or ID above to link it.</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
