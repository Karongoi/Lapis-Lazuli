import { type NextRequest, NextResponse } from "next/server"
import { getPromotionById, updatePromotion, deletePromotion } from "@/db/promotions"
import { PromotionSchema } from "@/schemas/promotion"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const data = await getPromotionById(Number.parseInt(id))
    if (!data) {
      return NextResponse.json({ error: "Promotion not found" }, { status: 404 })
    }
    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("[API] GET /admin/promotions/[id]", error)
    return NextResponse.json({ error: "Failed to fetch promotion" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const parsed = PromotionSchema.parse(body)
    const data = await updatePromotion(Number.parseInt(id), parsed)
    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("[API] PATCH /admin/promotions/[id]", error)
    return NextResponse.json({ error: "Failed to update promotion " }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await deletePromotion(Number.parseInt(id))
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[API] DELETE /admin/promotions/[id]", error)
    return NextResponse.json({ error: "Failed to delete promotion" }, { status: 500 })
  }
}
