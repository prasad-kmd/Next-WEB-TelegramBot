import React from 'react';
import AppLayout from '@/components/layout/AppLayout';

export default function Disclaimer() {
  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-10 py-12 font-google-sans">
        <div className="space-y-4 text-center">
          <h1 className="text-5xl font-mozilla-headline font-bold text-foreground">Disclaimer</h1>
          <p className="text-muted-foreground font-jetbrains-mono text-sm uppercase tracking-widest">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="grid gap-12 pt-8">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold border-l-4 border-amber-500 pl-4">General Information</h2>
            <p className="font-google-sans text-lg text-muted-foreground leading-relaxed">
              The information provided by Telegram Post Maker ("we," "us," or "our") on our application is for general informational purposes only.
            </p>
          </section>

          <section className="space-y-4">
             <h2 className="text-2xl font-bold border-l-4 border-amber-500 pl-4">No Warranties</h2>
             <p className="font-google-sans text-lg text-muted-foreground leading-relaxed">
              All information on the site is provided in good faith, however we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the site.
            </p>
          </section>

          <section className="space-y-4">
             <h2 className="text-2xl font-bold border-l-4 border-amber-500 pl-4">Risk Disclosure</h2>
             <p className="font-google-sans text-lg text-muted-foreground leading-relaxed">
              Under no circumstance shall we have any liability to you for any loss or damage of any kind incurred as a result of the use of the site or reliance on any information provided on the site. Your use of the site and your reliance on any information on the site is solely at your own risk.
            </p>
          </section>

          <section className="space-y-4 border-t pt-8">
             <p className="font-jetbrains-mono text-xs text-muted-foreground opacity-60">
               Telegram is a registered trademark of Telegram FZ-LLC. This application is not affiliated with or endorsed by Telegram.
             </p>
          </section>
        </div>
      </div>
    </AppLayout>
  );
}
