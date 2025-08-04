
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
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

const navItems = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard, color: "text-sky-500" },
    { href: "/customers", label: "Customers", icon: Users, color: "text-violet-500" },
    { href: "/purchase-orders", label: "Purchase Orders", icon: FileText, color: "text-amber-500" },
    { href: "/production", label: "Production", icon: Boxes, color: "text-rose-500" },
    { href: "/deliveries", label: "Deliveries", icon: Truck, color: "text-teal-500" },
    { href: "/settings", label: "Settings", icon: Settings, color: "text-slate-500" },
]

export function SidebarNavigation() {
  const pathname = usePathname()
  const { isMobile, setOpenMobile } = useSidebar();

  const handleLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  }

  return (
    <SidebarMenu>
      {navItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <SidebarMenuButton
            asChild
            tooltip={item.label}
            isActive={pathname === item.href}
            onClick={handleLinkClick}
          >
            <Link href={item.href}>
              <item.icon className={item.color} />
              <span>{item.label}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  )
}
