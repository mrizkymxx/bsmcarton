import { SidebarNavigation } from './sidebar-navigation';
import { UserNav } from './user-nav';
import { ThemeToggle } from './theme-toggle';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full flex">
      <SidebarNavigation />
      <div className="flex flex-col flex-1">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background/95 backdrop-blur-sm px-4 sm:px-6 justify-end">
           <div className="flex items-center gap-4">
            <ThemeToggle />
            <UserNav />
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 bg-secondary/50">
          {children}
        </main>
      </div>
    </div>
  );
}
