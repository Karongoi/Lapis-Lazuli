import { NextResponse } from "next/server"
import { mockProducts } from "@/lib/mockData"

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const collectionId = searchParams.get("collectionId")

    const products = collectionId
        ? mockProducts.filter((p) => p.collectionId === collectionId)
        : mockProducts

    return NextResponse.json(products)
}
