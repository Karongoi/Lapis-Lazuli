import { type NextRequest, NextResponse } from "next/server"
import { getCollections, createCollection } from "@/db/collections"

export async function GET() {
    try {
        const data = await getCollections()
        return NextResponse.json({ success: true, data })
    } catch (error) {
        console.error("[API] GET /admin/collections", error)
        return NextResponse.json({ error: "Failed to fetch collections" }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const data = await createCollection(body)
        return NextResponse.json({ success: true, data }, { status: 201 })
    } catch (error) {
        console.error("[API] POST /admin/collections", error)
        return NextResponse.json({ error: "Failed to create collection" }, { status: 500 })
    }
}
