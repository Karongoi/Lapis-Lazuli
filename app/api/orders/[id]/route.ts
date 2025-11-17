import { getOrderById } from "@/db/checkout"
import { getOrderWithItems } from "@/db/orders"
import { NextRequest, NextResponse } from "next/server"

export async function GET( request: NextRequest, { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const orderId = parseInt(id)
        if (isNaN(orderId)) {
            return NextResponse.json(
                { error: "Invalid order ID" },
                { status: 400 }
            )
        }

        const order = await getOrderWithItems(orderId)
        if (!order) {
            return NextResponse.json(
                { error: "Order not found" },
                { status: 404 }
            )
        }

        return NextResponse.json(order)
    } catch (error) {
        console.error("Error fetching order:", error)
        return NextResponse.json(
            { error: "Failed to fetch order" },
            { status: 500 }
        )
    }
}
