import { type NextRequest, NextResponse } from "next/server"
import { updateCartItem, removeCartItem, getCartWithItems } from "@/db/cart"

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params
        const body = await request.json()
        const { quantity } = body

        await updateCartItem(Number.parseInt(id), quantity)
        const cartId = request.headers.get("x-cart-id")
        const cartWithItems = await getCartWithItems(Number.parseInt(cartId || "0"))

        return NextResponse.json({ success: true, data: cartWithItems })
    } catch (error) {
        console.error("[API] PATCH /cart/[id]", error)
        return NextResponse.json({ error: "Failed to update cart item" }, { status: 500 })
    }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params
        await removeCartItem(Number.parseInt(id))
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("[API] DELETE /cart/[id]", error)
        return NextResponse.json({ error: "Failed to remove cart item" }, { status: 500 })
    }
}
