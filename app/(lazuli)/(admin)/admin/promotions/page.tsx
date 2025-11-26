"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useMemo, JSX } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/admin/data-table"
import LoadingSkeleton from "@/common/shared/loadingSkeleton"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { formatDate } from "@/lib/constants"

export default function PromotionsPage() {
    const router = useRouter()
    const queryClient = useQueryClient()

    const [search, setSearch] = useState("")
    const [filterStatus, setFilterStatus] = useState("all")

    const { data: promotions = [], isLoading, error } = useQuery({
        queryKey: ["promotions"],
        queryFn: async () => {
            const res = await fetch("/api/admin/promotions")
            if (!res.ok) throw new Error("Failed to fetch promotions")
            const result = await res.json()
            return result.data || []
        },
    })

    async function handleDelete(id: number) {
        if (!confirm("Delete this promotion?")) return
        try {
            const res = await fetch(`/api/admin/promotions/${id}`, { method: "DELETE" })
            if (!res.ok) throw new Error()
            queryClient.invalidateQueries({ queryKey: ["promotions"] })
        } catch {
            alert("Failed to delete promotion")
        }
    }

    // ---- STATUS LOGIC ----
    const getStatus = (promo: any) => {
    if (!promo || !promo.valid_from || !promo.valid_until) return "unknown"
        const now = new Date()
        const start = new Date(promo.valid_from)
        const end = new Date(promo.valid_until)
        if (end < now) return "expired"
        if (start > now) return "upcoming"
        return "active"
    }

    const statusBadges: Record<string, JSX.Element> = {
        active: <Badge className="bg-green-600">Active</Badge>,
        expired: <Badge className="bg-red-600">Expired</Badge>,
        upcoming: <Badge className="bg-blue-600">Upcoming</Badge>,
    }

    // ---- SEARCH + FILTERING ----
    const filteredPromotions = useMemo(() => {
        return promotions.filter((p: any) => {
            const status = getStatus(p)
            const matchesSearch =
                p.code.toLowerCase().includes(search.toLowerCase()) ||
                p.discount_percentage.toString().includes(search)

            const matchesFilter = filterStatus === "all" || status === filterStatus

            return matchesSearch && matchesFilter
        })
    }, [promotions, search, filterStatus])

    // ---- COLUMNS ----
    const columns = [
        { key: "id", label: "ID", width: 60 },
        { key: "code", label: "Code", width: 180 },
        { key: "discount_percentage", label: "Discount (%)", width: 110 },
        {
            key: "valid_from",
            label: "Starts",
            width: 150,
            render: (value: any) => formatDate(value),
        },
        {
            key: "valid_until",
            label: "Ends",
            width: 150,
            render: (value: any) => formatDate(value),
        },
        {
            key: "status",
            label: "Status",
            width: 120,
            render: (_: any, row: any) => statusBadges[getStatus(row)],
        },
    ]

    return (
        <div className="space-y-6">
            {/* HEADER */}
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Promotions</h1>
                <Link href="/admin/promotions/new">
                    <Button>New Promotion</Button>
                </Link>
            </div>

            {/* SEARCH + FILTER */}
            <div className="flex gap-4">
                <Input
                    placeholder="Search promotions…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="max-w-xs"
                />
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-40">
                        <SelectValue placeholder="Filter status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="upcoming">Upcoming</SelectItem>
                        <SelectItem value="expired">Expired</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Promotions</CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="py-8 text-center text-muted-foreground">
                            <LoadingSkeleton />
                        </div>
                    ) : (
                        <DataTable
                            data={filteredPromotions}
                            columns={columns}
                            onEdit={(row) => router.push(`/admin/promotions/${row.id}`)}
                            onDelete={(row) => handleDelete(row.id)}
                            rowClassName={(row) =>
                                getStatus(row) === "expired" ? "bg-red-50 dark:bg-red-950" : ""
                            }
                        />
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
