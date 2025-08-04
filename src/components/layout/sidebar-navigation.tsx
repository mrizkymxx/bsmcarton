"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

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
    <nav className="flex items-center gap-6 text-sm font-medium">
        {navItems.map((item) => (
            <Link 
                key={item.href} 
                href={item.href} 
                className={pathname === item.href ? "text-foreground" : "text-muted-foreground"}
            >
                {item.label}
            </Link>
      ))}
    </nav>
  )
}
