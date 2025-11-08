import { type NextRequest, NextResponse } from "next/server"
import { getOrderById, updateOrderStatus } from "@/db/orders"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params
        const data = await getOrderById(Number.parseInt(id))
        if (!data) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 })
        }
        return NextResponse.json({ success: true, data })
    } catch (error) {
        console.error("[API] GET /admin/orders/[id]", error)
        return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 })
    }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params
        const body = await request.json()
        const { status } = body
        const data = await updateOrderStatus(Number.parseInt(id), status)
        return NextResponse.json({ success: true, data })
    } catch (error) {
        console.error("[API] PATCH /admin/orders/[id]", error)
        return NextResponse.json({ error: "Failed to update order" }, { status: 500 })
    }
}
