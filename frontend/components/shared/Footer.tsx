"use client";

import Link from "next/link";
import { MessageCircle, Mail, Globe, Shield, Info, Send } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: "Product",
      links: [
        { label: "Features", href: "/#features" },
        { label: "Dashboard", href: "/" },
        { label: "Scheduled", href: "/scheduled" },
        { label: "Templates", href: "/templates" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Terms & Conditions", href: "/terms" },
        { label: "Disclaimer", href: "/disclaimer" },
      ],
    },
    {
      title: "Support",
      links: [
        { label: "About Us", href: "/about" },
        { label: "Contact", href: "/contact" },
        { label: "Documentation", href: "/docs" },
      ],
    },
  ];

  const socialLinks = [
    { icon: MessageCircle, href: "#", label: "Telegram" },
    { icon: Mail, href: "mailto:support@telegrampostmaker.com", label: "Email" },
    { icon: Globe, href: "#", label: "Website" },
  ];

  return (
    <footer className="w-full border-t border-border bg-card/30 backdrop-blur-sm mt-auto font-google-sans">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                Telegram Post Maker
              </span>
            </Link>
            <p className="text-muted-foreground max-w-xs mb-6 font-google-sans text-sm">
              The ultimate tool for managing and scheduling your Telegram channel content with ease and precision.
            </p>
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold mb-4 text-foreground">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors font-google-sans"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground font-google-sans">
            © {currentYear} Telegram Post Maker. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-xs text-muted-foreground/60 font-jetbrains-mono uppercase tracking-widest">
              Premium Content Management
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
