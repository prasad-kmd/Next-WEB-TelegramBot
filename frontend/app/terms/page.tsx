import React from 'react';
import Link from 'next/link';

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-background text-foreground p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-4xl font-mozilla-headline font-bold">Terms & Conditions</h1>
        <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>

        <section className="space-y-4">
          <h2 className="text-2xl font-mozilla-headline font-semibold">1. Acceptance of Terms</h2>
          <p className="font-mozilla-text">
            By accessing or using Telegram Post Maker, you agree to be bound by these Terms & Conditions.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-mozilla-headline font-semibold">2. Use License</h2>
          <p className="font-mozilla-text">
            Permission is granted to use the software for personal or commercial use related to managing your Telegram channels.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-mozilla-headline font-semibold">3. Prohibited Activities</h2>
          <p className="font-mozilla-text">
            You may not use our service for any illegal purposes or to distribute spam or unauthorized content on Telegram.
          </p>
        </section>

        <div className="pt-8">
          <Link href="/login" className="text-primary hover:underline font-medium">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
