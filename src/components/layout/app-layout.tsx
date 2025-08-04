
"use client";

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { UserNav } from "./user-nav";
import { ThemeToggle } from "./theme-toggle";
import { SidebarNavigation } from "./sidebar-navigation";
import { usePathname } from "next/navigation";
import { Star } from "lucide-react";
import { useState } from "react";

const pageTitles: { [key: string]: string } = {
  "/": "Dashboard",
  "/customers": "Customers",
  "/purchase-orders": "Purchase Orders",
  "/production": "Production",
  "/deliveries": "Deliveries",
  "/settings": "Settings",
};

function Header({ onSidebarOpen }: { onSidebarOpen: () => void }) {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 lg:h-[60px] lg:px-6">
      <SidebarTrigger onClick={onSidebarOpen} className="md:hidden" />
      <div className="w-full flex-1">
        <h1 className="text-lg font-semibold">
          {pageTitles[pathname] ?? "CartonFlow"}
        </h1>
      </div>
      <ThemeToggle />
      <UserNav />
    </header>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
      <div className="min-h-screen w-full">
        <Sidebar open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
          <SidebarHeader>
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center h-8 w-8 text-primary">
                <Star className="h-6 w-6" />
              </span>
              <span>
                <h1 className="text-xl font-bold">CartonFlow</h1>
              </span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarNavigation onNavigate={() => setIsSidebarOpen(false)} />
          </SidebarContent>
        </Sidebar>
        <main className="flex flex-col pl-0 md:pl-56">
          <Header onSidebarOpen={() => setIsSidebarOpen(true)} />
          <div className="flex-1 p-4 md:p-8">{children}</div>
        </main>
      </div>
  );
}
