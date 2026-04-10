'use client';

import TelegramLinkBanner from '@/components/auth/TelegramLinkBanner';
import OnboardingChecklist from '@/components/dashboard/OnboardingChecklist';
import Composer from '@/components/post-maker/Composer';
import { PageLayout } from '@/components/layout/PageLayout';

export default function Home() {
  return (
    <PageLayout>
      <TelegramLinkBanner />
      <OnboardingChecklist />
      <div className="mb-8 space-y-1">
        <h1 className="text-3xl font-bold tracking-tight mozilla-headline">Create Post</h1>
        <p className="text-muted-foreground google-sans">Compose and schedule your Telegram content</p>
      </div>
      <Composer />
    </PageLayout>
  );
}
