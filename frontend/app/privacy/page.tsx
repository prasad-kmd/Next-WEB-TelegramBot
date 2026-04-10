import React from 'react';
import Link from 'next/link';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background text-foreground p-8 font-noto-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-4xl font-mozilla-headline font-bold">Privacy Policy</h1>
        <p className="text-muted-foreground font-space-mono text-sm">Last updated: {new Date().toLocaleDateString()}</p>

        <section className="space-y-4">
          <h2 className="text-2xl font-noto-sans-display font-semibold border-b pb-2">1. Information We Collect</h2>
          <p className="font-mozilla-text text-lg">
            We collect information that you provide directly to us when you use our Telegram Post Maker bot and application.
            This includes your Telegram user information (ID, name, username) and any content you create or schedule.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-noto-sans-display font-semibold border-b pb-2">2. How We Use Your Information</h2>
          <p className="font-mozilla-text text-lg">
            We use the information we collect to provide, maintain, and improve our services, including scheduling and sending
            posts to your Telegram channels as requested.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-noto-sans-display font-semibold border-b pb-2">3. Data Security</h2>
          <p className="font-roboto">
            We take reasonable measures to help protect information about you from loss, theft, misuse, and unauthorized access.
          </p>
        </section>

        <footer className="pt-12 border-t mt-12">
          <p className="font-noto-sinhala text-muted-foreground text-center italic">
            "Your privacy is our priority."
          </p>
          <div className="pt-4 flex justify-center">
            <Link href="/login" className="text-primary hover:underline font-google-sans font-medium">
              Back to Login
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
