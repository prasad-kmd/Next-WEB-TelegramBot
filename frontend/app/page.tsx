'use client';

import { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import TelegramLinkBanner from '@/components/auth/TelegramLinkBanner';
import OnboardingChecklist from '@/components/dashboard/OnboardingChecklist';
import Composer from '@/components/post-maker/Composer';
import { Sheet, SheetContent } from '@/components/ui/sheet';

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <Sidebar />
        </SheetContent>
      </Sheet>

      <div className="flex flex-1 flex-col overflow-hidden">
        <Header onMenuClick={() => setMobileMenuOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="mx-auto max-w-6xl">
            <TelegramLinkBanner />
            <OnboardingChecklist />
            <div className="mb-8">
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Create Post</h1>
              <p className="text-muted-foreground">Compose and schedule your Telegram content</p>
            </div>
            <Composer />
          </div>
        </main>
      </div>
    </div>
  );
}
