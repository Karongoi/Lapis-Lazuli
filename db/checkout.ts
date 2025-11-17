import { db } from "@/lib/db"
import { orders, order_items, carts, cart_items, product_variants, products, product_media } from "@/db/schema"
import { eq } from "drizzle-orm"

export interface CheckoutData {
    userId?: string
    subtotal: number
    discount: number
    tax: number
    totalPrice: number
    promotionId?: number
    billingDetails: {
        fullName: string
        email: string
        phone: string
        address: string
    }
}

export async function createOrder(data: CheckoutData) {
    const orderNumber = `ORD-${Date.now()}`

    const result = await db
        .insert(orders)
        .values({
            user_id: data.userId,
            order_number: orderNumber,
            status: "pending",
            subtotal: data.subtotal.toString(),
            discount: data.discount.toString(),
            tax: data.tax.toString(),
            total_price: data.totalPrice.toString(),
        })
        .returning()

    return result[0]
}

export async function createOrderItems(
    orderId: number,
    cartId: number,
) {
    // Get all cart items
    const items = await db
        .select()
        .from(cart_items)
        .where(eq(cart_items.cart_id, cartId))

    // Create order items
    for (const item of items) {
        await db.insert(order_items).values({
            order_id: orderId,
            product_variant_id: item.product_variant_id,
            quantity: item.quantity,
            unit_price: item.unit_price,
        })
    }

    return items
}

export async function clearCart(cartId: number) {
    await db.delete(cart_items).where(eq(cart_items.cart_id, cartId))
}

export async function getOrderById(orderId: number) {
    const result = await db
        .select()
        .from(orders)
        .where(eq(orders.id, orderId))
        .limit(1)
    return result[0]
}

export async function updateOrderStatus(
    orderId: number,
    status: "pending" | "paid" | "payment_failed" | "shipped" | "delivered" | "cancelled",
) {
    const result = await db
        .update(orders)
        .set({ status })
        .where(eq(orders.id, orderId))
        .returning()
    return result[0]
}
