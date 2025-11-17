import { validatePromotion } from "@/lib/promotionValidator"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
    try {
        const { code } = await request.json()

        const result = await validatePromotion(code)

        if (!result.valid) {
            return NextResponse.json(
                { error: result.error },
                { status: 400 },
            )
        }

        return NextResponse.json({
            valid: true,
            code: result.promotion?.code,
            discount: result.promotion?.discountPercentage || 0,
        })
    } catch (error) {
        console.error("Validation error:", error)
        return NextResponse.json(
            { error: "Validation failed" },
            { status: 500 },
        )
    }
}
