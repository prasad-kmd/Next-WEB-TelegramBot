"use client";
import { useTheme } from "next-themes";
import {
  Sun,
  Moon,
  Bookmark,
  Share2,
  LayoutGrid,
  Calendar,
  Settings,
  LayoutDashboard,
  LogOut,
  FileText
} from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { signOut, useSession } from "next-auth/react";

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
  const { data: session } = useSession();
  const [copied, setCopied] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleShare = async () => {
    const shareData = {
      title: document.title,
      text: "Check out Telegram Post Maker!",
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
      icon: LayoutDashboard,
      label: "Dashboard",
      href: "/",
    },
    {
      icon: Calendar,
      label: "Scheduled",
      href: "/scheduled",
    },
    {
      icon: FileText,
      label: "Templates",
      href: "/templates",
    },
    {
      icon: Settings,
      label: "Settings",
      href: "/settings",
    },
    {
      icon: Share2,
      label: copied ? "Copied!" : "Share",
      onClick: handleShare,
    },
  ];

  return (
    <div
      className={cn(
        "flex items-center gap-1 transition-all font-google-sans",
        !isMobileSidebar &&
        "fixed top-6 left-1/2 -translate-x-1/2 z-[60] p-1.5 rounded-full border border-border bg-card/80 backdrop-blur-md shadow-2xl",
        isMobileSidebar &&
        "relative flex-row p-0 border-none bg-transparent shadow-none",
        className,
      )}
    >
      <div className="flex items-center gap-1">
        {navItems.map((item) =>
          item.href ? (
            <Tooltip key={item.label} delayDuration={0}>
              <TooltipTrigger>
                <Link
                  href={item.href}
                  className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-all duration-300 relative group"
                  aria-label={item.label}
                >
                  <item.icon className="h-5 w-5" />
                </Link>
              </TooltipTrigger>
              {!isMobileSidebar && (
                <TooltipContent side="bottom" sideOffset={12} className="font-google-sans">
                  {item.label}
                </TooltipContent>
              )}
            </Tooltip>
          ) : (
            <Tooltip key={item.label} delayDuration={0}>
              <TooltipTrigger>
                <button
                  onClick={item.onClick}
                  className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-all duration-300 relative group"
                  aria-label={item.label}
                >
                  <item.icon className="h-5 w-5" />
                </button>
              </TooltipTrigger>
              {!isMobileSidebar && (
                <TooltipContent side="bottom" sideOffset={12} className="font-google-sans">
                  {item.label}
                </TooltipContent>
              )}
            </Tooltip>
          ),
        )}
      </div>

      <div className="h-5 w-[1px] bg-border mx-2" />

      <div className="flex items-center gap-1">
        <Tooltip delayDuration={0}>
          <TooltipTrigger>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-all duration-300 relative group"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5 animate-in zoom-in-50 duration-500" />
              ) : (
                <Moon className="h-5 w-5 animate-in zoom-in-50 duration-500" />
              )}
            </button>
          </TooltipTrigger>
          {!isMobileSidebar && (
            <TooltipContent side="bottom" sideOffset={12} className="font-google-sans">
              Toggle Theme
            </TooltipContent>
          )}
        </Tooltip>

        <Tooltip delayDuration={0}>
          <TooltipTrigger>
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="p-2 rounded-full hover:bg-red-500/10 text-red-500 transition-all duration-300 relative group"
              aria-label="Sign Out"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </TooltipTrigger>
          {!isMobileSidebar && (
            <TooltipContent side="bottom" sideOffset={12} className="font-google-sans">
              Sign Out
            </TooltipContent>
          )}
        </Tooltip>
      </div>
    </div>
  );
}
