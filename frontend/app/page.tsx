'use client';

import { Suspense } from 'react';
import TelegramLinkBanner from '@/components/auth/TelegramLinkBanner';
import OnboardingChecklist from '@/components/dashboard/OnboardingChecklist';
import Composer from '@/components/post-maker/Composer';
import { PageLayout } from '@/components/layout/PageLayout';
import { Loader2 } from 'lucide-react';

function HomeContent() {
  return (
    <>
      <TelegramLinkBanner />
      <OnboardingChecklist />
      <div className="mb-8 space-y-1">
        <h1 className="text-3xl font-bold tracking-tight mozilla-headline">Create Post</h1>
        <p className="text-muted-foreground google-sans">Compose and schedule your Telegram content</p>
      </div>
      <Composer />
    </>
  );
}

export default function Home() {
  return (
    <PageLayout>
      <Suspense fallback={<div className="flex justify-center p-12"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>}>
        <HomeContent />
      </Suspense>
    </PageLayout>
  );
}
