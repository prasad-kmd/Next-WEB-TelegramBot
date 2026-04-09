'use client';

import { useState, useEffect, useCallback } from 'react';
import Sidebar from '@/components/Sidebar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { format } from 'date-fns';
import api from '@/lib/api';
import { ScheduledPost } from '@/types';
import { EmptyState } from '@/components/EmptyState';
import { toast } from 'sonner';

export default function ScheduledPage() {
  const [posts, setPosts] = useState<ScheduledPost[]>([]);

  const fetchPosts = useCallback(async () => {
    try {
      const res = await api.get('/api/posts/scheduled');
      setPosts(res.data);
    } catch (err) {
      console.error('Failed to fetch posts', err);
      toast.error('Failed to load scheduled posts', {
        action: {
          label: 'Retry',
          onClick: () => {
            window.location.reload();
          }
        }
      });
    }
  }, []);

  useEffect(() => {
    void fetchPosts();
  }, [fetchPosts]);

  const cancelPost = async (id: string) => {
    try {
      await api.delete(`/api/posts/scheduled/${id}`);
      void fetchPosts();
      toast.success('Post cancelled');
    } catch (err) {
      console.error('Failed to cancel post', err);
      toast.error('Failed to cancel post');
    }
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
            {posts.length > 0 ? (
              posts.map((post) => (
                <Card key={post._id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-3 flex-1">
                        <div className="flex items-center gap-2 text-sm text-blue-600 font-medium">
                          <Clock size={16} />
                          {format(new Date(post.scheduledAt), 'PPP p')}
                          <Badge variant="outline" className="ml-2 uppercase text-[10px]">{post.status}</Badge>
                        </div>
                        <div className="text-gray-700 line-clamp-2 text-sm" dangerouslySetInnerHTML={{ __html: post.message }} />
                        <div className="flex flex-wrap gap-1">
                          {post.targets.map((t: string) => (
                            <Badge key={t} variant="secondary" className="text-[10px]">{t}</Badge>
                          ))}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => cancelPost(post._id)}
                        aria-label="Cancel scheduled post"
                      >
                        <Trash2 size={18} className="text-red-500" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <EmptyState
                icon={CalendarIcon}
                title="No scheduled posts"
                description="Compose a post in the Dashboard and schedule it for later to see it here."
                actionLabel="Go to Dashboard"
                onAction={() => { window.location.href = '/'; }}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
