import React from 'react';
import AppLayout from '@/components/layout/AppLayout';

export default function PrivacyPolicy() {
  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-10 py-12 font-google-sans">
        <div className="space-y-4 text-center">
           <h1 className="text-5xl font-mozilla-headline font-bold text-foreground">Privacy Policy</h1>
           <p className="text-muted-foreground font-jetbrains-mono text-sm uppercase tracking-widest">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="grid gap-12 pt-8">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold border-l-4 border-primary pl-4">1. Information We Collect</h2>
            <p className="font-google-sans text-lg text-muted-foreground leading-relaxed">
              We collect information that you provide directly to us when you use our Telegram Post Maker bot and application.
              This includes your Telegram user information (ID, name, username) and any content you create or schedule.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold border-l-4 border-primary pl-4">2. How We Use Your Information</h2>
            <p className="font-google-sans text-lg text-muted-foreground leading-relaxed">
              We use the information we collect to provide, maintain, and improve our services, including scheduling and sending
              posts to your Telegram channels as requested.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold border-l-4 border-primary pl-4">3. Data Security</h2>
            <p className="font-google-sans text-lg text-muted-foreground leading-relaxed">
              We take reasonable measures to help protect information about you from loss, theft, misuse, and unauthorized access.
              All communication with Telegram is encrypted via their official API.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold border-l-4 border-primary pl-4">4. Cookies & Analytics</h2>
            <p className="font-google-sans text-lg text-muted-foreground leading-relaxed">
              We use essential cookies to manage your authentication session and ensure the stability of the platform. We do not sell your data to third parties.
            </p>
          </section>
        </div>

        <div className="pt-20 text-center">
          <p className="font-noto-serif-sinhala text-muted-foreground italic text-xl">
            "Your privacy is our priority."
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
