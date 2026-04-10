import React from 'react';
import Link from 'next/link';

export default function Disclaimer() {
  return (
    <div className="min-h-screen bg-background text-foreground p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-4xl font-mozilla-headline font-bold">Disclaimer</h1>
        <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>

        <section className="space-y-4">
          <p className="font-mozilla-text">
            The information provided by Telegram Post Maker ("we," "us," or "our") on our application is for general informational purposes only.
          </p>
          <p className="font-mozilla-text">
            All information on the site is provided in good faith, however we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the site.
          </p>
          <p className="font-mozilla-text">
            Under no circumstance shall we have any liability to you for any loss or damage of any kind incurred as a result of the use of the site or reliance on any information provided on the site. Your use of the site and your reliance on any information on the site is solely at your own risk.
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
