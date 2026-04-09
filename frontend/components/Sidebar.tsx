'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Calendar, FileText, Settings, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Composer', href: '/', icon: LayoutDashboard },
  { name: 'Scheduled', href: '/scheduled', icon: Calendar },
  { name: 'Templates', href: '/templates', icon: FileText },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-white border-r min-h-screen p-4 flex flex-col">
      <div className="text-xl font-bold px-4 mb-8 text-blue-600 flex items-center gap-2">
        <Share2 size={24} />
        PostMaker
      </div>
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                pathname === item.href
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-600 hover:bg-gray-100"
              )}
            >
              <Icon size={18} />
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="pt-4 border-t">
        <button className="flex items-center gap-3 px-4 py-2 w-full rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );
}

import { Share2 } from 'lucide-react';
