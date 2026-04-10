import { TooltipProvider } from "@/components/ui/tooltip"
import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { SidebarProvider } from "@/components/providers/SidebarProvider";
import { Toaster } from "@/components/ui/sonner";
import { CommandPalette } from "@/components/layout/CommandPalette";
import { ConnectivityListener } from "@/components/layout/ConnectivityListener";
import { CustomContextMenu } from "@/components/layout/CustomContextMenu";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import { ClickSpark } from "@/components/layout/ClickSpark";

export const metadata: Metadata = {
  title: "Telegram Post Maker",
  description: "Compose and schedule Telegram posts visually",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased font-sans">
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <SidebarProvider>
              <TooltipProvider delayDuration={0}>
                <ClickSpark
                  sparkColor="var(--primary)"
                  sparkSize={10}
                  sparkRadius={15}
                  sparkCount={8}
                  duration={400}
                >
                  <div className="min-h-screen">
                    {children}
                  </div>
                </ClickSpark>
                <CommandPalette />
                <Toaster position="top-right" richColors />
                <ConnectivityListener />
                <CustomContextMenu />
                <ScrollToTop />
              </TooltipProvider>
            </SidebarProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
