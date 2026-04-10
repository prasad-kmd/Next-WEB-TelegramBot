import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, MessageCircle } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background text-foreground p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-mozilla-headline font-bold">Contact Us</h1>

        <div className="relative aspect-video w-full overflow-hidden rounded-xl border">
          <Image
            src="/images/contact_us.webp"
            alt="Contact Us"
            fill
            className="object-cover"
          />
        </div>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="rounded-xl border p-6 space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-semibold">Email</h2>
            </div>
            <p className="font-mozilla-text">
              For support or inquiries, email us at:<br />
              <span className="font-mono text-primary">support@telegrampostmaker.com</span>
            </p>
          </div>

          <div className="rounded-xl border p-6 space-y-4">
            <div className="flex items-center gap-3">
              <MessageCircle className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-semibold">Telegram</h2>
            </div>
            <p className="font-mozilla-text">
              Join our support channel or message our bot:<br />
              <span className="font-mono text-primary">@PostMakerSupportBot</span>
            </p>
          </div>
        </section>

        <div className="pt-8 text-center">
          <Link href="/login" className="text-primary hover:underline font-medium">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
