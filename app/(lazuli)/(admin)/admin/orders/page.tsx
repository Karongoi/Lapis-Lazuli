"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/admin/data-table"

export default function OrdersPage() {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchOrders()
    }, [])

    async function fetchOrders() {
        try {
            const res = await fetch("/api/admin/orders")
            if (!res.ok) throw new Error("Failed to fetch")
            const result = await res.json()
            setOrders(result.data || [])
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const columns = [
        { key: "order_number", label: "Order #", width: 120 },
        { key: "email", label: "Customer", width: 200 },
        { key: "status", label: "Status", width: 100 },
        { key: "total_price", label: "Total", width: 100 },
        { key: "created_at", label: "Date", width: 150 },
    ]

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Orders</h1>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Orders</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="py-8 text-center text-muted-foreground">Loading...</div>
                    ) : (
                        <DataTable data={orders} columns={columns} />
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
