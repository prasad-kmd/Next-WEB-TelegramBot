'use client';

import Sidebar from '@/components/Sidebar';
import Composer from '@/components/post-maker/Composer';
import TelegramLinkBanner from '@/components/dashboard/TelegramLinkBanner';

export default function Home() {
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
            <Composer />
          </div>
        </main>
      </div>
    </div>
  );
}
