'use client';

import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import TelegramLinkBanner from '@/components/auth/TelegramLinkBanner';
import OnboardingChecklist from '@/components/dashboard/OnboardingChecklist';
import Composer from '@/components/post-maker/Composer';

export default function Home() {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-8">
          <div className="mx-auto max-w-6xl">
            <TelegramLinkBanner />
            <OnboardingChecklist />
            <div className="mb-8 font-sans">
              <h1 className="text-3xl font-mozilla-headline font-bold tracking-tight">Create Post</h1>
              <p className="text-muted-foreground font-mozilla-text">Compose and schedule your Telegram content</p>
            </div>
            <Composer />
          </div>
        </main>
      </div>
    </div>
  );
}
