import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-mozilla-headline font-bold">About Telegram Post Maker</h1>

        <div className="relative aspect-video w-full overflow-hidden rounded-xl border">
          <Image
            src="/images/about_us.webp"
            alt="About Us"
            fill
            className="object-cover"
          />
        </div>

        <section className="space-y-4">
          <p className="font-mozilla-text text-lg leading-relaxed">
            Telegram Post Maker is a powerful tool designed to help content creators, community managers, and businesses
            streamline their Telegram presence. Our mission is to provide an intuitive interface for composing and
            scheduling posts, allowing you to focus on creating great content while we handle the delivery.
          </p>
          <p className="font-mozilla-text text-lg leading-relaxed">
            Whether you're managing a single channel or a large network, our tool provides the features you need to
            maintain a consistent posting schedule and engage your audience effectively.
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
