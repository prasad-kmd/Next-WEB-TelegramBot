'use client';

import { useState, useEffect, useCallback } from 'react';
import Sidebar from '@/components/Sidebar';
import Composer from '@/components/post-maker/Composer';
import TelegramLinkBanner from '@/components/dashboard/TelegramLinkBanner';
import { OnboardingChecklist } from '@/components/dashboard/OnboardingChecklist';
import api from '@/lib/api';
import { useSession } from 'next-auth/react';

export default function Home() {
  const { data: session } = useSession();
  const [hasChannels, setHasChannels] = useState(false);
  const [isLinked, setIsLinked] = useState(false);
  const [hasSentPost, setHasSentPost] = useState(false);

  const fetchData = useCallback(async () => {
    if (!session?.user?.email) return;
    try {
      const [channels, status, scheduled] = await Promise.all([
        api.get('/api/channels'),
        api.get(`/api/auth/tg-link-status?email=${session.user.email}`),
        api.get('/api/posts/scheduled')
      ]);

      setHasChannels(channels.data.length > 0);
      setIsLinked(status.data.confirmed);
      setHasSentPost(scheduled.data.length > 0);
    } catch (err) {
      console.error('Onboarding data fetch error', err);
    }
  }, [session]); // Changed from session?.user?.email to session to satisfy compiler

  useEffect(() => {
    if (session?.user?.email) {
      void fetchData();
    }
  }, [session, fetchData]);

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TelegramLinkBanner />
        <main className="flex-1 p-8 overflow-auto">
          <div className="max-w-6xl mx-auto">
            <header className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Create Post</h1>
              <p className="text-gray-500">Compose and schedule your Telegram content</p>
            </header>

            <OnboardingChecklist
              hasChannels={hasChannels}
              isLinked={isLinked}
              hasSentPost={hasSentPost}
            />

            <Composer />
          </div>
        </main>
      </div>
    </div>
  );
}
