import { type NextRequest, NextResponse } from "next/server"
import { getProducts, createProduct } from "@/db/products"
import { createVariant } from "@/db/variants"
import { createMedia } from "@/db/media"

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams
        const limit = Number.parseInt(searchParams.get("limit") || "50")
        const offset = Number.parseInt(searchParams.get("offset") || "0")

        const data = await getProducts(limit, offset)
        return NextResponse.json({ success: true, data })
    } catch (error) {
        console.error("[API] GET /admin/products", error)
        return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { variants, media, ...productData } = body

        const product = await createProduct(productData)

        if (variants && variants.length > 0) {
            for (const variant of variants) {
                await createVariant({ ...variant, product_id: product.id })
            }
        }

        if (media && media.length > 0) {
            for (const item of media) {
                await createMedia({ ...item, product_id: product.id })
            }
        }

        return NextResponse.json({ success: true, data: product }, { status: 201 })
    } catch (error) {
        console.error("[API] POST /admin/products", error)
        return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
    }
}
