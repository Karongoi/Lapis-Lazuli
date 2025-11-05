import { db } from "@/lib/db"
import { eq } from "drizzle-orm"
import { promotions } from "./schema"

export async function getPromotions() {
    return db.select().from(promotions)
}

export async function getPromotionById(id: number) {
    const result = await db.select().from(promotions).where(eq(promotions.id, id)).limit(1)
    return result[0]
}

export async function createPromotion(data: typeof promotions.$inferInsert) {
    const result = await db.insert(promotions).values(data).returning()
    return result[0]
}

export async function updatePromotion(id: number, data: Partial<typeof promotions.$inferInsert>) {
    const result = await db.update(promotions).set(data).where(eq(promotions.id, id)).returning()
    return result[0]
}

export async function deletePromotion(id: number) {
    await db.delete(promotions).where(eq(promotions.id, id))
}
