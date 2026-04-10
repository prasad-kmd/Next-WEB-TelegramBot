'use client';

import { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Trash2, Calendar as CalendarIcon, Clock, MoreVertical, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import api from '@/lib/api';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ScheduledPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/posts/scheduled');
      setPosts(res.data);
    } catch (err) {
      toast.error('Failed to fetch scheduled posts');
    } finally {
      setLoading(false);
    }
  };

  const cancelPost = async (id: string) => {
    try {
      await api.delete(`/api/posts/scheduled/${id}`);
      setPosts(prev => prev.filter(p => p._id !== id));
      toast.success('Post canceled successfully');
    } catch (err) {
      toast.error('Failed to cancel post');
    }
  };

  return (
    <AppLayout>
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground font-mozilla-headline">Scheduled Posts</h1>
        <p className="text-muted-foreground font-mozilla-text">Manage and track your upcoming Telegram content</p>
      </header>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <Card key={i}>
              <CardHeader className="gap-2">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Card key={post._id} className="flex flex-col group hover:border-primary/50 transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-medium text-blue-600 font-jetbrains-mono">
                    <Clock size={14} />
                    {format(new Date(post.scheduledAt), 'PPP p')}
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical size={16} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="text-red-600" onClick={() => cancelPost(post._id)}>
                        <Trash2 className="mr-2 h-4 w-4" /> Cancel Post
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {post.targets.map((t: string) => (
                    <Badge key={t} variant="secondary" className="text-[10px] font-google-sans">{t}</Badge>
                  ))}
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <div
                  className="text-sm text-muted-foreground line-clamp-3 prose prose-sm dark:prose-invert font-google-sans"
                  dangerouslySetInnerHTML={{ __html: post.message }}
                />
                {post.media && (
                  <div className="mt-3 flex items-center gap-2 text-[10px] text-muted-foreground bg-muted p-1 rounded font-jetbrains-mono">
                    <span className="capitalize">{post.media.file_type} attached</span>
                  </div>
                )}
              </CardContent>
              <CardFooter className="pt-3 border-t bg-muted/20">
                <Badge variant={post.status === 'pending' ? 'outline' : 'default'} className="capitalize font-google-sans">
                  {post.status}
                </Badge>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {!loading && posts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 bg-card border border-dashed rounded-xl text-muted-foreground">
          <CalendarIcon size={48} className="mb-4 opacity-20" />
          <p className="text-lg font-medium font-google-sans">No scheduled posts found.</p>
          <p className="text-sm mb-6 font-google-sans">You haven't scheduled any posts yet.</p>
          <Button variant="outline" onClick={() => window.location.href = '/'}>
            Create New Post
          </Button>
        </div>
      )}
    </AppLayout>
  );
}
