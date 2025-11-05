import { db } from "@/lib/db"
import { categories } from "./schema"
import { eq } from "drizzle-orm"

export async function getCategories() {
    return db.select().from(categories)
}

export async function getCategoryById(id: number) {
    const result = await db.select().from(categories).where(eq(categories.id, id)).limit(1)
    return result[0]
}

export async function createCategory(data: typeof categories.$inferInsert) {
    const result = await db.insert(categories).values(data).returning()
    return result[0]
}

export async function updateCategory(id: number, data: Partial<typeof categories.$inferInsert>) {
    const result = await db.update(categories).set(data).where(eq(categories.id, id)).returning()
    return result[0]
}

export async function deleteCategory(id: number) {
    await db.delete(categories).where(eq(categories.id, id))
}
