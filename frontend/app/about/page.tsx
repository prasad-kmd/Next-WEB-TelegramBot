import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-12 py-12 font-google-sans">
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-mozilla-headline font-bold text-foreground">Our Story</h1>
          <p className="text-muted-foreground font-google-sans text-lg">Empowering creators to broadcast with precision.</p>
        </div>

        <div className="relative aspect-[21/9] w-full overflow-hidden rounded-3xl border border-primary/10 shadow-2xl">
          <Image
            src="/images/about_us.webp"
            alt="About Us"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>

        <section className="grid gap-8">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold font-mozilla-headline">Broadcasting Redefined</h2>
            <p className="font-google-sans text-xl text-muted-foreground leading-relaxed">
              Telegram Post Maker is a powerful tool designed to help content creators, community managers, and businesses
              streamline their Telegram presence. Our mission is to provide an intuitive interface for composing and
              scheduling posts, allowing you to focus on creating great content while we handle the delivery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
            <div className="p-8 bg-card rounded-3xl border border-border">
              <h3 className="text-xl font-bold mb-4">Our Vision</h3>
              <p className="text-muted-foreground font-google-sans">To be the most trusted and efficient Telegram management platform globally.</p>
            </div>
            <div className="p-8 bg-card rounded-3xl border border-border">
              <h3 className="text-xl font-bold mb-4">Our Values</h3>
              <p className="text-muted-foreground font-google-sans">Security first, user-centric design, and relentless performance optimization.</p>
            </div>
          </div>
        </section>

        <div className="pt-20 text-center">
           <p className="text-xs text-muted-foreground font-jetbrains-mono uppercase tracking-[0.3em] opacity-40">Founded by PRASADM</p>
        </div>
      </div>
    </AppLayout>
  );
}
