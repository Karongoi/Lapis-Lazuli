import { db } from "@/lib/db"
import { product_variants } from "./schema"
import { eq } from "drizzle-orm"

export async function getProductVariants(productId: number) {
    return db.select().from(product_variants).where(eq(product_variants.product_id, productId))
}

export async function getVariantById(id: number) {
    const result = await db.select().from(product_variants).where(eq(product_variants.id, id)).limit(1)
    return result[0]
}

export async function createVariant(data: typeof product_variants.$inferInsert) {
    const result = await db.insert(product_variants).values(data).returning()
    return result[0]
}

export async function updateVariant(id: number, data: Partial<typeof product_variants.$inferInsert>) {
    const result = await db.update(product_variants).set(data).where(eq(product_variants.id, id)).returning()
    return result[0]
}

export async function deleteVariant(id: number) {
    await db.delete(product_variants).where(eq(product_variants.id, id))
}

export async function deleteProductVariants(productId: number) {
    await db.delete(product_variants).where(eq(product_variants.product_id, productId))
}
