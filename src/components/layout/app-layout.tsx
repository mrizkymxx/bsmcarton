
import { SidebarNavigation } from './sidebar-navigation';
import { UserNav } from './user-nav';
import { MobileSidebar } from './mobile-sidebar';
import { verifySession } from '@/lib/actions/auth';
import { redirect } from 'next/navigation';

export default async function AppLayout({ 
  children
}: { 
  children: React.ReactNode
}) {
  const session = await verifySession();
  if (!session?.isAuth) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen w-full flex flex-col bg-background">
      <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
        <nav className="hidden items-center space-x-6 text-sm font-medium md:flex">
          <SidebarNavigation />
        </nav>
        <div className="md:hidden">
          <MobileSidebar />
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
            <UserNav name={session.name} email={session.email} />
        </div>
      </header>
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto w-full max-w-7xl">
            {children}
        </div>
      </main>
    </div>
  );
}
