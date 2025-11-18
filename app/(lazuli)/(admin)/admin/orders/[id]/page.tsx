"use client"
import { useEffect, useState } from "react"
import { useParams } from 'next/navigation'
import { OrderItemsDisplay } from "@/components/storefront/orders/order-items-display"
import { statusConfig } from "@/lib/constants"
import { removeRetryOrder } from "@/lib/retryCheckoutStorage"
import { useOrder } from "@/hooks/useOrders"
import toast from "react-hot-toast"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"

export default function OrderConfirmationPage() {
    const params = useParams()
    const orderId = params.id as string
    const { data: order, error, isLoading, refetch } = useOrder(orderId);

    const handleStatusUpdate = async (newStatus: string) => {
        try {
            const res = await fetch(`/api/admin/orders/${orderId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            })

            if (!res.ok) throw new Error("Failed")

            toast.success("Order status updated")
            refetch()
        } catch (e) {
            toast.error("Error updating status")
        }
    }

    // Loading state
    if (!orderId || isLoading) {
        return (
            <main className="min-h-screen bg-background flex items-center justify-center">
                <div>Loading order details...</div>
            </main>
        );
    }

    // Error or missing order
    if (error || !order) {
        return (
            <main className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-semibold mb-4">Error Loading Order</h1>
                    <p className="text-foreground/70 mb-6">Failed to fetch order details</p>
                </div>
            </main>
        );
    }

    const config = statusConfig[order.status]
    const isFreeOrder = parseFloat(order.total_price) <= 0

    return (
        <main className="min-h-screen max-w-5xl mx-auto bg-background">
            <div className="flex items-center justify-between">
                <Link href="/admin/orders">
                    <Button variant="link"><ChevronLeft /> Back to Orders</Button>
                </Link>
                {/* Admin Status Update */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <label className="font-semibold">Update Status:</label>
                        <select
                            value={order.status}
                            onChange={(e) => handleStatusUpdate(e.target.value)}
                            className="border py-1 px-2 rounded-sm"
                        >
                            <option value="cancelled">Cancelled</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                        </select>
                    </div>
                </div>
            </div>
            <div className="px-4 space-y-8 py-12">
                <div className={`${config.textColor} pb-8 text-center space-y-4`}>
                    <h1 className="text-2xl font-bold">{config.title}</h1>
                    <p className="text-sm">{config.message}</p>
                </div>
                <div className={`${config.color} p-8 flex flex-wrap md:flex-nowrap items-center justify-between h-full text-sm`}>
                    <p className="flex flex-col gap-1">
                        <span className="font-semibold">Order Number:</span> {order.order_number}
                    </p>
                    <hr className="h-12 w-0.25 bg-foreground/30" />
                    <p className="flex flex-col gap-1">
                        <span className="font-semibold">Order Date:</span>
                        {new Date(order.created_at).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        })}
                    </p>
                    <hr className="h-12 w-0.25 bg-foreground/30" />
                    <p className="flex flex-col gap-1">
                        <span className="font-semibold">Status:</span> {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </p>
                    <hr className="h-12 w-0.25 bg-foreground/30" />
                    <p className="flex flex-col gap-1">
                        <span className="font-semibold">Total:</span> KES {parseFloat(order.total_price).toFixed(2)}
                    </p>
                </div>

                <div className="border p-6 flex flex-col gap-4">
                    {isFreeOrder && (
                        <div className="bg-green-50 border border-green-200 text-green-800 text-sm p-4 rounded-md">
                            This order was fully discounted. No payment was required.
                        </div>
                    )}
                    {order.items && order.items.length > 0 && (
                        <OrderItemsDisplay items={order.items} />
                    )}
                    <div className="border-t flex flex-col gap-4 pt-4">
                        <div className="flex justify-between items-center">
                            <p className="font-semibold">Subtotal</p>
                            <span> KES {parseFloat(order.subtotal).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <p className="font-semibold">Tax</p>
                            <span> KES {parseFloat(order.tax).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <p className="font-semibold">Discount</p>
                            <span> - KES {parseFloat(order.discount).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between border-t pt-4 items-center">
                            <p className="font-semibold">Total</p>
                            <span> KES {parseFloat(order.total_price).toFixed(2)}</span>
                        </div></div>
                </div>
            </div>
        </main>
    )
}
