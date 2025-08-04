"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  FileText,
  Boxes,
  Truck,
  Settings,
  Triangle
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/customers", label: "Customers", icon: Users },
    { href: "/purchase-orders", label: "Purchase Orders", icon: FileText },
    { href: "/production", label: "Production", icon: Boxes },
    { href: "/deliveries", label: "Deliveries", icon: Truck },
    { href: "/settings", label: "Settings", icon: Settings },
]

export function SidebarNavigation() {
  const pathname = usePathname();

  return (
    <>
        <Link
            href="/"
            className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
        >
            <Triangle className="h-5 w-5 transition-all group-hover:scale-110" />
            <span className="sr-only">CartonFlow</span>
        </Link>
        {navItems.map((item) => (
            <Link 
                key={item.href} 
                href={item.href} 
                className={cn(
                    "transition-colors hover:text-foreground",
                    pathname === item.href ? "text-foreground" : "text-muted-foreground"
                )}
            >
                {item.label}
            </Link>
      ))}
    </>
  )
}
