import { PageLayout } from "@/components/layout/PageLayout";
import Image from "next/image";
import { Mail, Github, Twitter, Linkedin } from "lucide-react";

export default function ContactPage() {
  const socials = [
    { name: "Email", icon: Mail, value: "contact@prasad-kmd.me", href: "mailto:contact@prasad-kmd.me" },
    { name: "GitHub", icon: Github, value: "@prasad-kmd", href: "https://github.com/prasad-kmd" },
    { name: "Twitter", icon: Twitter, value: "@prasad_kmd", href: "https://twitter.com/prasad_kmd" },
    { name: "LinkedIn", icon: Linkedin, value: "PrasadM", href: "https://linkedin.com/in/prasad-kmd" },
  ];

  return (
    <PageLayout isPublic className="py-20">
      <div className="space-y-12">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold mozilla-headline">Get in Touch</h1>
          <p className="text-xl text-muted-foreground google-sans">
            Have questions or feedback? We&apos;d love to hear from you.
          </p>
        </div>

        <div className="relative aspect-[21/9] w-full overflow-hidden rounded-2xl border border-border bg-muted">
          <Image
            src="/images/contact_us.webp"
            alt="Contact us"
            fill
            className="object-cover"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {socials.map((item) => (
            <a
              key={item.name}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:bg-primary/5 shadow-sm"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <item.icon className="h-6 w-6" />
              </div>
              <div className="google-sans">
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">{item.name}</p>
                <p className="text-lg font-medium text-foreground">{item.value}</p>
              </div>
            </a>
          ))}
        </div>

        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-8 text-center space-y-4">
          <p className="text-amber-600 dark:text-amber-400 font-medium google-sans">
            Note: For technical issues, please open an issue on our GitHub repository for faster resolution.
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
