"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useCart } from "@/hooks/useCart"
import { Button } from "@/components/ui/button"
import { ShoppingBag } from 'lucide-react'
import toast from "react-hot-toast"
import { Breadcrumb } from "@/components/breadcrumb"
import { CartItems } from "@/components/storefront/cart-items"
import { OrderSummary } from "@/components/storefront/order-summary"
import { CartItem } from "@/lib/types"
import LoadingSkeleton from "@/common/shared/loadingSkeleton"

export default function CartPage() {
    const { cart, loading, updateItem, removeItem } = useCart()
    const [mounted, setMounted] = useState(false)
    const [coupon, setCoupon] = useState("")

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSkeleton />
            </div>
        )
    }

    if (!cart || cart.items.length === 0) {
        return (
            <main className="min-h-screen bg-background">
                <div className="w-full">
                    <div className="p-4 bg-primary/10 flex flex-col gap-2 items-center justify-between">
                        <div className="flex gap-2 items-center">
                            <h1 className="text-2xl">My Shopping Cart</h1>
                            <div className="relative w-8 h-8 items-center justify-center flex">
                                <ShoppingBag className="h-6 w-6 absolute z-2" /> <span className="absolute top-0 right-0 z-1 w-5 h-5 bg-amber-300 rounded-full"></span>
                            </div>
                        </div>
                        <Breadcrumb
                            className="capitalize"
                            items={[
                                { label: "Home", href: "/home" },
                                { label: "Shop", href: "/shop" },
                                { label: 'Cart' },
                            ]}
                        />
                    </div>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col items-center justify-center">
                        <ShoppingBag className="h-16 w-16 text-gray-300 mb-4" />
                        <p className="text-xl text-gray-600 mb-6">Your cart is empty</p>
                        <Link href="/shop">
                            <Button>Continue Shopping</Button>
                        </Link>
                    </div>
                </div>
            </main>
        )
    }

    const handleUpdateQuantity = async (itemId: number, newQuantity: number) => {
        if (newQuantity < 1) return
        try {
            await updateItem(itemId, newQuantity)
            toast.success("Quantity updated successfully")

        } catch (error) {
            toast.error("Failed to update quantity")
        }
    }

    const handleRemoveItem = async (itemId: number) => {
        try {
            await removeItem(itemId)
            toast.success("Item removed from cart")
        } catch (error) {
            toast.error("Failed to remove item")
        }
    }

    const subtotal = cart.items.reduce((acc, item) => {
        return acc + Number.parseFloat(item.variant.price) * item.quantity
    }, 0)

    const tax = 0
    const total = subtotal + tax

    return (
        <main className="min-h-screen bg-background">
            <div className="w-full">
                <div className="p-4 bg-primary/10 flex flex-col gap-2 items-center justify-between">
                    <div className="flex gap-2 items-center">
                        <h1 className="text-2xl">My Shopping Cart</h1>
                        <div className="relative w-8 h-8 items-center justify-center flex">
                            <ShoppingBag className="h-6 w-6 absolute z-2" /> <span className="absolute top-0 right-0 z-1 w-5 h-5 bg-amber-300 rounded-full"></span>
                        </div>
                    </div>
                    <Breadcrumb
                        className="capitalize"
                        items={[
                            { label: "Home", href: "/home" },
                            { label: "Shop", href: "/shop" },
                            { label: 'Cart' },
                        ]}
                    />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="w-full lg:col-span-2">
                        <CartItems
                            items={cart.items as CartItem[]}
                            onUpdateQuantity={handleUpdateQuantity}
                            onRemoveItem={handleRemoveItem}
                        />
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                            <h2 className="text-lg mb-2">Have a coupon code?</h2>
                            <div className="flex gap-4">
                                <input type="text" placeholder="Enter coupon code" className="w-full p-2 border border-border" value={coupon} onChange={(e) => setCoupon(e.target.value)} />
                                <Button size={'lg'} onClick={() => applyCoupon(coupon)}>Apply Coupon</Button>
                            </div>
                        </div>
                    </div>
                    <OrderSummary
                        // cart items total quantity
                        items={cart.items.reduce((acc, item) => acc + item.quantity, 0)}
                        discount={0}
                        subtotal={subtotal}
                        total={total}
                    />
                </div>
            </div>
        </main>
    )
}

function applyCoupon(couponCode: string) {
    // Logic to apply coupon code
    console.log("Applying coupon:", couponCode);
}
