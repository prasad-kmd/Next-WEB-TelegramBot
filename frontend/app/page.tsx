"use client";

import { Suspense } from "react";
import TelegramLinkBanner from "@/components/auth/TelegramLinkBanner";
function HomeContent() {
  return (
    <>
      <TelegramLinkBanner />
      <div className="mb-8 space-y-1">
        <h1 className="text-3xl font-bold tracking-tight mozilla-headline">
          Create Post
        </h1>
        <p className="text-muted-foreground google-sans">
          Compose and schedule your Telegram content
        </p>
      </div>
      <Composer />
    </>
  );
}

export default function Home() {
  return (
    <PageLayout>
      <Suspense
        fallback={
          <div className="flex justify-center p-12">
            <Loader2 className="animate-spin h-8 w-8 text-primary" />
          </div>
        }
      >
        <HomeContent />
      </Suspense>
    </PageLayout>
  );
}
