import { createOrder, createOrderItems, updateOrderStatus } from "@/db/checkout"
import { validatePromotion } from "@/lib/promotionValidator"
import { getUserCart } from "@/db/cart"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
    try {
        const userId = request.headers.get("x-user-id")

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
        } else {
            return NextResponse.json({ error: `No user or guest ID provided` }, { status: 400 })
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

        const paymentRequired = totalPrice > 0

        if (!paymentRequired) {
            await updateOrderStatus(order.id, "paid")
        }

        return NextResponse.json({
            orderId: order.id,
            orderNumber: order.order_number,
            status: paymentRequired ? order.status : "paid",
            paymentRequired,
        })
    } catch (error) {
        console.error("Order creation error:", error)
        return NextResponse.json(
            { error: "Failed to create order" },
            { status: 500 },
        )
    }
}
