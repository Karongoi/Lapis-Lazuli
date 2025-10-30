'use client'

import { AdminNavbar } from "@/common/widgets/AdminNavbar"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <div className="w-64 bg-gray-900 text-white p-6">
        <AdminNavbar />
      </div>
      {children}
    </div>
  )
}
