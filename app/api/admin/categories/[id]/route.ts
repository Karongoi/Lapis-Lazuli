import { type NextRequest, NextResponse } from "next/server"
import { getCategoryById, updateCategory, deleteCategory } from "@/lib/db/categories"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const data = await getCategoryById(Number.parseInt(id))
    if (!data) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }
    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("[API] GET /admin/categories/[id]", error)
    return NextResponse.json({ error: "Failed to fetch category" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const data = await updateCategory(Number.parseInt(id), body)
    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("[API] PATCH /admin/categories/[id]", error)
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await deleteCategory(Number.parseInt(id))
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[API] DELETE /admin/categories/[id]", error)
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 })
  }
}
