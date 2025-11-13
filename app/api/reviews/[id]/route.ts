import { type NextRequest, NextResponse } from "next/server"
import { getProductReviews, getProductAverageRating, createReview } from "@/db/reviews"

export async function GET(request: NextRequest) {
    try {
        const productId = request.nextUrl.searchParams.get("productId")

        if (!productId) {
            return NextResponse.json({ error: "Product ID required" }, { status: 400 })
        }

        const reviews = await getProductReviews(Number.parseInt(productId))
        const averageRating = await getProductAverageRating(Number.parseInt(productId))

        return NextResponse.json({
            success: true,
            data: { reviews, averageRating, count: reviews.length },
        })
    } catch (error) {
        console.error("[API] GET /reviews", error)
        return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        const userId = request.headers.get("x-user-id")

        if (!userId) {
            return NextResponse.json({ error: "Authentication required" }, { status: 401 })
        }

        const body = await request.json()
        const { productId, rating, comment } = body

        if (!productId || !rating) {
            return NextResponse.json({ error: "Product ID and rating required" }, { status: 400 })
        }

        const review = await createReview({
            user_id: userId as any,
            product_id: productId,
            rating,
            comment,
        })

        return NextResponse.json({ success: true, data: review }, { status: 201 })
    } catch (error) {
        console.error("[API] POST /reviews", error)
        return NextResponse.json({ error: "Failed to create review" }, { status: 500 })
    }
}
