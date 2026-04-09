'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import {
  LayoutDashboard,
  Calendar,
  FileText,
  Settings,
  LogOut,
  Share2,
  ChevronLeft,
  ChevronRight,
  User,
  ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

const navItems = [
  { name: 'Composer', href: '/', icon: LayoutDashboard },
  { name: 'Scheduled', href: '/scheduled', icon: Calendar },
  { name: 'Templates', href: '/templates', icon: FileText },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = async () => {
    await signOut({ redirect: false });
    // Also clear the custom tg token cookie
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router.push('/login');
  };

  return (
    <div className={cn(
      "bg-white border-r min-h-screen p-4 flex flex-col transition-all duration-300",
      isCollapsed ? "w-20" : "w-64"
    )}>
      <div className="flex items-center justify-between mb-8 px-2">
        {!isCollapsed && (
          <div className="text-xl font-bold text-blue-600 flex items-center gap-2 overflow-hidden whitespace-nowrap">
            <Share2 size={24} className="shrink-0" />
            <span>PostMaker</span>
          </div>
        )}
        {isCollapsed && <Share2 size={24} className="text-blue-600 mx-auto" />}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:flex"
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </Button>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Tooltip key={item.name}>
              <TooltipTrigger>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-600 hover:bg-gray-100",
                    isCollapsed && "justify-center px-0"
                  )}
                >
                  <Icon size={18} className="shrink-0" />
                  {!isCollapsed && <span>{item.name}</span>}
                </Link>
              </TooltipTrigger>
              {isCollapsed && <TooltipContent side="right">{item.name}</TooltipContent>}
            </Tooltip>
          );
        })}
      </nav>

      <div className="pt-4 border-t space-y-4">
        <HoverCard>
          <HoverCardTrigger>
            <div className={cn(
              "flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors",
              isCollapsed && "justify-center"
            )}>
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-blue-100 text-blue-700">
                  <User size={16} />
                </AvatarFallback>
              </Avatar>
              {!isCollapsed && (
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-medium truncate">{session?.user?.name || 'User'}</span>
                  <span className="text-xs text-gray-500 truncate">{session?.user?.email}</span>
                </div>
              )}
            </div>
          </HoverCardTrigger>
          <HoverCardContent side={isCollapsed ? "right" : "top"} align="start" className="w-64">
            <div className="space-y-2">
              <div className="font-medium text-sm">{session?.user?.name}</div>
              <div className="text-xs text-gray-500">{session?.user?.email}</div>
              <div className="border-t pt-2 mt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={handleLogout}
                >
                  <LogOut size={16} className="mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      </div>
    </div>
  );
}
