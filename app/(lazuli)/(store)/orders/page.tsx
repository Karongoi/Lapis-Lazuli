"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/context/AuthContext"
import { ShoppingBag } from "lucide-react"
import { Breadcrumb } from "@/components/breadcrumb"
import LoadingSkeleton from "@/common/shared/loadingSkeleton"
import { Order } from "@/lib/types"

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const { user } = useAuth()

    useEffect(() => {
        fetchOrders()
    }, [])

    async function fetchOrders() {
        try {
            const response = await fetch("/api/users/orders", {
                headers: {
                    "x-user-id": user?.id || "",
                },
            })
            if (!response.ok) throw new Error("Failed to fetch orders")
            const data = await response.json()
            setOrders(data)
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load orders")
        } finally {
            setLoading(false)
        }
    }

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            pending: "bg-yellow-100 text-yellow-800",
            paid: "bg-blue-100 text-blue-800",
            processing: "bg-blue-100 text-blue-800",
            shipped: "bg-purple-100 text-purple-800",
            delivered: "bg-green-100 text-green-800",
            cancelled: "bg-gray-100 text-gray-800",
            payment_failed: "bg-red-100 text-red-800",
        }
        return colors[status] || "bg-gray-100 text-gray-800"
    }

    if (loading) {
        return (
            <main className="min-h-screen bg-background py-12">
                <LoadingSkeleton />
            </main>
        )
    }

    if (error) {
        return (
            <main className="min-h-screen bg-background py-12">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <p className="text-red-600 mb-4">{error}</p>
                    <Link href="/shop">
                        <Button>Back to Shop</Button>
                    </Link>
                </div>
            </main>
        )
    }

    if (orders.length === 0) {
        return (
            <main className="min-h-screen bg-background">
                <div className="w-full">
                    <div className="relative p-4 py-6 bg-primary/10 flex flex-col gap-2 items-center justify-between">
                        <div
                            className="absolute inset-0 z-0"
                            style={{
                                backgroundImage: `
        radial-gradient(circle, rgba(236,72,153,0.15) 6px, transparent 7px),
        radial-gradient(circle, rgba(59,130,246,0.15) 6px, transparent 7px),
        radial-gradient(circle, rgba(16,185,129,0.15) 6px, transparent 7px),
        radial-gradient(circle, rgba(245,158,11,0.15) 6px, transparent 7px)
      `,
                                backgroundSize: "60px 60px",
                                backgroundPosition: "0 0, 30px 30px, 30px 0, 0 30px",
                            }}
                        />
                        <div className="flex gap-2 items-center">
                            <h1 className="text-2xl">My Orders</h1>
                            <div className="relative w-8 h-8 items-center justify-center flex">
                                <ShoppingBag className="h-6 w-6 absolute z-2" /> <span className="absolute top-0 right-0 z-1 w-5 h-5 bg-amber-300 rounded-full"></span>
                            </div>
                        </div>
                        <Breadcrumb
                            className="capitalize"
                            items={[
                                { label: "Home", href: "/home" },
                                { label: "Orders" },
                            ]}
                        />
                    </div>
                    <div className="max-w-4xl mx-auto px-4 py-12 text-center space-y-4">
                        <h1 className="text-2xl font-bold">No Orders Yet</h1>
                        <p className="text-foreground/60">You haven't placed any orders yet.</p>
                        <Link href="/shop">
                            <Button>Start Shopping</Button>
                        </Link>
                    </div>
                </div>
            </main>
        )
    }

    return (
        <main className="min-h-screen bg-background">
            <div className="w-full">
                <div className="relative p-4 py-6 bg-primary/10 flex flex-col gap-2 items-center justify-between">
                    <div
                        className="absolute inset-0 z-0"
                        style={{
                            backgroundImage: `
        radial-gradient(circle, rgba(236,72,153,0.15) 6px, transparent 7px),
        radial-gradient(circle, rgba(59,130,246,0.15) 6px, transparent 7px),
        radial-gradient(circle, rgba(16,185,129,0.15) 6px, transparent 7px),
        radial-gradient(circle, rgba(245,158,11,0.15) 6px, transparent 7px)
      `,
                            backgroundSize: "60px 60px",
                            backgroundPosition: "0 0, 30px 30px, 30px 0, 0 30px",
                        }}
                    />
                    <div className="flex gap-2 items-center">
                        <h1 className="text-2xl">My Orders</h1>
                        <div className="relative w-8 h-8 items-center justify-center flex">
                            <ShoppingBag className="h-6 w-6 absolute z-2" /> <span className="absolute top-0 right-0 z-1 w-5 h-5 bg-amber-300 rounded-full"></span>
                        </div>
                    </div>
                    <Breadcrumb
                        className="capitalize"
                        items={[
                            { label: "Home", href: "/home" },
                            { label: "Orders" },
                        ]}
                    />
                </div>
                <div className="max-w-4xl mx-auto px-4 py-12 space-y-6">
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <Card key={order.id} className="gap-4">
                                <CardHeader className="flex items-start justify-between">
                                    <div className="flex items-center gap-8">
                                        <CardTitle className="text-lg">{order.order_number}</CardTitle>
                                        <p className="text-sm text-foreground/60">
                                            {new Date(order.created_at).toLocaleDateString(undefined, {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            })}
                                        </p>
                                    </div>
                                    <span className={`hidden  md:block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                                        {order.status.replace('_', ' ').toUpperCase()}
                                    </span>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {order.items && order.items.length > 0 && (
                                        <div className="space-y-2">
                                            <p className="text-sm font-medium">Items Preview:</p>
                                            <div className="flex gap-2 flex-wrap">
                                                {order.items.slice(0, 3).map((item) => (
                                                    <div key={item.id} className="flex items-center gap-2 text-xs bg-gray-50 rounded p-2">
                                                        {item.media_url && (
                                                            <div className="relative w-8 h-8 flex-shrink-0 rounded overflow-hidden">
                                                                <Image
                                                                    src={item.media_url || "/placeholder.svg"}
                                                                    alt={item.product_name || "Product"}
                                                                    fill
                                                                    className="object-cover"
                                                                />
                                                            </div>
                                                        )}
                                                        <div>
                                                            <p className="font-medium">{item.product_name}</p>
                                                            <p className="text-foreground/60">Qty: {item.quantity}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                                {order.items.length > 3 && (
                                                    <div className="text-xs bg-gray-50 rounded p-2 flex items-center">
                                                        +{order.items.length - 3} more items
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between pt-4 border-t">
                                        <p className="font-semibold">
                                            Total: KES {parseFloat(order.total_price).toFixed(2)}
                                            <span className="text-foreground/60 font-normal text-sm ml-1 line-through">KES {parseFloat(order.subtotal)} - {parseFloat(order.discount)}</span>
                                        </p>
                                        <Link href={`/order-confirmation?orderId=${order.id}`}>
                                            <Button variant="outline" size="sm">
                                                View Details
                                            </Button>
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                    <Link href="/shop">
                        <Button>Continue Shopping</Button>
                    </Link>
                </div>
            </div>
        </main>
    )
}
