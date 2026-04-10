'use client';

import AppLayout from '@/components/layout/AppLayout';
import TelegramLinkBanner from '@/components/auth/TelegramLinkBanner';
import OnboardingChecklist from '@/components/dashboard/OnboardingChecklist';
import Composer from '@/components/post-maker/Composer';

export default function Home() {
  return (
    <AppLayout>
      <TelegramLinkBanner />
      <OnboardingChecklist />
      <div className="mb-8">
        <h1 className="text-3xl font-mozilla-headline font-bold tracking-tight">Create Post</h1>
        <p className="text-muted-foreground font-mozilla-text">Compose and schedule your Telegram content</p>
      </div>
      <Composer />
    </AppLayout>
  );
}
