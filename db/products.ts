import { db } from "@/lib/db"
import { products, categories, collections } from "./schema"
import { eq, like } from "drizzle-orm"

export async function getProducts(limit = 50, offset = 0) {
    return db
        .select({
            id: products.id,
            name: products.name,
            design_name: products.design_name,
            price: products.price,
            stock: products.stock,
            status: products.status,
            collection_id: products.collection_id,
            category_id: products.category_id,
            created_at: products.created_at,
            updated_at: products.updated_at,
        })
        .from(products)
        .limit(limit)
        .offset(offset)
}

export async function getProductById(id: number) {
    const result = await db.select().from(products).where(eq(products.id, id)).limit(1)
    return result[0]
}

export async function searchProducts(query: string) {
    return db
        .select()
        .from(products)
        .where(like(products.name, `%${query}%`))
        .limit(20)
}

export async function createProduct(data: typeof products.$inferInsert) {
    const result = await db.insert(products).values(data).returning()
    return result[0]
}

export async function updateProduct(id: number, data: Partial<typeof products.$inferInsert>) {
    const result = await db.update(products).set(data).where(eq(products.id, id)).returning()
    return result[0]
}

export async function deleteProduct(id: number) {
    await db.delete(products).where(eq(products.id, id))
}
