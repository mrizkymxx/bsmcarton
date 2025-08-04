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

const pageTitles: { [key: string]: string } = {
  "/": "Dashboard",
  "/customers": "Pelanggan",
  "/purchase-orders": "Purchase Orders",
  "/production": "Produksi",
  "/deliveries": "Pengiriman",
  "/settings": "Pengaturan",
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
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-8 w-8 text-primary"
                >
                    <path d="M21 8.32V15.7c0 1.2-1.03 2.18-2.23 2.05l-5.63-.59c-.54-.06-1.06.15-1.42.52l-2.03 2.03c-.9.9-2.35.9-3.25 0l-2.03-2.03c-.36-.36-.88-.58-1.42-.52L3.23 17.75C2.03 17.88 1 16.9 1 15.7V8.32c0-1.2 1.03-2.18 2.23-2.05l5.63.59c.54.06 1.06-.15 1.42-.52L12.31 4.3c.9-.9 2.35-.9 3.25 0l2.03 2.03c.36.36.88.58 1.42.52l5.63-.59C21.97 6.14 23 7.12 23 8.32v0Z" />
                    <path d="M12 12H7"/>
                    <path d="M17 12h-2"/>
                </svg>
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
            <main className="flex-1">{children}</main>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
}
