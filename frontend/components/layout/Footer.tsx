"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Github,
  Twitter,
  Linkedin,
  Mail,
  ArrowUpRight,
  Globe,
  Shield,
  Terminal,
} from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = {
    github: "https://github.com/prasad-kmd",
    twitter: "https://twitter.com/prasad_kmd",
    linkedin: "https://linkedin.com/in/prasad-kmd",
  };

  return (
    <footer className="relative border-t border-border bg-card/30 backdrop-blur-md overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl translate-y-1/2 pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-6 pt-16 pb-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4 lg:grid-cols-5">
          {/* Logo and Brand Identity */}
          <div className="md:col-span-2 lg:col-span-2">
            <Link href="/" className="group flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 transition-all group-hover:bg-primary shadow-sm overflow-hidden p-1.5">
                <Image
                  src="/images/favicon/TG-post-bot-prasadm-256.png"
                  alt="Logo"
                  width={32}
                  height={32}
                  className="h-full w-full object-contain"
                />
              </div>
              <div>
                <span className="text-2xl font-bold mozilla-headline tracking-tight">
                  PrasadM
                </span>
                <p className="text-[10px] uppercase tracking-[0.2em] text-primary/80 font-bold google-sans">
                  Telegram Bot Manager
                </p>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground google-sans leading-relaxed max-w-sm mb-6">
              Advanced Telegram post management system. Schedule, format, and manage your content with precision and ease.
            </p>
            <div className="flex gap-3">
              {[
                {
                  icon: Github,
                  href: socialLinks.github,
                  label: "GitHub",
                },
                {
                  icon: Twitter,
                  href: socialLinks.twitter,
                  label: "Twitter",
                },
                {
                  icon: Linkedin,
                  href: socialLinks.linkedin,
                  label: "LinkedIn",
                },
                { icon: Mail, href: "/contact", label: "Contact" },
              ].map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  aria-label={social.label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background/50 text-muted-foreground transition-all hover:border-primary/50 hover:bg-primary/10 hover:text-primary"
                >
                  <social.icon className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="text-sm font-bold mb-6 mozilla-headline uppercase tracking-widest flex items-center gap-2">
              <Terminal className="h-4 w-4 text-primary" /> App
            </h3>
            <ul className="space-y-4">
              {[
                { name: "Dashboard", href: "/" },
                { name: "Scheduled", href: "/scheduled" },
                { name: "Templates", href: "/templates" },
                { name: "Settings", href: "/settings" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="group flex items-center text-sm text-muted-foreground hover:text-primary transition-colors google-sans"
                  >
                    {link.name}
                    <ArrowUpRight className="h-3 w-3 ml-1 opacity-0 -translate-y-1 transition-all group-hover:opacity-100 group-hover:translate-y-0" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Project Context */}
          <div>
            <h3 className="text-sm font-bold mb-6 mozilla-headline uppercase tracking-widest flex items-center gap-2">
              <Globe className="h-4 w-4 text-primary" /> Info
            </h3>
            <ul className="space-y-4">
              {[
                { name: "About", href: "/about" },
                { name: "Contact", href: "/contact" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="group flex items-center text-sm text-muted-foreground hover:text-primary transition-colors google-sans"
                  >
                    {link.name}
                    <ArrowUpRight className="h-3 w-3 ml-1 opacity-0 -translate-y-1 transition-all group-hover:opacity-100 group-hover:translate-y-0" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal and Technical */}
          <div>
            <h3 className="text-sm font-bold mb-6 mozilla-headline uppercase tracking-widest flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" /> Legal
            </h3>
            <ul className="space-y-4">
              {[
                { name: "Privacy Policy", href: "/privacy" },
                { name: "Terms of Service", href: "/terms" },
                { name: "Disclaimer", href: "/disclaimer" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="group flex items-center text-sm text-muted-foreground hover:text-primary transition-colors google-sans"
                  >
                    {link.name}
                    <ArrowUpRight className="h-3 w-3 ml-1 opacity-0 -translate-y-1 transition-all group-hover:opacity-100 group-hover:translate-y-0" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col items-center md:items-start gap-1">
            <p className="text-xs text-muted-foreground google-sans">
              © {currentYear} PrasadM. Engineered for Excellence.
            </p>
            <p className="text-[10px] text-muted-foreground/60 font-mono tracking-tight uppercase">
              Built with Next.js 16 & Tailwind CSS 4
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
