import { type NextRequest, NextResponse } from "next/server"
import { getProductMedia } from "@/db/media"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const data = await getProductMedia(Number.parseInt(id))
    return NextResponse.json(data)
  } catch (error) {
    console.error("[API] GET /admin/products/[id]/media", error)
    return NextResponse.json({ error: "Failed to fetch media" }, { status: 500 })
  }
}
