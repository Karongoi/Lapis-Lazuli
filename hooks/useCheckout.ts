"use client"

import { useState } from "react"
import toast from "react-hot-toast"

export interface CheckoutData {
    billingDetails: {
        fullName: string
        email: string
        phone: string
        address: string
    }
    paymentMethod: "mpesa" | "card"
    promotionCode?: string
    subtotal: number
    discount: number
    tax: number
    total: number
}

export function useCheckout() {
    const [loading, setLoading] = useState(false)
    const [checkoutRequestId, setCheckoutRequestId] = useState<string>("")

    const processCheckout = async (data: CheckoutData) => {
        setLoading(true)
        try {
            // Create order
            const orderResponse = await fetch("/api/orders/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
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
            const orderId = orderData.orderId

            // Process payment based on method
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
                }
            }

            toast.success("Order created successfully")
            return { success: true, orderId }
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
