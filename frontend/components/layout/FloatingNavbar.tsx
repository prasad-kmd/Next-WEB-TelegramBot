"use client";

import { useTheme } from "next-themes";
import { Sun, Moon, Share2, LayoutGrid, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { signOut, useSession } from 'next-auth/react';
import api from '@/lib/api';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface FloatingNavbarProps {
  className?: string;
  isMobileSidebar?: boolean;
}

export function FloatingNavbar({
  className,
  isMobileSidebar = false,
}: FloatingNavbarProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);
  const { data: session } = useSession();

  // Avoid hydration mismatch
  useEffect(() => {
    const timer = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(timer);
  }, []);

  if (!mounted) {
    return null;
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleLogout = async () => {
    if (session) {
      await signOut({ callbackUrl: '/login' });
    } else {
      await api.post('/auth/logout');
      window.location.href = '/login';
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: document.title,
      text: "Check out this Telegram Bot Manager!",
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareData.url);
        setCopied(true);
        toast.success("URL copied to clipboard");
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        console.error("Failed to copy URL:", error);
        toast.error("Failed to copy URL");
      }
    }
  };

  const navItems = [
    {
      icon: LayoutGrid,
      label: "Dashboard",
      href: "/",
    },
    {
      icon: Share2,
      label: copied ? "Copied!" : "Share",
      onClick: handleShare,
    },
    {
      icon: LogOut,
      label: "Logout",
      onClick: handleLogout,
      className: "text-destructive hover:text-destructive hover:bg-destructive/10"
    }
  ];

  return (
    <div
      className={cn(
        "flex items-center gap-1 transition-all google-sans",
        !isMobileSidebar &&
          "fixed top-6 right-6 z-[60] p-1 rounded-full border border-border bg-background/80 backdrop-blur shadow-lg",
        isMobileSidebar &&
          "relative flex-row p-0 border-none bg-transparent shadow-none",
        className,
      )}
    >
      {navItems.map((item) =>
        item.href ? (
          <Tooltip key={item.label} delayDuration={0}>
            <TooltipTrigger asChild>
              <Link
                href={item.href}
                className={cn(
                  "p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors relative group google-sans",
                  item.className
                )}
                aria-label={item.label}
              >
                <item.icon className="h-5 w-5" />
              </Link>
            </TooltipTrigger>
            {!isMobileSidebar && (
              <TooltipContent side="bottom" sideOffset={8}>
                {item.label}
              </TooltipContent>
            )}
          </Tooltip>
        ) : (
          <Tooltip key={item.label} delayDuration={0}>
            <TooltipTrigger asChild>
              <button
                onClick={item.onClick}
                className={cn(
                  "p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors relative group google-sans",
                  item.className
                )}
                aria-label={item.label}
              >
                <item.icon className="h-5 w-5" />
              </button>
            </TooltipTrigger>
            {!isMobileSidebar && (
              <TooltipContent side="bottom" sideOffset={8}>
                {item.label}
              </TooltipContent>
            )}
          </Tooltip>
        ),
      )}
      <hr className="h-4 w-[1px] bg-border mx-1" />
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors relative group google-sans"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5 animate-in zoom-in-50 duration-300" />
            ) : (
              <Moon className="h-5 w-5 animate-in zoom-in-50 duration-300" />
            )}
          </button>
        </TooltipTrigger>
        {!isMobileSidebar && (
          <TooltipContent side="bottom" sideOffset={8}>
            Toggle Theme
          </TooltipContent>
        )}
      </Tooltip>
    </div>
  );
}
