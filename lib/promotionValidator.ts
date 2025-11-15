import { db } from "@/lib/db"
import { promotions } from "@/db/schema"
import { and, eq, lte, gte } from "drizzle-orm"

export interface PromotionValidationResult {
    valid: boolean
    promotion?: {
        id: number
        code: string
        discountPercentage: number
    }
    error?: string
}

export async function validatePromotion(
    code: string,
    collectionId?: number,
): Promise<PromotionValidationResult> {
    try {
        const now = new Date()

        const promotion = await db
            .select()
            .from(promotions)
            .where(
                and(
                    eq(promotions.code, code.toUpperCase()),
                    eq(promotions.is_active, true),
                    lte(promotions.valid_from, now),
                    gte(promotions.valid_until, now),
                ),
            )
            .limit(1)

        if (!promotion.length) {
            return {
                valid: false,
                error: "Promotion code not found or expired",
            }
        }

        const promo = promotion[0]

        // Check collection restriction if specified
        if (collectionId && promo.collection_id && promo.collection_id !== collectionId) {
            return {
                valid: false,
                error: "This promotion code is not valid for this collection",
            }
        }

        return {
            valid: true,
            promotion: {
                id: promo.id,
                code: promo.code,
                discountPercentage: parseFloat(promo.discount_percentage || "0"),
            },
        }
    } catch (error) {
        console.error("Promotion validation error:", error)
        return {
            valid: false,
            error: "Error validating promotion",
        }
    }
}

export function calculateDiscount(
    subtotal: number,
    discountPercentage: number,
): number {
    return (subtotal * discountPercentage) / 100
}

export function calculateTax(subtotal: number, taxRate: number = 0.16): number {
    return subtotal * taxRate
}
