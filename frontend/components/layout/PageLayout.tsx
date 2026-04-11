import Sidebar from "@/components/Sidebar";
import { FloatingNavbar } from "@/components/layout/FloatingNavbar";
import { Footer } from "@/components/layout/Footer";
import { cn } from "@/lib/utils";

interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
  isPublic?: boolean;
}

export function PageLayout({
  children,
  className,
  isPublic = false,
}: PageLayoutProps) {
  return (
    <div className="flex min-h-screen bg-background text-foreground google-sans">
      {!isPublic && <Sidebar />}
      <div
        className={cn(
          "flex flex-col flex-1 transition-all duration-300 ease-in-out",
          !isPublic && "lg:ml-[var(--sidebar-width)]",
        )}
      >
        {!isPublic && <FloatingNavbar className="hidden lg:flex" />}
        <main className={cn("flex-1 px-4 py-8 md:px-8 lg:px-12", className)}>
          <div className="mx-auto max-w-5xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            {children}
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
