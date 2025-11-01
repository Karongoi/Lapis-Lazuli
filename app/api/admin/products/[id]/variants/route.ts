import { type NextRequest, NextResponse } from "next/server"
import { getProductVariants } from "@/db/variants"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const data = await getProductVariants(Number.parseInt(id))
    return NextResponse.json(data)
  } catch (error) {
    console.error("[API] GET /admin/products/[id]/variants", error)
    return NextResponse.json({ error: "Failed to fetch variants" }, { status: 500 })
  }
}
