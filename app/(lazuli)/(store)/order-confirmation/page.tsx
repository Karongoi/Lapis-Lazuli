"use client"
import { useEffect, useState } from "react"
import { useSearchParams } from 'next/navigation'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { OrderItemsDisplay } from "@/components/storefront/orders/order-items-display"
import { ShoppingBag } from "lucide-react"
import { Breadcrumb } from "@/components/breadcrumb"
import { statusConfig } from "@/lib/constants"
import { removeRetryOrder } from "@/lib/retryCheckoutStorage"
import { useOrder } from "@/hooks/useOrders"
import toast from "react-hot-toast"

export default function OrderConfirmationPage() {
    const searchParams = useSearchParams()
    const orderId = searchParams.get("orderId") ?? ''
    const [polling, setPolling] = useState(false)
    const { data: order, error, isLoading, refetch } = useOrder(orderId);

    useEffect(() => {
        if (!orderId) {
            toast.error("Order ID not found");
        }
    }, [orderId]);

    useEffect(() => {
        if (!orderId || !order || order.status !== "pending") return;

        let attempts = 0;
        setPolling(true);

        const interval = setInterval(async () => {
            attempts += 1;
            await refetch();

            if (attempts >= 12) {
                clearInterval(interval);
                setPolling(false);
            }
        }, 6000);

        return () => {
            clearInterval(interval);
            setPolling(false);
        };
    }, [orderId, order?.status, refetch]);

    // Clear retry storage when final status reached
    useEffect(() => {
        if (!order) return;
        if (order.status === "paid" || order.status === "cancelled") {
            removeRetryOrder(order.id);
        }
    }, [order]);

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
            <main className="min-h-screen bg-background flex items-center">
                <div className="w-full">
                    <div className="p-4 bg-primary/10 flex flex-col gap-2 items-center justify-between">
                        <div className="flex gap-2 items-center">
                            <h1 className="text-2xl">Order Confirmation</h1>
                            <div className="relative w-8 h-8 items-center justify-center flex">
                                <ShoppingBag className="h-6 w-6 absolute z-2" />{" "}
                                <span className="absolute top-0 right-0 z-1 w-5 h-5 bg-amber-300 rounded-full"></span>
                            </div>
                        </div>
                    </div>
                    <div className="text-center">
                        <h1 className="text-2xl font-semibold mb-4">Error Loading Order</h1>
                        <p className="text-foreground/70 mb-6">Failed to fetch order details</p>
                        <Link href="/shop">
                            <Button>Continue Shopping</Button>
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    const config = statusConfig[order.status]
    const isFreeOrder = parseFloat(order.total_price) <= 0

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
                        <h1 className="text-2xl">Order Confirmation</h1>
                        <div className="relative w-8 h-8 items-center justify-center flex">
                            <ShoppingBag className="h-6 w-6 absolute z-2" /> <span className="absolute top-0 right-0 z-1 w-5 h-5 bg-amber-300 rounded-full"></span>
                        </div>
                    </div>
                    <Breadcrumb
                        className="capitalize"
                        items={[
                            { label: "Home", href: "/" },
                            { label: "Orders", href: "/orders" },
                            { label: `${order?.order_number} ` },
                        ]}
                    />
                </div>
                <div className="max-w-4xl mx-auto px-4 space-y-8 py-12">
                    {polling && order.status === "pending" && (
                        <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-md text-sm">
                            Waiting for payment confirmation... we'll update this page automatically.
                        </div>
                    )}
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
                        {order.status === "paid" && (
                            <Button variant={"outline"} > Download Receipt </Button>
                        )}
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
                    <div className="w-full flex items-center justify-center gap-8">
                        {(order.status === "pending" || order.status === "payment_failed") && (
                            <Link href={`/checkout?retryOrder=${orderId}`}>
                                <Button variant="outline" className="w-full">Retry Payment</Button>
                            </Link>
                        )}
                        {order.status === "paid" && (
                            <Link href="/orders">
                                <Button variant="outline" className="w-full">
                                    View Orders
                                </Button>
                            </Link>
                        )}
                        <Link href="/shop">
                            <Button className="w-full">
                                Continue Shopping
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    )
}
