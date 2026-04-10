import { TooltipProvider } from "@/components/ui/tooltip"
import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { Toaster } from "@/components/ui/sonner";
import { CommandPalette } from "@/components/layout/CommandPalette";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

export const metadata: Metadata = {
  title: "Telegram Post Maker",
  description: "Compose and schedule Telegram posts visually",
  icons: {
    icon: [
      { url: '/images/favicon/TG-post-bot-prasadm-16.webp', sizes: '16x16', type: 'image/webp' },
      { url: '/images/favicon/TG-post-bot-prasadm-32.webp', sizes: '32x32', type: 'image/webp' },
      { url: '/images/favicon/TG-post-bot-prasadm-48.webp', sizes: '48x48', type: 'image/webp' },
      { url: '/images/favicon/TG-post-bot-prasadm-16.ico', sizes: '16x16', type: 'image/x-icon' },
      { url: '/images/favicon/TG-post-bot-prasadm-32.ico', sizes: '32x32', type: 'image/x-icon' },
      { url: '/images/favicon/TG-post-bot-prasadm-48.ico', sizes: '48x48', type: 'image/x-icon' },
    ],
    apple: [
      { url: '/images/favicon/TG-post-bot-prasadm-128.webp', sizes: '128x128', type: 'image/webp' },
      { url: '/images/favicon/TG-post-bot-prasadm-256.webp', sizes: '256x256', type: 'image/webp' },
    ],
    shortcut: '/images/favicon/TG-post-bot-prasadm-512.webp',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased font-sans">
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
