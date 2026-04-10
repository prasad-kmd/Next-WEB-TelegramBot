import { TooltipProvider } from "@/components/ui/tooltip"
import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";
import { CommandPalette } from "@/components/layout/CommandPalette";

export const metadata: Metadata = {
  title: "Telegram Post Maker",
  description: "Compose and schedule Telegram posts visually",
  icons: {
    icon: [
      { url: "/images/favicon/TG-post-bot-prasadm-16.png", sizes: "16x16", type: "image/png" },
      { url: "/images/favicon/TG-post-bot-prasadm-32.png", sizes: "32x32", type: "image/png" },
      { url: "/images/favicon/TG-post-bot-prasadm-96.png", sizes: "96x96", type: "image/png" },
      { url: "/images/favicon/TG-post-bot-prasadm-128.png", sizes: "128x128", type: "image/png" },
    ],
    apple: [
      { url: "/images/favicon/TG-post-bot-prasadm-256.png", sizes: "256x256", type: "image/png" },
    ],
    shortcut: "/images/favicon/TG-post-bot-prasadm-32.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <TooltipProvider>
              {children}
              <CommandPalette />
              <Toaster position="top-right" richColors />
            </TooltipProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
