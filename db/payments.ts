import { db } from "@/lib/db"
import { payments, orders } from "@/db/schema"
import { eq, and } from "drizzle-orm"

export async function createPayment(data: typeof payments.$inferInsert) {
    const result = await db.insert(payments).values(data).returning()
    return result[0]
}

export async function getPaymentByOrderId(orderId: number) {
    const result = await db
        .select()
        .from(payments)
        .where(eq(payments.order_id, orderId))
        .limit(1)
    return result[0]
}

export async function updatePaymentStatus(
    paymentId: number,
    status: "pending" | "success" | "failed",
) {
    const result = await db
        .update(payments)
        .set({ status })
        .where(eq(payments.id, paymentId))
        .returning()
    return result[0]
}

export async function getPaymentById(id: number) {
    const result = await db.select().from(payments).where(eq(payments.id, id)).limit(1)
    return result[0]
}
