
"use client";

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { UserNav } from "./user-nav";
import { ThemeToggle } from "./theme-toggle";
import { SidebarNavigation } from "./sidebar-navigation";
import { usePathname } from "next/navigation";
import { Star } from "lucide-react";

const pageTitles: { [key: string]: string } = {
  "/": "Dashboard",
  "/customers": "Customers",
  "/purchase-orders": "Purchase Orders",
  "/production": "Production",
  "/deliveries": "Deliveries",
  "/settings": "Settings",
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const title = pageTitles[pathname] ?? "CartonFlow";

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-2 p-2">
                <span className="flex items-center justify-center h-8 w-8 text-primary">
                  <Star className="h-6 w-6" />
                </span>
                <h1 className="text-xl font-bold">CartonFlow</h1>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarNavigation />
          </SidebarContent>
          <SidebarFooter>
             {/* Can add footer items here */}
          </SidebarFooter>
        </Sidebar>
        <div className="flex flex-col flex-1">
          <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 lg:h-[60px] lg:px-6">
            <SidebarTrigger className="md:hidden" />
            <div className="w-full flex-1">
              <h1 className="text-lg font-semibold">{title}</h1>
            </div>
            <ThemeToggle />
            <UserNav />
          </header>
          <SidebarInset>
            <main className="flex-1 p-4 md:p-8">
              {children}
            </main>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
}
