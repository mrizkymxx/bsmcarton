
"use client";

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
} from "@/components/ui/sidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { UserNav } from "./user-nav";
import { ThemeToggle } from "./theme-toggle";
import { SidebarNavigation } from "./sidebar-navigation";
import { usePathname } from "next/navigation";
import { Star, PanelLeft } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
      <div className="min-h-screen w-full">
        {/* Desktop Sidebar */}
        <Sidebar className="hidden md:flex">
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
            <SidebarNavigation />
          </SidebarContent>
        </Sidebar>
        
        <div className="flex flex-col md:pl-56">
          <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 lg:h-[60px] lg:px-6">
            
            {/* Mobile Sidebar */}
            <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="md:hidden">
                        <PanelLeft />
                        <span className="sr-only">Toggle Sidebar</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0">
                    <Sidebar className="flex">
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
                </SheetContent>
            </Sheet>

            <div className="w-full flex-1">
                <h1 className="text-lg font-semibold">
                {pageTitles[pathname] ?? "CartonFlow"}
                </h1>
            </div>
            <ThemeToggle />
            <UserNav />
          </header>
          <main className="flex-1 p-4 md:p-8">
            {children}
          </main>
        </div>
      </div>
  );
}
