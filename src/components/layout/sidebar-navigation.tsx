
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"

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
  const [activePath, setActivePath] = useState(pathname)

  useEffect(() => {
    setActivePath(pathname)
  }, [pathname])

  return (
    <>
      <Link href="/" className="mr-6 flex items-center space-x-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-6 w-6 text-primary"
        >
          <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
          <path d="m3.3 7 8.7 5 8.7-5" />
          <path d="M12 22V12" />
        </svg>
        <span className="font-bold text-lg">BSMcarton</span>
      </Link>
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "transition-colors hover:text-foreground/80",
            activePath === item.href ? "text-foreground" : "text-foreground/60"
          )}
        >
          {item.label}
        </Link>
      ))}
    </>
  )
}
