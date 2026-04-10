'use client';

import { FloatingNavbar } from '@/components/shared/FloatingNavbar';
import { Footer } from '@/components/shared/Footer';
import ClickSpark from '@/components/shared/ClickSpark';
import CustomContextMenu from '@/components/shared/CustomContextMenu';
import { usePathname } from 'next/navigation';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === '/login' || pathname?.startsWith('/api/auth');
  const isPublicPage = ['/privacy', '/terms', '/disclaimer', '/about', '/contact'].includes(pathname || '');

  // For the login page, we want a clean layout but still with Spark effect
  if (isAuthPage) {
    return (
      <div className="min-h-screen bg-black">
        <ClickSpark
          sparkColor="rgba(255, 255, 255, 0.5)"
          sparkSize={10}
          sparkRadius={15}
          sparkCount={8}
          duration={400}
        />
        <CustomContextMenu />
        {children}
      </div>
    );
  }

  // For Dashboard and Public pages
  return (
    <div className="flex flex-col min-h-screen bg-background transition-colors duration-500 font-google-sans">
      <ClickSpark
        sparkColor="var(--primary)"
        sparkSize={12}
        sparkRadius={20}
        sparkCount={10}
        duration={500}
      />
      <CustomContextMenu />

      {/* Premium Floating Navbar */}
      <FloatingNavbar />

      {/* Main Content Area */}
      <main className="flex-1 pt-24 pb-12 px-4 md:px-8">
        <div className="mx-auto max-w-7xl">
          {children}
        </div>
      </main>

      {/* Premium Footer */}
      <Footer />
    </div>
  );
}
