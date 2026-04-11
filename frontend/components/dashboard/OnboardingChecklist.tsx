'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Circle, ArrowRight } from 'lucide-react';
import api from '@/lib/api';
import { useSession } from 'next-auth/react';

export default function OnboardingChecklist() {
  const { data: session } = useSession();
  const [channels, setChannels] = useState<any[]>([]);
  const [isLinked, setIsLinked] = useState(false);
  const [hasPosted, setHasPosted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const [channelsRes, linkRes, postsRes] = await Promise.all([
          api.get('/api/channels'),
          api.get('/auth/tg-link-info', { headers: { 'x-user-email': session?.user?.email } }),
          api.get('/api/posts/scheduled') // Checking if any posts exist (scheduled or sent)
        ]);

        setChannels(channelsRes.data);
        setIsLinked(!!linkRes.data.telegramId);
        setHasPosted(postsRes.data.length > 0);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      checkOnboarding();
    }
  }, [session]);

  if (loading || (channels.length > 0 && isLinked && hasPosted)) return null;

  const steps = [
    { id: 1, title: 'Add a channel', completed: channels.length > 0, href: '/settings' },
    { id: 2, title: 'Link Telegram', completed: isLinked, href: '/?link=true' },
    { id: 3, title: 'Send your first post', completed: hasPosted, href: '/' },
  ];

  const completedCount = steps.filter(s => s.completed).length;
  const progress = (completedCount / steps.length) * 100;

  return (
    <Card className="mb-8 border-blue-100 bg-blue-50/50 dark:border-blue-900/30 dark:bg-blue-900/10">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold uppercase tracking-wider text-blue-600">Getting Started</CardTitle>
          <span className="text-xs font-medium text-blue-600">{completedCount}/{steps.length} Steps</span>
        </div>
        <Progress value={progress} className="h-1.5 mt-2" />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
          {steps.map((step) => (
            <Link
              key={step.id}
              href={step.href}
              className={`flex items-center gap-3 p-3 rounded-lg border bg-background transition-all hover:border-primary/50 ${
                step.completed ? 'opacity-60 grayscale' : 'border-blue-200 shadow-sm'
              }`}
            >
              {step.completed ? (
                <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
              ) : (
                <Circle className="h-5 w-5 text-blue-400 shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium truncate ${step.completed ? 'line-through text-muted-foreground' : ''}`}>
                  {step.title}
                </p>
              </div>
              {!step.completed && (
                <ArrowRight className="h-4 w-4 text-blue-400 shrink-0" />
              )}
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
