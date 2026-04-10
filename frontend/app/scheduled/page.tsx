'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Trash2, Calendar as CalendarIcon, Clock, MoreVertical } from 'lucide-react';
import { format } from 'date-fns';
import api from '@/lib/api';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PageLayout } from '@/components/layout/PageLayout';

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
    <PageLayout>
      <header className="mb-8 space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-foreground mozilla-headline">Scheduled Posts</h1>
        <p className="text-muted-foreground google-sans">Manage and track your upcoming Telegram content</p>
      </header>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <Card key={i} className="rounded-2xl border-border/50 bg-card/50">
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
            <Card key={post._id} className="flex flex-col rounded-2xl border-border/50 bg-card/50 backdrop-blur-sm transition-all hover:border-primary/30">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary google-sans">
                    <Clock size={14} />
                    {format(new Date(post.scheduledAt), 'PPP p')}
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                        <MoreVertical size={16} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-xl border-border/50 bg-card/90 backdrop-blur-md">
                      <DropdownMenuItem className="text-destructive font-medium google-sans" onClick={() => cancelPost(post._id)}>
                        <Trash2 className="mr-2 h-4 w-4" /> Cancel Post
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="flex flex-wrap gap-1 mt-3">
                  {post.targets.map((t: string) => (
                    <Badge key={t} variant="secondary" className="text-[9px] uppercase tracking-tighter font-bold bg-primary/10 text-primary border-none">
                      {t}
                    </Badge>
                  ))}
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <div
                  className="text-sm text-foreground/80 line-clamp-3 prose prose-sm dark:prose-invert google-sans"
                  dangerouslySetInnerHTML={{ __html: post.message }}
                />
                {post.media && (
                  <div className="mt-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground bg-muted/50 p-2 rounded-lg">
                    <span className="capitalize">{post.media.file_type} attached</span>
                  </div>
                )}
              </CardContent>
              <CardFooter className="pt-3 border-t border-border/50 bg-muted/20">
                <Badge variant={post.status === 'pending' ? 'outline' : 'default'} className="capitalize text-[10px] font-bold tracking-widest rounded-full">
                  {post.status}
                </Badge>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {!loading && posts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 bg-card/30 border border-dashed border-border/50 rounded-2xl text-muted-foreground animate-in zoom-in-95 duration-500">
          <CalendarIcon size={48} className="mb-4 opacity-10" />
          <p className="text-xl font-bold mozilla-headline text-foreground">No scheduled posts</p>
          <p className="text-sm google-sans mb-8">You haven&apos;t scheduled any content yet.</p>
          <Button className="rounded-xl font-bold uppercase tracking-widest text-xs px-8 h-12 shadow-lg shadow-primary/20" onClick={() => window.location.href = '/'}>
            Create New Post
          </Button>
        </div>
      )}
    </PageLayout>
  );
}
