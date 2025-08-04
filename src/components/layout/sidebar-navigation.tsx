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

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/customers", label: "Pelanggan", icon: Users },
  { href: "/purchase-orders", label: "Purchase Orders", icon: FileText },
  { href: "/production", label: "Produksi", icon: Boxes },
  { href: "/deliveries", label: "Pengiriman", icon: Truck },
  { href: "/settings", label: "Pengaturan", icon: Settings },
]

export function SidebarNavigation() {
  const pathname = usePathname()

  return (
    <SidebarMenu>
      {navItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <SidebarMenuButton
            asChild
            isActive={pathname === item.href}
            tooltip={item.label}
          >
            <Link href={item.href}>
              <item.icon />
              <span>{item.label}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  )
}
