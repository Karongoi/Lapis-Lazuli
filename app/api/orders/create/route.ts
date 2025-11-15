import { createOrder, createOrderItems, clearCart } from "@/db/checkout"
import { validatePromotion } from "@/lib/promotionValidator"
import { getCartWithItems, getGuestCart, getUserCart } from "@/db/cart"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
    try {
        const userId = request.headers.get("x-user-id")
        const guestId = request.headers.get("x-guest-id")

        const {
            billingDetails,
            subtotal,
            discount,
            tax,
            totalPrice,
            promotionCode,
        } = await request.json()

        let cart
        if (userId) {
            cart = await getUserCart(userId)
        } else if (guestId) {
            cart = await getGuestCart(guestId)
        } else {
            return NextResponse.json({ error: "No user or guest ID provided" }, { status: 400 })
        }

        // const cartWithItems = await getCartWithItems(cart.id)
        // Get cart
        // const cart = await getCartWithItems(userId || guestId || "")
        if (!cart) {
            return NextResponse.json(
                { error: "Cart not found" },
                { status: 404 },
            )
        }

        // Validate promotion if provided
        let promotionId: number | undefined
        if (promotionCode) {
            const validation = await validatePromotion(promotionCode)
            if (validation.valid && validation.promotion) {
                promotionId = validation.promotion.id
            }
        }

        // Create order
        const order = await createOrder({
            userId: userId || undefined,
            subtotal,
            discount,
            tax,
            totalPrice,
            promotionId,
            billingDetails: {
                fullName: billingDetails.fullName,
                email: billingDetails.email,
                phone: billingDetails.phone,
                address: billingDetails.address,
            },
        })

        // Create order items from cart
        await createOrderItems(order.id, cart.id)

        // Clear cart
        await clearCart(cart.id)

        return NextResponse.json({
            orderId: order.id,
            orderNumber: order.order_number,
        })
    } catch (error) {
        console.error("Order creation error:", error)
        return NextResponse.json(
            { error: "Failed to create order" },
            { status: 500 },
        )
    }
}
