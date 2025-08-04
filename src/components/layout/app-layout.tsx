
"use client";

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { UserNav } from "./user-nav";
import { ThemeToggle } from "./theme-toggle";
import { SidebarNavigation } from "./sidebar-navigation";
import { usePathname } from "next/navigation";
import { PanelLeft, Star } from "lucide-react";
import { Button } from "../ui/button";

const pageTitles: { [key: string]: string } = {
  "/": "Dashboard",
  "/customers": "Customers",
  "/purchase-orders": "Purchase Orders",
  "/production": "Production",
  "/deliveries": "Deliveries",
  "/settings": "Settings",
};

function SidebarWrapper() {
    const { toggleSidebar } = useSidebar();
    return (
         <Sidebar>
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
    )
}


export default function AppLayout({ children }: { children: React.ReactNode }) {

  return (
    <SidebarProvider>
        <div className="min-h-screen w-full">
            <SidebarWrapper />
             <main className="flex flex-col pl-0 md:pl-56">
                 <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 lg:h-[60px] lg:px-6">
                    <SidebarTrigger className="md:hidden" />
                     <div className="w-full flex-1">
                        <h1 className="text-lg font-semibold">
                            {pageTitles[usePathname()] ?? "CartonFlow"}
                        </h1>
                    </div>
                    <ThemeToggle />
                    <UserNav />
                </header>
                <div className="flex-1 p-4 md:p-8">
                    {children}
                </div>
            </main>
        </div>
    </SidebarProvider>
  );
}
