import { PageLayout } from "@/components/layout/PageLayout";

export default function PrivacyPage() {
  return (
    <PageLayout isPublic className="py-20">
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold mozilla-headline">Privacy Policy</h1>
          <p className="text-muted-foreground google-sans">How we handle your data</p>
        </div>

        <div className="prose prose-sm dark:prose-invert max-w-none google-sans space-y-6 text-foreground/80">
          <section>
            <h2 className="text-xl font-bold text-foreground mozilla-headline">Data Collection</h2>
            <p>
              We prioritize your privacy. The Telegram Bot Manager does not store your personal messages or sensitive information on our servers. We only store the data necessary for the application to function, such as your bot token and scheduled posts.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mozilla-headline">Third-Party Services</h2>
            <p>
              Our service interacts with Telegram&apos;s API. By using this application, you also agree to Telegram&apos;s Privacy Policy. We do not share your data with any other third parties.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mozilla-headline">Cookies</h2>
            <p>
              We use essential cookies to maintain your session and authentication state. These cookies are necessary for the security and functionality of the application.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mozilla-headline">Changes</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
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
