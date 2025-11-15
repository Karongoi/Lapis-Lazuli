import { type NextRequest, NextResponse } from "next/server"
import { getPromotions, createPromotion } from "@/db/promotions"
import { PromotionSchema } from "@/schemas/promotion"

export async function GET() {
  try {
    const data = await getPromotions()
    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("[API] GET /admin/promotions", error)
    return NextResponse.json({ error: "Failed to fetch promotions" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = PromotionSchema.parse(body)
    console.log('POST /admin/promotions body', body)
    const data = await createPromotion(parsed)
    return NextResponse.json({ success: true, data }, { status: 201 })
  } catch (error) {
    console.error("[API] POST /admin/promotions", error)
    return NextResponse.json({ error: "Failed to create promotion" }, { status: 500 })
  }
}
