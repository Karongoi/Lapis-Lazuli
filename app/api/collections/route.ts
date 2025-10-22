import { NextResponse } from "next/server"
import { mockCollections } from "@/lib/mockData"

export async function GET() {
    return NextResponse.json(mockCollections)
}
