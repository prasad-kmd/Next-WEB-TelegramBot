import { PageLayout } from "@/components/layout/PageLayout";

export default function TermsPage() {
  return (
    <PageLayout isPublic className="py-20">
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold mozilla-headline">Terms & Conditions</h1>
          <p className="text-muted-foreground google-sans">Rules for using our service</p>
        </div>

        <div className="prose prose-sm dark:prose-invert max-w-none google-sans space-y-6 text-foreground/80">
          <section>
            <h2 className="text-xl font-bold text-foreground mozilla-headline">Agreement</h2>
            <p>
              By accessing this application, you are agreeing to be bound by these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mozilla-headline">Use License</h2>
            <p>
              Permission is granted to temporarily use this application for personal or commercial Telegram content management. This is the grant of a license, not a transfer of title.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mozilla-headline">Prohibited Use</h2>
            <p>
              You may not use this application to send spam, malicious content, or any material that violates Telegram&apos;s community guidelines.
            </p>
          </section>

          <p className="text-xs pt-8 border-t border-border">
            Last updated: April 2026
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
