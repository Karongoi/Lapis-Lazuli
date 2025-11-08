"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const navItems = [
  { label: "Dashboard", href: "/admin" },
  { label: "Products", href: "/admin/products" },
  { label: "Collections", href: "/admin/collections" },
  { label: "Categories", href: "/admin/categories" },
  { label: "Orders", href: "/admin/orders" },
  { label: "Promotions", href: "/admin/promotions" },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-50 h-screen w-64 border-r border-border bg-sidebar text-sidebar-foreground">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="border-b border-sidebar-border p-6">
            <h1 className="text-lg font-bold">Admin Panel</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "block rounded-md px-4 py-2 text-sm font-medium transition-colors",
                      pathname === item.href
                        ? "bg-sidebar-primary text-sidebar-primary-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Footer */}
          <div className="border-t border-sidebar-border p-4 text-xs text-sidebar-foreground/60">
            <p>Lapis Lazuli Admin v1.0</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64">
        <div className="border-b border-border bg-card p-6">
          <h2 className="text-xl font-bold text-card-foreground">Dashboard</h2>
        </div>
        <div className="p-6 bg-background">{children}</div>
      </main>
    </div>
  )
}
