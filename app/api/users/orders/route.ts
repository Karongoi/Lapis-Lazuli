import { NextRequest, NextResponse } from "next/server"
import { getUserOrders, getOrderWithItems } from "@/db/orders"

export async function GET(request: NextRequest) {
    try {
        const userId = request.headers.get("x-user-id")
        console.log("Fetching orders for user ID:", userId)

        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            )
        }

        // Fetch all user orders with item counts
        const orders = await getUserOrders(userId)
        console.log(`Found ${orders.length} orders for user ID:`, userId)

        const ordersWithItems = await Promise.all(
            orders.map(async (order) => {
                const fullOrder = await getOrderWithItems(order.id)
                return fullOrder || order
            })
        )

        return NextResponse.json(ordersWithItems)
    } catch (error) {
        console.error("Error fetching user orders:", error)
        return NextResponse.json(
            { error: "Failed to fetch orders" },
            { status: 500 }
        )
    }
}
