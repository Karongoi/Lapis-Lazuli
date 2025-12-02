import { updateOrderStatus, clearCart } from "@/db/checkout"
import { getPaymentByOrderId, updatePaymentStatus } from "@/db/payments"
import { NextRequest, NextResponse } from "next/server"
import { getUserCart } from "@/db/cart"

export async function POST(request: NextRequest) {
    try {
        const userId = request.headers.get("x-user-id")
        const body = await request.json()
        const { Body } = body

        if (!Body || !Body.stkCallback) {
            return NextResponse.json(
                { ResultCode: 1, ResultDesc: "Invalid request" },
                { status: 400 },
            )
        }

        const { stkCallback } = Body
        const resultCode = stkCallback.ResultCode
        const callbackMetadata = stkCallback.CallbackMetadata

        // Extract order ID from metadata
        const accountReference = callbackMetadata?.CallbackMetadata?.[1]?.Value

        if (!accountReference) {
            return NextResponse.json(
                { ResultCode: 1, ResultDesc: "Invalid callback" },
                { status: 400 },
            )
        }

        // Extract order ID from account reference (ORD-{orderId})
        const orderId = parseInt(accountReference.split("-")[1])

        if (resultCode === 0) {
            // Payment successful
            const amount = callbackMetadata?.CallbackMetadata?.[0]?.Value

            // Update order status
            await updateOrderStatus(orderId, "paid")

            // Update payment status
            const payment = await getPaymentByOrderId(orderId)
            if (payment) {
                await updatePaymentStatus(payment.id, "success")
            }

        let cart
        if (userId) {
            cart = await getUserCart(userId)
        } else {
            return NextResponse.json({ error: `No user or guest ID provided` }, { status: 400 })
            }
            
            if (cart && cart.id) {
                await clearCart(cart.id)
            }

            return NextResponse.json({
                ResultCode: 0,
                ResultDesc: "Payment processed successfully",
            })
        } else {
            await updateOrderStatus(orderId, "payment_failed")

            const payment = await getPaymentByOrderId(orderId)
            if (payment) {
                await updatePaymentStatus(payment.id, "failed")
            }

            return NextResponse.json({
                ResultCode: 1,
                ResultDesc: "Payment failed",
            })
        }
    } catch (error) {
        console.error("Callback error:", error)
        return NextResponse.json(
            { ResultCode: 1, ResultDesc: "Error processing callback" },
            { status: 500 },
        )
    }
}
