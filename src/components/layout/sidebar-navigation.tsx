
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
  SidebarMenuSkeleton
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
import { useState, useEffect } from "react"

const navItems = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/customers", label: "Customers", icon: Users },
    { href: "/purchase-orders", label: "Purchase Orders", icon: FileText },
    { href: "/production", label: "Production", icon: Boxes },
    { href: "/deliveries", label: "Deliveries", icon: Truck },
    { href: "/settings", label: "Settings", icon: Settings },
]

export function SidebarNavigation() {
  const pathname = usePathname()
  const { isMobile, setOpenMobile } = useSidebar();
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])


  const handleLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  }

  return (
    <SidebarMenu>
      {isClient ? (
        navItems.map((item) => (
          <SidebarMenuItem key={item.href}>
            <SidebarMenuButton
              asChild
              tooltip={item.label}
              isActive={pathname === item.href}
              onClick={handleLinkClick}
            >
              <Link href={item.href} prefetch={true}>
                <item.icon />
                <span>{item.label}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))
      ) : (
        <>
          {navItems.map((item) => (
            <SidebarMenuSkeleton key={item.href} showIcon={true} />
          ))}
        </>
      )}
    </SidebarMenu>
  )
}
