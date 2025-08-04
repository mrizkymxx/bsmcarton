"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react";

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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);


  return (
    <div className="flex items-center space-x-6">
        {navItems.map((item) => (
            <Link
                key={item.href}
                href={item.href}
                className={cn(
                    "transition-colors hover:text-foreground",
                     !mounted || pathname !== item.href ? "text-muted-foreground" : "text-foreground"
                )}
            >
                {item.label}
            </Link>
      ))}
    </div>
  )
}
