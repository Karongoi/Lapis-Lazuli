import { type NextRequest, NextResponse } from "next/server"
import { getOrders } from "@/db/orders"

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams
        const limit = Number.parseInt(searchParams.get("limit") || "50")
        const offset = Number.parseInt(searchParams.get("offset") || "0")

        const data = await getOrders(limit, offset)
        return NextResponse.json({ success: true, data })
    } catch (error) {
        console.error("[API] GET /admin/orders", error)
        return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
    }
}
