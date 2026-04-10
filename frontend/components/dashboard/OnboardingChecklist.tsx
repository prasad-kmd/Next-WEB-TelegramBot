'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Circle, ArrowRight, Sparkles } from 'lucide-react';
import api from '@/lib/api';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';

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
          api.get('/api/posts/scheduled')
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
    { id: 1, title: 'Add a channel', completed: channels.length > 0, href: '/settings', description: 'Configure destination' },
    { id: 2, title: 'Link Telegram', completed: isLinked, href: '/', description: 'Auth via Bot' },
    { id: 3, title: 'Send first post', completed: hasPosted, href: '/', description: 'Start broadcasting' },
  ];

  const completedCount = steps.filter(s => s.completed).length;
  const progress = (completedCount / steps.length) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-12"
    >
      <Card className="overflow-hidden border-primary/10 bg-gradient-to-br from-primary/5 to-transparent backdrop-blur-sm shadow-xl shadow-primary/5">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Sparkles size={120} />
        </div>

        <CardHeader className="pb-4 relative z-10">
          <div className="flex items-center justify-between mb-2">
            <div>
              <CardTitle className="text-xl font-mozilla-headline font-bold text-foreground flex items-center gap-2">
                Getting Started
                <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full font-jetbrains-mono uppercase tracking-tighter">Premium Onboarding</span>
              </CardTitle>
              <CardDescription className="font-google-sans">Complete these steps to unlock full potential.</CardDescription>
            </div>
            <div className="text-right">
              <span className="text-2xl font-jetbrains-mono font-bold text-primary">{completedCount}</span>
              <span className="text-muted-foreground text-sm font-jetbrains-mono">/{steps.length}</span>
            </div>
          </div>
          <div className="relative h-2 w-full bg-primary/10 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="absolute top-0 left-0 h-full bg-primary shadow-[0_0_10px_var(--primary)]"
            />
          </div>
        </CardHeader>

        <CardContent className="relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((step) => (
              <motion.div
                key={step.id}
                whileHover={{ scale: 1.02 }}
                className={`relative flex items-center gap-4 p-5 rounded-2xl border transition-all duration-300 ${
                  step.completed
                    ? 'bg-green-500/5 border-green-500/20'
                    : 'bg-card border-border hover:border-primary/50 shadow-sm'
                }`}
              >
                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  step.completed ? 'bg-green-500/10 text-green-500' : 'bg-primary/10 text-primary'
                }`}>
                  {step.completed ? (
                    <CheckCircle2 className="h-6 w-6" />
                  ) : (
                    <span className="font-jetbrains-mono font-bold">{step.id}</span>
                  )}
                </div>

                <div className="flex-1">
                  <p className={`font-google-sans font-bold text-sm ${step.completed ? 'text-muted-foreground/50' : 'text-foreground'}`}>
                    {step.title}
                  </p>
                  <p className="text-[10px] text-muted-foreground font-jetbrains-mono uppercase tracking-widest">{step.description}</p>
                </div>

                {!step.completed && (
                  <ArrowRight className="h-4 w-4 text-primary animate-pulse" />
                )}
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
