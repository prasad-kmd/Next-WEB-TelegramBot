'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  Calculator,
  Calendar,
  CreditCard,
  Settings,
  Smile,
  User,
  Plus,
  FileText,
  LogOut,
  Search,
  LayoutDashboard
} from 'lucide-react';

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command';
import { signOut, useSession } from 'next-auth/react';
import api from '@/lib/api';

export function CommandPalette() {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const runCommand = React.useCallback((command: () => void) => {
    setOpen(false);
    command();
  }, []);

  const handleLogout = async () => {
    if (session) {
      await signOut({ callbackUrl: '/login' });
    } else {
      await api.post('/auth/logout');
      window.location.href = '/login';
    }
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Actions">
          <CommandItem onSelect={() => runCommand(() => router.push('/'))}>
            <Plus className="mr-2 h-4 w-4" />
            <span>New Post</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push('/scheduled'))}>
            <Calendar className="mr-2 h-4 w-4" />
            <span>Go to Scheduled</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push('/templates'))}>
            <FileText className="mr-2 h-4 w-4" />
            <span>Go to Templates</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Settings">
          <CommandItem onSelect={() => runCommand(() => router.push('/settings'))}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Go to Settings</span>
            <CommandShortcut>⌘S</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(handleLogout)}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Logout</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
