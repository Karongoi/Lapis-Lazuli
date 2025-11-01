import { type NextRequest, NextResponse } from "next/server"
import { getCollectionById, updateCollection, deleteCollection } from "@/db/collections"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const data = await getCollectionById(Number.parseInt(id))
    if (!data) {
      return NextResponse.json({ error: "Collection not found" }, { status: 404 })
    }
    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("[API] GET /admin/collections/[id]", error)
    return NextResponse.json({ error: "Failed to fetch collection" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const data = await updateCollection(Number.parseInt(id), body)
    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("[API] PATCH /admin/collections/[id]", error)
    return NextResponse.json({ error: "Failed to update collection" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await deleteCollection(Number.parseInt(id))
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[API] DELETE /admin/collections/[id]", error)
    return NextResponse.json({ error: "Failed to delete collection" }, { status: 500 })
  }
}
