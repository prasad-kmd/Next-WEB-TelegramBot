import { PageLayout } from "@/components/layout/PageLayout";
import Image from "next/image";

export default function AboutPage() {
  return (
    <PageLayout isPublic className="py-20">
      <div className="space-y-12">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold mozilla-headline">About the Project</h1>
          <p className="text-xl text-muted-foreground google-sans leading-relaxed">
            A premium solution for Telegram content creators and channel administrators.
          </p>
        </div>

        <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-border bg-muted">
          <Image
            src="/images/about_us.webp"
            alt="About us"
            fill
            className="object-cover"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 google-sans">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mozilla-headline">The Mission</h2>
            <p className="text-foreground/80 leading-relaxed">
              Managing a Telegram channel shouldn&apos;t be a chore. Our tool is designed to provide a seamless, visual, and intuitive experience for composing and scheduling posts, allowing you to focus on creating great content while we handle the technicalities.
            </p>
          </div>
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mozilla-headline">The Creator</h2>
            <p className="text-foreground/80 leading-relaxed">
              Built by PrasadM, an engineering student passionate about creating high-fidelity digital tools and documenting engineering excellence. This project represents a fusion of technical precision and elegant design.
            </p>
          </div>
        </div>

        <div className="rounded-2xl bg-card border border-border p-8 text-center space-y-4">
          <h2 className="text-xl font-bold mozilla-headline">Want to contribute?</h2>
          <p className="text-muted-foreground google-sans max-w-2xl mx-auto">
            This project is open-source. You can find the source code and contribute to its development on GitHub.
          </p>
          <div className="pt-4">
            <a
              href="https://github.com/prasad-kmd/Next-WEB-TelegramBot"
              target="_blank"
              className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-2.5 text-sm font-bold text-primary-foreground shadow-sm transition-all hover:bg-primary/90"
            >
              View on GitHub
            </a>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
