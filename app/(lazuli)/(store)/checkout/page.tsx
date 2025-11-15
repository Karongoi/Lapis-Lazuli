"use client"

import { useEffect, useState } from "react"
import { useCart } from "@/hooks/useCart"
import { BillingForm } from "@/components/storefront/orders/billing-form"
import { PaymentMethodSelector, PaymentMethod } from "@/components/storefront/orders/payment-method-selector"
import { PromotionInput } from "@/components/storefront/orders/promotion-input"
import { useCheckout } from "@/hooks/useCheckout"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import toast from "react-hot-toast"
import { BillingDetails } from "@/lib/types"
import { Breadcrumb } from "@/components/breadcrumb"
import { ShoppingBag } from "lucide-react"
import LoadingSkeleton from "@/common/shared/loadingSkeleton"

export default function CheckoutPage() {
    const { cart, loading } = useCart()
    const { processCheckout, loading: processingCheckout } = useCheckout()
    const [mounted, setMounted] = useState(false)
    const [step, setStep] = useState<"billing" | "payment">("billing")
    const [billingDetails, setBillingDetails] = useState<BillingDetails | null>(null)
    const [promotionDiscount, setPromotionDiscount] = useState(0)
    const [promotionCode, setPromotionCode] = useState("")

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted || loading) {
        return <div className="min-h-screen flex items-center justify-center"><LoadingSkeleton /></div>
    }

    if (!cart || cart.items.length === 0) {
        return (
            <main className="min-h-screen bg-background flex items-center justify-center">
                <div className="w-full text-center">
                    <div className="p-4 bg-primary/20 flex flex-col gap-2 items-center justify-between">
                        <div className="flex gap-2 items-center">
                            <h1 className="text-2xl">Checkout</h1>
                            <div className="relative w-8 h-8 items-center justify-center flex">
                                <ShoppingBag className="h-6 w-6 absolute z-2" /> <span className="absolute top-0 right-0 z-1 w-5 h-5 bg-amber-300 rounded-full"></span>
                            </div>
                        </div>
                        <Breadcrumb
                            className="capitalize"
                            items={[
                                { label: "Home", href: "/home" },
                                { label: "Shop", href: "/shop" },
                                { label: 'Cart', href: '/cart' },
                                { label: 'Checkout' }
                            ]}
                        />
                    </div>
                    <h1 className="text-2xl font-semibold mb-4">Your cart is empty</h1>
                    <Link href="/shop">
                        <Button>Continue Shopping</Button>
                    </Link>
                </div>
            </main>
        )
    }

    const subtotal = cart.items.reduce((acc, item) => {
        return acc + parseFloat(item.variant.price) * item.quantity
    }, 0)

    const discount = (subtotal * promotionDiscount) / 100
    const tax = (subtotal - discount) * 0
    const total = subtotal - discount + tax

    const handleBillingSubmit = (details: BillingDetails) => {
        setBillingDetails(details)
        setStep("payment")
    }

    const handleApplyPromotion = (code: string, discountPercent: number) => {
        setPromotionCode(code)
        setPromotionDiscount(discountPercent)
    }

    const handlePaymentMethodSelect = async (method: PaymentMethod) => {
        if (!billingDetails) {
            toast.error("Please fill in billing details first")
            return
        }

        const result = await processCheckout({
            billingDetails,
            paymentMethod: method,
            promotionCode,
            subtotal,
            discount,
            tax,
            total,
        })

        if (result.success) {
            // Redirect to order confirmation or payment status page
            window.location.href = `/order-confirmation?orderId=${result.orderId}`
        }
    }

    return (
        <main className="min-h-screen bg-background">
            <div className="w-full">
                <div className="p-4 bg-primary/10 flex flex-col gap-2 items-center justify-between">
                    <div className="flex gap-2 items-center">
                        <h1 className="text-2xl">Checkout</h1>
                        <div className="relative w-8 h-8 items-center justify-center flex">
                            <ShoppingBag className="h-6 w-6 absolute z-2" /> <span className="absolute top-0 right-0 z-1 w-5 h-5 bg-amber-300 rounded-full"></span>
                        </div>
                    </div>
                    <Breadcrumb
                        className="capitalize"
                        items={[
                            { label: "Home", href: "/home" },
                            { label: "Shop", href: "/shop" },
                            { label: 'Cart', href: '/cart' },
                            { label: 'Checkout' }
                        ]}
                    />
                </div>
                <div className="max-w-7xl mx-auto px-6 sm:px-8 py-12">
                    <div className="flex flex-col-reverse md:grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Main Form */}
                        <div className="lg:col-span-2">
                            {step === "billing" && (
                                <BillingForm
                                    onSubmit={handleBillingSubmit}
                                    isLoading={processingCheckout}
                                />
                            )}

                            {step === "payment" && billingDetails && (
                                <div className="space-y-8">
                                    <div className="bg-background/50 p-4 rounded-lg">
                                        <p className="text-sm">
                                            <span className="font-semibold">{billingDetails.fullName}</span>
                                            {" • "}
                                            <span>{billingDetails.email}</span>
                                        </p>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setStep("billing")}
                                            className="mt-2"
                                        >
                                            Edit Details
                                        </Button>
                                    </div>

                                    <PromotionInput
                                        onApply={handleApplyPromotion}
                                        isLoading={processingCheckout}
                                    />

                                    <PaymentMethodSelector
                                        onSelect={handlePaymentMethodSelect}
                                        isLoading={processingCheckout}
                                        total={total}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="border border-primary rounded-sm p-6 sticky top-8">
                                <h2 className="text-lg font-semibold mb-6">Order Summary</h2>

                                <div className="space-y-2 max-h-64 mb-4 overflow-y-auto">
                                    <h3 className="text-xs italic text-muted-foreground">Items</h3>
                                    {cart.items.map((item) => (
                                        <div key={item.id} className="flex justify-between text-sm">
                                            <span>
                                                {item.variant.product.name} ({item.variant.color}, {item.variant.size}) x{" "}
                                                {item.quantity}
                                            </span>
                                            <span>
                                                KES{" "}
                                                {(
                                                    parseFloat(item.variant.price) * item.quantity
                                                ).toFixed(2)}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <div className="border-t border-primary/40 pt-4 space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>Subtotal</span>
                                        <span>KES {subtotal.toFixed(2)}</span>
                                    </div>
                                    {promotionDiscount > 0 && (
                                        <div className="flex justify-between text-sm text-green-600">
                                            <span>Discount ({promotionDiscount}%)</span>
                                            <span>-KES {discount.toFixed(2)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-sm">
                                        <span>Tax (0%)</span>
                                        <span>KES {tax.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between font-semibold text-lg border-t border-border pt-2">
                                        <span>Total</span>
                                        <span>KES {total.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
