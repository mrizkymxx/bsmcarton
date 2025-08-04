import { SidebarNavigation } from './sidebar-navigation';
import { UserNav } from './user-nav';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full flex flex-col bg-background">
      <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
        <nav className="hidden items-center space-x-6 text-sm font-medium md:flex">
          <SidebarNavigation />
        </nav>
        <div className="flex flex-1 items-center justify-end space-x-4">
            <UserNav />
        </div>
      </header>
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl w-full">
            {children}
        </div>
      </main>
    </div>
  );
}
