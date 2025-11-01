import { type NextRequest, NextResponse } from "next/server"
import { getCategories, createCategory } from "@/db/categories"

export async function GET() {
  try {
    const data = await getCategories()
    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("[API] GET /admin/categories", error)
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = await createCategory(body)
    return NextResponse.json({ success: true, data }, { status: 201 })
  } catch (error) {
    console.error("[API] POST /admin/categories", error)
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 })
  }
}
