import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import Image from 'next/image';
import { Mail, MessageCircle, Send } from 'lucide-react';

export default function ContactPage() {
  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-12 py-12 font-google-sans">
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-mozilla-headline font-bold text-foreground">Get in Touch</h1>
          <p className="text-muted-foreground font-google-sans text-lg">We are here to help you scale your Telegram presence.</p>
        </div>

        <div className="relative aspect-[21/9] w-full overflow-hidden rounded-3xl border border-primary/10 shadow-2xl">
          <Image
            src="/images/contact_us.webp"
            alt="Contact Us"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
          <div className="group rounded-3xl border border-border p-8 space-y-6 bg-card hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-primary/5">
            <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 text-primary group-hover:scale-110 transition-transform">
              <Mail className="h-7 w-7" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold font-mozilla-headline">Email Support</h2>
              <p className="font-google-sans text-muted-foreground">
                For complex technical issues or business inquiries:
              </p>
              <p className="font-jetbrains-mono text-primary font-bold pt-2">
                support@tgpostmaker.com
              </p>
            </div>
          </div>

          <div className="group rounded-3xl border border-border p-8 space-y-6 bg-card hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-primary/5">
            <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-500/10 text-blue-500 group-hover:scale-110 transition-transform">
              <MessageCircle className="h-7 w-7" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold font-mozilla-headline">Telegram Direct</h2>
              <p className="font-google-sans text-muted-foreground">
                Instant chat with our automated support bot:
              </p>
              <p className="font-jetbrains-mono text-blue-500 font-bold pt-2">
                @PostMakerSupportBot
              </p>
            </div>
          </div>
        </section>

        <div className="p-8 md:p-12 bg-primary/5 rounded-3xl border border-primary/10 text-center">
          <h3 className="text-2xl font-bold mb-4 font-mozilla-headline italic">"Need a custom solution?"</h3>
          <p className="text-muted-foreground mb-8 font-google-sans">We offer enterprise-grade customization for large networks.</p>
          <button className="px-8 py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:scale-105 transition-transform flex items-center gap-2 mx-auto">
            <Send className="w-4 h-4" /> Message Developer
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
