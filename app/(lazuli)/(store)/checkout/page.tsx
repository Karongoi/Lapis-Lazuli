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
import { BillingDetails, Order } from "@/lib/types"
import { Breadcrumb } from "@/components/breadcrumb"
import { ShoppingBag } from "lucide-react"
import LoadingSkeleton from "@/common/shared/loadingSkeleton"
import { OrderSummary } from "@/components/storefront/checkout/OrderSummary"
import { useSearchParams } from "next/navigation"
import { OrderItemsDisplay } from "@/components/storefront/orders/order-items-display"
import { getRetryOrder, RetryOrderPayload } from "@/lib/retryCheckoutStorage"
import { useOrder } from "@/hooks/useOrders"

export default function CheckoutPage() {
    const searchParams = useSearchParams()
    const retryOrderId = searchParams.get("retryOrder")
    const isRetryFlow = Boolean(retryOrderId)
    const { cart, loading } = useCart()
    const { processCheckout, loading: processingCheckout } = useCheckout()
    const [mounted, setMounted] = useState(false)
    const [step, setStep] = useState<"billing" | "payment">("billing")
    const [billingDetails, setBillingDetails] = useState<BillingDetails | null>(null)
    const [promotionDiscount, setPromotionDiscount] = useState(0)
    const [promotionCode, setPromotionCode] = useState("")
    const [retryPayload, setRetryPayload] = useState<RetryOrderPayload | null>(null)

    // Fetch order using React Query
    const {
        data: retryOrder,
        error: retryError,
        isLoading: retryLoading,
    } = useOrder(retryOrderId ?? "")

    // Restore local retry payload
    useEffect(() => {
        if (!isRetryFlow) return

        const stored = getRetryOrder(retryOrderId!)
        setRetryPayload(stored ?? null)

        if (stored) {
            setBillingDetails(stored.billingDetails)
            setPromotionCode(stored.promotionCode || "")
            setStep("payment")
        }
    }, [retryOrderId, isRetryFlow])

    useEffect(() => {
        setMounted(true)
    }, [])

    const cartItems = cart?.items ?? []
    const cartSubtotal = cartItems.reduce((acc, item) => acc + parseFloat(item.variant.price) * item.quantity, 0)
    const cartDiscount = (cartSubtotal * promotionDiscount) / 100
    const cartTax = (cartSubtotal - cartDiscount) * 0
    const cartTotal = cartSubtotal - cartDiscount + cartTax

    const retrySubtotal = retryOrder ? parseFloat(retryOrder.subtotal) : null
    const retryDiscount = retryOrder ? parseFloat(retryOrder.discount) : null
    const retryTax = retryOrder ? parseFloat(retryOrder.tax) : null
    const retryTotal = retryOrder ? parseFloat(retryOrder.total_price) : null

    const subtotal = retrySubtotal ?? cartSubtotal
    const discount = retryDiscount ?? cartDiscount
    const tax = retryTax ?? cartTax
    const total = retryTotal ?? cartTotal
    const promotionPercent = retrySubtotal && retrySubtotal > 0
        ? (retryDiscount ?? 0) / retrySubtotal * 100
        : promotionDiscount
    const isFreeOrder = total <= 0

    if (!mounted || loading || (isRetryFlow && retryLoading)) {
        return <div className="min-h-screen flex items-center justify-center"><LoadingSkeleton /></div>
    }

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
            existingOrderId: retryOrder?.id,
            subtotal,
            discount,
            tax,
            total,
        })

        if (result.success) {
            toast.success("Checkout successful!")
            // window.location.href = `/order-confirmation?orderId=${result.orderId}`
        } else {
            toast.error(`Checkout failed: ${result.error}`)
        }
    }

    const handleCompleteFreeOrder = () => {
        return handlePaymentMethodSelect("mpesa")
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
                            { label: "Home", href: "/" },
                            { label: "Shop", href: "/shop" },
                            { label: 'Cart', href: '/cart' },
                            { label: 'Checkout' }
                        ]}
                    />
                </div>
                {!isRetryFlow && (!cart || cart.items.length === 0) ? (
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col items-center justify-center">
                        <ShoppingBag className="h-16 w-16 text-gray-300 mb-4" />
                        <h1 className="text-2xl text-gray-600 mb-4">Your cart is empty for checkout</h1>
                        <Link href="/shop">
                            <Button>Continue Shopping</Button>
                        </Link>
                    </div>
                ) : (
                    <div className="max-w-7xl mx-auto px-6 sm:px-8 py-12">
                        <div className={`flex flex-col-reverse md:grid md:grid-cols-2 ${retryOrder} ? '' : 'lg:grid-cols-3'} gap-8`}>
                            {/* Main Form */}
                            <div className={`${retryOrder} ? '' : 'lg:col-span-2'} space-y-6`}>
                                {isRetryFlow && (
                                    <div className={`p-4 rounded-lg text-sm ${retryError ? "bg-red-50 border border-red-200 text-red-700" : "bg-amber-50 border border-amber-200 text-amber-800"}`}>
                                        {retryError
                                            ? retryError.message
                                            : `Retrying payment for order ${retryOrder?.order_number ?? retryOrderId}. Confirm your details to continue.`}
                                    </div>
                                )}

                                {step === "billing" && (
                                    <>
                                        {isRetryFlow && !retryPayload && (
                                            <div className="bg-blue-50 border border-blue-200 text-blue-800 p-3 rounded-md text-xs">
                                                We could not restore your previous billing details. Please fill in the form again to retry payment.
                                            </div>
                                        )}
                                        <BillingForm
                                            onSubmit={handleBillingSubmit}
                                            isLoading={processingCheckout}
                                        />
                                    </>
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

                                        {!isRetryFlow && (
                                            <PromotionInput
                                                onApply={handleApplyPromotion}
                                                isLoading={processingCheckout}
                                            />
                                        )}

                                        {isFreeOrder ? (
                                            <div className="space-y-4">
                                                <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-lg text-sm">
                                                    This order is fully covered by your promotion. No payment details are required—just confirm to place the order.
                                                </div>
                                                <Button
                                                    onClick={handleCompleteFreeOrder}
                                                    disabled={processingCheckout}
                                                    className="w-full"
                                                >
                                                    {processingCheckout ? "Finalizing..." : "Complete Order"}
                                                </Button>
                                            </div>
                                        ) : (
                                            <PaymentMethodSelector
                                                onSelect={handlePaymentMethodSelect}
                                                isLoading={processingCheckout}
                                                total={total}
                                            />
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Order Summary */}
                            {retryOrder ? (
                                <div className="border border-primary rounded-sm p-6 sticky top-8 space-y-6">
                                    <div className="flex justify-between items-center">
                                        <h2 className="text-lg font-semibold">Retry Order Summary</h2>
                                        <span className="text-xs uppercase tracking-wide text-muted-foreground">
                                            {retryOrder.order_number}
                                        </span>
                                    </div>
                                    {retryOrder.items && retryOrder.items.length > 0 && (
                                        <OrderItemsDisplay items={retryOrder.items} />
                                    )}
                                    <div className="border-t border-primary/40 pt-4 space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span>Subtotal</span>
                                            <span>KES {subtotal.toFixed(2)}</span>
                                        </div>
                                        {promotionPercent > 0 && (
                                            <div className="flex justify-between text-sm text-green-600">
                                                <span>Discount ({promotionPercent.toFixed(2)}%)</span>
                                                <span>-KES {discount.toFixed(2)}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between text-sm">
                                            <span>Tax</span>
                                            <span>KES {tax.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between font-semibold text-lg border-t border-border pt-2">
                                            <span>Total</span>
                                            <span>KES {total.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <OrderSummary
                                    items={cartItems}
                                    subtotal={subtotal}
                                    promotionDiscount={promotionDiscount}
                                    discount={discount}
                                    tax={tax}
                                    total={total}
                                />
                            )}
                        </div>
                    </div>)}
            </div>
        </main>
    )
}
