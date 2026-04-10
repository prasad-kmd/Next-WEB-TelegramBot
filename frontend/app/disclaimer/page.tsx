import { PageLayout } from "@/components/layout/PageLayout";

export default function DisclaimerPage() {
  return (
    <PageLayout isPublic className="py-20">
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold mozilla-headline">Disclaimer</h1>
          <p className="text-muted-foreground google-sans">Legal notices and limitations</p>
        </div>

        <div className="prose prose-sm dark:prose-invert max-w-none google-sans space-y-6 text-foreground/80">
          <section>
            <h2 className="text-xl font-bold text-foreground mozilla-headline">No Warranties</h2>
            <p>
              This application is provided &quot;as is&quot; without any representations or warranties, express or implied. The creator makes no representations or warranties in relation to this application or the information and materials provided.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mozilla-headline">Limitation of Liability</h2>
            <p>
              The creator will not be liable to you in relation to the contents of, or use of, or otherwise in connection with, this application for any direct, indirect, special or consequential loss.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mozilla-headline">Telegram Terms</h2>
            <p>
              Users are responsible for ensuring their use of this tool complies with Telegram&apos;s Terms of Service and API usage policies. We are not responsible for any actions taken by Telegram against your account or bot.
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
