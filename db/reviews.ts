import { db } from "@/lib/db"
import { reviews } from "./schema"
import { eq } from "drizzle-orm"

// Get reviews for a product with user details
export async function getProductReviews(productId: number) {
    return db.query.reviews.findMany({
        where: eq(reviews.product_id, productId),
        with: {
            author: true,
        },
        orderBy: (reviews, { desc }) => [desc(reviews.created_at)],
    })
}

// Get average rating for product
export async function getProductAverageRating(productId: number) {
    const result = await db.select().from(reviews).where(eq(reviews.product_id, productId))

    if (!result.length) return 0

    const avg = result.reduce((sum, review) => sum + (review.rating || 0), 0) / result.length
    return Math.round(avg * 10) / 10
}

// Get or create review for user
export async function getUserProductReview(userId: string, productId: number) {
    const result = await db
        .select()
        .from(reviews)
        .where(eq(reviews.user_id, userId as any) && eq(reviews.product_id, productId))
        .limit(1)

    return result[0]
}

// Create review
export async function createReview(data: typeof reviews.$inferInsert) {
    const result = await db.insert(reviews).values(data).returning()
    return result[0]
}

// Update review
export async function updateReview(id: number, data: Partial<typeof reviews.$inferInsert>) {
    const result = await db.update(reviews).set(data).where(eq(reviews.id, id)).returning()
    return result[0]
}

// Delete review
export async function deleteReview(id: number) {
    await db.delete(reviews).where(eq(reviews.id, id))
}
