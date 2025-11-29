"use client"

import { useAuth } from "@/context/AuthContext"
import { useState } from "react"
import toast from "react-hot-toast"
import { saveRetryOrder } from "@/lib/retryCheckoutStorage"

export interface CheckoutData {
    billingDetails: {
        fullName: string
        email: string
        phone: string
        address: string
    }
    paymentMethod: "mpesa" | "card"
    promotionCode?: string
    existingOrderId?: number
    subtotal: number
    discount: number
    tax: number
    total: number
}

export function useCheckout() {
    const { user } = useAuth();
    const userId = user?.id
    const [loading, setLoading] = useState(false)
    const [checkoutRequestId, setCheckoutRequestId] = useState<string>("")

    const processCheckout = async (data: CheckoutData) => {
        if (!userId) {
            toast.error("You must be logged in to checkout")
            return { success: false, error: "User not logged in" }
        }
        setLoading(true)
        try {
            let orderId = data.existingOrderId
            let paymentRequired = data.total > 0
            let orderStatus: string | undefined

            if (!orderId) {
                const orderResponse = await fetch("/api/orders/create", {
                    method: "POST",
                    headers: {
                        "x-user-id": userId,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        billingDetails: data.billingDetails,
                        subtotal: data.subtotal,
                        discount: data.discount,
                        tax: data.tax,
                        totalPrice: data.total,
                        promotionCode: data.promotionCode,
                    }),
                })

                if (!orderResponse.ok) {
                    throw new Error("Failed to create order")
                }

                const orderData = await orderResponse.json()
                orderId = orderData.orderId
                paymentRequired = orderData.paymentRequired ?? paymentRequired
                orderStatus = orderData.status
            }

            if (!orderId) {
                throw new Error("Unable to determine order ID")
            }

            if (!paymentRequired || data.total <= 0) {
                toast.success("Order completed. No payment required.")
                return {
                    success: true,
                    orderId,
                    status: orderStatus ?? "paid",
                    paymentRequired: false,
                }
            }

            saveRetryOrder({
                orderId,
                billingDetails: data.billingDetails,
                promotionCode: data.promotionCode,
                paymentMethod: data.paymentMethod,
                savedAt: Date.now(),
            })

            if (data.paymentMethod === "mpesa") {
                const paymentResponse = await fetch("/api/payments/mpesa", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        orderId,
                        amount: data.total,
                        phoneNumber: data.billingDetails.phone,
                        accountReference: `ORD-${orderId}`,
                    }),
                })

                if (!paymentResponse.ok) {
                    throw new Error("Failed to initiate payment")
                }

                const paymentData = await paymentResponse.json()
                setCheckoutRequestId(paymentData.CheckoutRequestID)
                toast.success("Check your phone for the payment prompt")

                return {
                    success: true,
                    orderId,
                    checkoutRequestId: paymentData.CheckoutRequestID,
                    paymentRequired: true,
                    status: orderStatus ?? "pending",
                }
            }

            toast.success("Order created successfully")
            return { success: true, orderId, paymentRequired: true, status: orderStatus ?? "pending" }
        } catch (error) {
            const message = error instanceof Error ? error.message : "Checkout failed"
            toast.error(message)
            return { success: false, error: message }
        } finally {
            setLoading(false)
        }
    }

    return {
        loading,
        checkoutRequestId,
        processCheckout,
    }
}
