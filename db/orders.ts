import { db } from "@/lib/db"
import { orders, profiles } from "./schema"
import { eq } from "drizzle-orm"

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
