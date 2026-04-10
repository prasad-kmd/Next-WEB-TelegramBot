'use client';

import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger
} from '@/components/ui/hover-card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { LogOut, User, Link as LinkIcon } from 'lucide-react';
import { usePathname } from 'next/navigation';
import api from '@/lib/api';
import { cn } from '@/lib/utils';

export default function Header() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [tgInfo, setTgInfo] = useState<{username?: string} | null>(null);
  const [botInfo, setBotInfo] = useState<{username?: string, connected: boolean}>({ connected: false });

  useEffect(() => {
    if (session?.user?.email) {
      api.get('/auth/tg-link-info', { headers: { 'x-user-email': session.user.email } })
        .then(res => setTgInfo(res.data))
        .catch(() => {});
    }
  }, [session]);

  useEffect(() => {
    api.get('/api/bot-info')
      .then(res => setBotInfo(res.data))
      .catch(() => setBotInfo({ connected: false }));
  }, []);

  const getBreadcrumbs = () => {
    const paths = pathname ? pathname.split('/').filter(p => p) : [];
    if (paths.length === 0) return [{ name: 'Dashboard', href: '/', current: true }];

    return [
      { name: 'Dashboard', href: '/', current: false },
      ...paths.map((p, i) => ({
        name: p.charAt(0).toUpperCase() + p.slice(1),
        href: `/${paths.slice(0, i + 1).join('/')}`,
        current: i === paths.length - 1
      }))
    ];
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="flex h-16 items-center justify-between border-b bg-card px-8 font-google-sans">
      <div className="flex items-center gap-4">
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((bc, i) => (
              <div key={bc.href} className="flex items-center">
                <BreadcrumbItem>
                  {bc.current ? (
                    <BreadcrumbPage className="font-bold">{bc.name}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink href={bc.href}>{bc.name}</BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {i < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
              </div>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex items-center gap-4">
        <Tooltip>
          <TooltipTrigger>
            <div className="flex items-center gap-2 cursor-help">
              <div className={cn(
                "h-2 w-2 rounded-full shadow-[0_0_8px]",
                botInfo.connected ? "bg-green-500 shadow-green-500/50" : "bg-red-500 shadow-red-500/50"
              )} />
              <span className="text-xs font-jetbrains-mono text-muted-foreground">Bot: @{botInfo.username || '...'}</span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            {botInfo.connected ? "Bot Connected" : "Bot Disconnected"}
          </TooltipContent>
        </Tooltip>

        <HoverCard >
          <HoverCardTrigger>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8 border border-primary/20">
                <AvatarImage src="" alt={session?.user?.name || "User"} />
                <AvatarFallback className="bg-primary/10 text-primary font-bold">
                  {session?.user?.name?.charAt(0) || <User size={16} />}
                </AvatarFallback>
              </Avatar>
            </Button>
          </HoverCardTrigger>
          <HoverCardContent className="w-80 rounded-2xl shadow-2xl border-primary/10" align="end">
            <div className="flex justify-between space-x-4">
              <Avatar>
                <AvatarFallback className="bg-primary/10 text-primary font-bold">
                  {session?.user?.name?.charAt(0) || <User size={20} />}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1 flex-1">
                <h4 className="text-sm font-bold font-google-sans">{session?.user?.name || "User"}</h4>
                <p className="text-xs text-muted-foreground font-jetbrains-mono">{session?.user?.email}</p>
                {tgInfo?.username && (
                  <div className="flex items-center gap-1 pt-2 text-xs text-blue-600 font-google-sans">
                    <LinkIcon size={12} />
                    <span>Linked: @{tgInfo.username}</span>
                  </div>
                )}
                <div className="pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-red-600 hover:bg-red-50 rounded-xl"
                    onClick={() => session ? signOut({ callbackUrl: '/login' }) : (window.location.href = '/login')}
                  >
                    <LogOut size={14} className="mr-2" />
                    Sign Out
                  </Button>
                </div>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      </div>
    </header>
  );
}
