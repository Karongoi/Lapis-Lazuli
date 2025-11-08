import { db } from "@/lib/db"
import { product_media } from "./schema"
import { eq } from "drizzle-orm"

export async function getProductMedia(productId: number) {
    return db.select().from(product_media).where(eq(product_media.product_id, productId))
}

export async function getMediaById(id: number) {
    const result = await db.select().from(product_media).where(eq(product_media.id, id)).limit(1)
    return result[0]
}

export async function getPrimaryMedia(productId: number) {
    const result = await db
        .select()
        .from(product_media)
        .where(eq(product_media.product_id, productId) && eq(product_media.is_primary, true))
        .limit(1)
    return result[0]
}

export async function createMedia(data: typeof product_media.$inferInsert) {
    const result = await db.insert(product_media).values(data).returning()
    return result[0]
}

export async function updateMedia(id: number, data: Partial<typeof product_media.$inferInsert>) {
    const result = await db.update(product_media).set(data).where(eq(product_media.id, id)).returning()
    return result[0]
}

export async function deleteMedia(id: number) {
    await db.delete(product_media).where(eq(product_media.id, id))
}

export async function deleteProductMedia(productId: number) {
    await db.delete(product_media).where(eq(product_media.product_id, productId))
}
