"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  FileText,
  Settings,
  LogOut,
  Share2,
  ChevronLeft,
  ChevronRight,
  PanelLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/components/providers/SidebarProvider";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const navItems = [
  { name: "Composer", href: "/", icon: LayoutDashboard },
  { name: "Scheduled", href: "/scheduled", icon: Calendar },
  { name: "Templates", href: "/templates", icon: FileText },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { isCollapsed, toggleSidebar } = useSidebar();

  const renderNavItem = (item: (typeof navItems)[0]) => {
    const Icon = item.icon;
    const isActive = pathname === item.href;

    return (
      <Tooltip key={item.name} delayDuration={0}>
        <TooltipTrigger asChild>
          <Link
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-all relative group google-sans",
              isActive
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
              isCollapsed ? "justify-center px-2" : "justify-start",
            )}
          >
            <Icon size={18} className="shrink-0" />
            <span
              className={cn(
                "transition-opacity duration-300 whitespace-nowrap overflow-hidden",
                isCollapsed ? "opacity-0 w-0" : "opacity-100 w-auto",
              )}
            >
              {item.name}
            </span>
          </Link>
        </TooltipTrigger>
        {isCollapsed && (
          <TooltipContent side="right" className="ml-2">
            {item.name}
          </TooltipContent>
        )}
      </Tooltip>
    );
  };

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-40 border-r border-border bg-card/70 backdrop-blur-xl transition-all duration-300 ease-in-out lg:translate-x-0 h-full flex flex-col",
        isCollapsed ? "w-20" : "w-64",
      )}
    >
      {/* Collapse Toggle */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-20 z-50 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-card text-muted-foreground hover:text-foreground shadow-sm transition-transform hover:scale-110"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Logo Section */}
      <div
        className={cn(
          "border-b border-border py-6 flex items-center transition-all duration-300",
          isCollapsed ? "px-4 justify-center" : "px-6",
        )}
      >
        <Link href="/" className="flex items-center gap-3">
          <PanelLeft className="h-6 w-6 text-primary shrink-0" />
          {!isCollapsed && (
            <div className="animate-in fade-in slide-in-from-left-2 duration-300">
              <h1 className="text-xl font-bold leading-tight mozilla-headline">
                PostMaker
              </h1>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest google-sans">
                Telegram CMS
              </p>
            </div>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto scrollbar-none">
        {navItems.map(renderNavItem)}
      </nav>

      {/* Footer / Logout */}
      <div className="p-3 border-t border-border">
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <button
              className={cn(
                "flex items-center gap-3 px-4 py-2 w-full rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors google-sans",
                isCollapsed ? "justify-center px-2" : "justify-start",
              )}
            >
              <LogOut size={18} className="shrink-0" />
              {!isCollapsed && <span>Logout</span>}
            </button>
          </TooltipTrigger>
          {isCollapsed && (
            <TooltipContent side="right" className="ml-2">
              Logout
            </TooltipContent>
          )}
        </Tooltip>
      </div>
    </aside>
  );
}
