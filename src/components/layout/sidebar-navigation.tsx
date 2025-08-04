"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const navItems = [
    { href: "/", label: "Dashboard" },
    { href: "/customers", label: "Customers" },
    { href: "/purchase-orders", label: "Purchase Orders" },
    { href: "/production", label: "Production" },
    { href: "/deliveries", label: "Deliveries" },
    { href: "/settings", label: "Settings" },
]

export function SidebarNavigation() {
  const pathname = usePathname();

  return (
    <>
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
