"use client"

import * as React from "react"
import { PanelLeft } from "lucide-react"

import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet"

interface SidebarProps extends React.ComponentProps<"div"> {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  side?: "left" | "right"
}

const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  (
    {
      side = "left",
      className,
      children,
      open,
      onOpenChange,
      ...props
    },
    ref
  ) => {
    const isMobile = useIsMobile()

    if (isMobile) {
      return (
          <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent
              data-sidebar="sidebar"
              data-mobile="true"
              className="w-72 bg-sidebar p-0 text-sidebar-foreground [&>button]:hidden"
              side={side}
            >
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <div className="flex h-full w-full flex-col">{children}</div>
            </SheetContent>
          </Sheet>
      )
    }

    return (
       <div 
          ref={ref} 
          data-sidebar="sidebar"
          className={cn(
            "fixed inset-y-0 left-0 z-20 flex h-full w-56 flex-col border-r bg-sidebar text-sidebar-foreground",
            "hidden md:flex",
            className
          )}
          {...props}
        >
          {children}
        </div>
    )
  }
)
Sidebar.displayName = "Sidebar"

const SidebarTrigger = React.forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentProps<typeof Button>
>(({ className, ...props }, ref) => {
  return (
      <Button
        ref={ref}
        data-sidebar="trigger"
        variant="ghost"
        size="icon"
        className={cn("h-7 w-7", className)}
        {...props}
      >
        <PanelLeft />
        <span className="sr-only">Toggle Sidebar</span>
      </Button>
  )
})
SidebarTrigger.displayName = "SidebarTrigger"


const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="header"
      className={cn("flex items-center gap-2 p-3", className)}
      {...props}
    />
  )
})
SidebarHeader.displayName = "SidebarHeader"

const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="content"
      className={cn(
        "flex min-h-0 flex-1 flex-col gap-0 overflow-auto",
        className
      )}
      {...props}
    />
  )
})
SidebarContent.displayName = "SidebarContent"

const SidebarMenu = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    data-sidebar="menu"
    className={cn("flex w-full min-w-0 flex-col gap-1 p-2", className)}
    {...props}
  />
))
SidebarMenu.displayName = "SidebarMenu"

const SidebarMenuItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
  <li
    ref={ref}
    data-sidebar="menu-item"
    className={cn("group/menu-item relative", className)}
    {...props}
  />
))
SidebarMenuItem.displayName = "SidebarMenuItem"

const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & {
    isActive?: boolean
  }
>(
  (
    {
      isActive = false,
      className,
      children,
      ...props
    },
    ref
  ) => {

    return (
      <button
        ref={ref}
        data-sidebar="menu-button"
        data-active={isActive}
        className={cn(
          "flex w-full items-center gap-3 overflow-hidden rounded-md px-3 py-2 text-left text-sm outline-none ring-sidebar-ring transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50",
          "data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground",
           "[&>svg]:size-5 [&>svg]:shrink-0",
          className
        )}
        {...props}
      >
        {children}
      </button>
    )
  }
)
SidebarMenuButton.displayName = "SidebarMenuButton"

export {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
}
