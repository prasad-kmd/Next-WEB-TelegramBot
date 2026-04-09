'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { format } from 'date-fns';
import api from '@/lib/api';

export default function ScheduledPage() {
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const res = await api.get('/api/posts/scheduled');
    setPosts(res.data);
  };

  const cancelPost = async (id: string) => {
    await api.delete(`/api/posts/scheduled/${id}`);
    fetchPosts();
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-4xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Scheduled Posts</h1>
          </header>

          <div className="space-y-4">
            {posts.map((post) => (
              <Card key={post._id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-2 text-sm text-blue-600 font-medium">
                        <Clock size={16} />
                        {format(new Date(post.scheduledAt), 'PPP p')}
                        <Badge variant="outline" className="ml-2">{post.status}</Badge>
                      </div>
                      <div className="text-gray-700 line-clamp-2 text-sm" dangerouslySetInnerHTML={{ __html: post.message }} />
                      <div className="flex flex-wrap gap-1">
                        {post.targets.map((t: string) => (
                          <Badge key={t} variant="secondary" className="text-[10px]">{t}</Badge>
                        ))}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => cancelPost(post._id)}>
                      <Trash2 size={18} className="text-red-500" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {posts.length === 0 && (
              <div className="text-center py-20 bg-white border rounded-xl text-gray-500">
                <CalendarIcon size={48} className="mx-auto mb-4 opacity-20" />
                <p>No scheduled posts found.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
