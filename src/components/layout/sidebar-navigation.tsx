
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
]

export function SidebarNavigation() {
  const pathname = usePathname();
  const [activePath, setActivePath] = useState(pathname)

  useEffect(() => {
    setActivePath(pathname)
  }, [pathname])

  return (
    <div className="flex h-full flex-col p-4 md:p-0 md:flex-row md:items-center md:space-x-6">
      <Link href="/" className="mb-4 flex items-center space-x-2 md:mb-0 md:mr-6">
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
        <span className="font-bold text-lg">CartonFlow</span>
      </Link>
      <nav className="flex flex-col gap-1 md:flex-row md:gap-0 md:space-x-4">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "transition-colors hover:bg-accent hover:text-accent-foreground rounded-md px-3 py-2 text-lg md:text-sm",
              activePath === item.href ? "bg-accent text-accent-foreground" : "text-foreground/60"
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  )
}
