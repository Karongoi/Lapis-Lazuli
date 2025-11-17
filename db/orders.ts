import { db } from "@/lib/db"
import { order_items, orders, product_media, product_variants, products, profiles } from "./schema"
import { and, eq, sql } from "drizzle-orm"

export async function getOrders(limit = 50, offset = 0) {
    return db
        .select({
            id: orders.id,
            order_number: orders.order_number,
            email: profiles.email,
            status: orders.status,
            total_price: orders.total_price,
            created_at: orders.created_at,
        })
        .from(orders)
        .leftJoin(profiles, eq(orders.user_id, profiles.id as any))
        .limit(limit)
        .offset(offset)
}

export async function getOrderById(id: number) {
    const result = await db.select().from(orders).where(eq(orders.id, id)).limit(1)
    return result[0]
}

export async function updateOrderStatus(id: number, status: string) {
    const result = await db.update(orders).set({ status }).where(eq(orders.id, id)).returning()
    return result[0]
}

export async function getOrderWithItems(orderId: number) {
    const order = await db
        .select()
        .from(orders)
        .where(eq(orders.id, orderId))
        .limit(1)

    if (!order.length) return null

    const items = await db
        .select({
            id: order_items.id,
            quantity: order_items.quantity,
            unit_price: order_items.unit_price,
            color: product_variants.color,
            size: product_variants.size,
            sku: product_variants.sku,
            product_name: products.name,
            product_id: products.id,
            media_url: product_media.media_url,
        })
        .from(order_items)
        .where(eq(order_items.order_id, orderId))
        .leftJoin(product_variants, eq(order_items.product_variant_id, product_variants.id))
        .leftJoin(products, eq(product_variants.product_id, products.id))
        .leftJoin(
            product_media,
            and(
                eq(product_media.product_id, products.id),
                eq(product_media.is_primary, true)
            )
        )

    return {
        ...order[0],
        items,
    }
}

export async function getUserOrders(userId: string) {
    const result = await db
        .select({
            id: orders.id,
            user_id: orders.user_id,
            order_number: orders.order_number,
            status: orders.status,
            subtotal: orders.subtotal,
            discount: orders.discount,
            tax: orders.tax,
            total_price: orders.total_price,
            receipt_url: orders.receipt_url,
            created_at: orders.created_at,
            itemCount: sql<number>`COUNT(${order_items.id})`
        })
        .from(orders)
        .leftJoin(order_items, eq(order_items.order_id, orders.id))
        .where(eq(orders.user_id, userId))
        .groupBy(orders.id)

    return result
}