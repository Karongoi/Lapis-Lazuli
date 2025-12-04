import { createPayment } from "@/db/payments"
import { getOrderById } from "@/db/checkout"
import { NextRequest, NextResponse } from "next/server"
import { initiateSTKPush } from "@/lib/mpesa-daraja"

export async function POST(request: NextRequest) {
    try {
        const { orderId, amount, phoneNumber, accountReference } = await request.json()

        if (!process.env.MPESA_CONSUMER_KEY || !process.env.MPESA_CONSUMER_SECRET) {
            return NextResponse.json(
                { error: "M-Pesa configuration missing" },
                { status: 500 },
            )
        }

        const order = await getOrderById(orderId)
        if (!order) {
            return NextResponse.json(
                { error: "Order not found" },
                { status: 404 },
            )
        }

        const config = {
            consumerKey: process.env.MPESA_CONSUMER_KEY,
            consumerSecret: process.env.MPESA_CONSUMER_SECRET,
            shortCode: process.env.MPESA_SHORT_CODE || "174379",
            passkey: process.env.MPESA_PASSKEY || "",
            callbackUrl: `${process.env.NEXT_PUBLIC_URL}/api/payments/mpesa/callback`,
            environment: (process.env.MPESA_ENVIRONMENT as "sandbox" | "production") || "sandbox",
        }

        const stkResponse = await initiateSTKPush(config, {
            phoneNumber,
            amount: Math.ceil(amount),
            accountReference,
            description: `Payment for ${accountReference}`,
        })

        // Create payment record
        await createPayment({
            order_id: orderId,
            method: "mpesa",
            amount: amount.toString(),
            status: "pending",
        })

        return NextResponse.json({
            CheckoutRequestID: stkResponse.CheckoutRequestID,
            MerchantRequestID: stkResponse.MerchantRequestID,
            ResponseCode: stkResponse.ResponseCode,
            orderId: orderId,
            success: stkResponse.ResponseCode === "0",
        })
    } catch (error) {
        console.error("Payment error:", error)
        return NextResponse.json(
            { error: "Payment initiation failed" },
            { status: 500 },
        )
    }
}
