import { type NextRequest, NextResponse } from "next/server"
import { migrateGuestCartToUser } from "@/db/cart"

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { guestId, userId } = body

        if (!guestId || !userId) {
            return NextResponse.json({ error: "Guest ID and User ID required" }, { status: 400 })
        }

        await migrateGuestCartToUser(guestId, userId)
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("[API] POST /cart/migrate", error)
        return NextResponse.json({ error: "Failed to migrate cart" }, { status: 500 })
    }
}
