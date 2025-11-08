import { db } from "@/lib/db"
import { collections } from "./schema"
import { eq } from "drizzle-orm"

export async function getCollections() {
    return db.select().from(collections)
}

export async function getCollectionById(id: number) {
    const result = await db.select().from(collections).where(eq(collections.id, id)).limit(1)
    return result[0]
}

export async function createCollection(data: typeof collections.$inferInsert) {
    const result = await db.insert(collections).values(data).returning()
    return result[0]
}

export async function updateCollection(id: number, data: Partial<typeof collections.$inferInsert>) {
    const result = await db.update(collections).set(data).where(eq(collections.id, id)).returning()
    return result[0]
}

export async function deleteCollection(id: number) {
    await db.delete(collections).where(eq(collections.id, id))
}
