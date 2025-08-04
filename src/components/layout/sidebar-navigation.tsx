
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import {
  LayoutDashboard,
  Users,
  Package,
  Truck,
  FileText,
  Settings,
  Boxes
} from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"

const navItems = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard, color: "text-sky-500" },
    { href: "/customers", label: "Customers", icon: Users, color: "text-violet-500" },
    { href: "/purchase-orders", label: "Purchase Orders", icon: FileText, color: "text-amber-500" },
    { href: "/production", label: "Production", icon: Boxes, color: "text-rose-500" },
    { href: "/deliveries", label: "Deliveries", icon: Truck, color: "text-teal-500" },
    { href: "/settings", label: "Settings", icon: Settings, color: "text-slate-500" },
]

export function SidebarNavigation({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const isMobile = useIsMobile();

  const handleLinkClick = () => {
    if (isMobile && onNavigate) {
      onNavigate();
    }
  }

  return (
    <SidebarMenu>
      {navItems.map((item) => (
        <SidebarMenuItem key={item.href}>
            <Link href={item.href} prefetch={true} onClick={handleLinkClick} className="w-full">
              <SidebarMenuButton
                isActive={pathname === item.href}
              >
                <item.icon className={item.color} />
                <span>{item.label}</span>
              </SidebarMenuButton>
            </Link>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  )
}
