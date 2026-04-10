import React from 'react';
import AppLayout from '@/components/layout/AppLayout';

export default function TermsAndConditions() {
  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-10 py-12 font-google-sans">
        <div className="space-y-4 text-center">
          <h1 className="text-5xl font-mozilla-headline font-bold text-foreground">Terms & Conditions</h1>
          <p className="text-muted-foreground font-jetbrains-mono text-sm uppercase tracking-widest">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="grid gap-12 pt-8">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold border-l-4 border-primary pl-4">1. Acceptance of Terms</h2>
            <p className="font-google-sans text-lg text-muted-foreground leading-relaxed">
              By accessing or using Telegram Post Maker, you agree to be bound by these Terms & Conditions. If you disagree with any part of the terms, you may not access the service.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold border-l-4 border-primary pl-4">2. Use License</h2>
            <p className="font-google-sans text-lg text-muted-foreground leading-relaxed">
              Permission is granted to use the software for personal or commercial use related to managing your Telegram channels. This is the grant of a license, not a transfer of title.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold border-l-4 border-primary pl-4">3. Prohibited Activities</h2>
            <p className="font-google-sans text-lg text-muted-foreground leading-relaxed">
              You may not use our service for any illegal purposes, to distribute spam, or to violate Telegram's own Terms of Service. Any abuse will lead to immediate account termination.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold border-l-4 border-primary pl-4">4. Limitation of Liability</h2>
            <p className="font-google-sans text-lg text-muted-foreground leading-relaxed">
              Telegram Post Maker shall not be held liable for any damages arising out of the use or inability to use the services, even if we have been notified of the possibility of such damage.
            </p>
          </section>
        </div>
      </div>
    </AppLayout>
  );
}
