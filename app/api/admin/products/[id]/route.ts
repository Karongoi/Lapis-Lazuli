import { type NextRequest, NextResponse } from "next/server"
import { getProductById, updateProduct, deleteProduct } from "@/db/products"
import { deleteProductVariants, createVariant } from "@/db/variants"
import { deleteProductMedia, createMedia } from "@/db/media"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const data = await getProductById(Number.parseInt(id))
    if (!data) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }
    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("[API] GET /admin/products/[id]", error)
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const productId = Number.parseInt(id)
    const body = await request.json()
    const { variants, media, ...productData } = body

    const product = await updateProduct(productId, productData)

    if (variants) {
      await deleteProductVariants(productId)
      for (const variant of variants) {
        if (variant.id) {
          delete variant.id
        }
        await createVariant({ ...variant, product_id: productId })
      }
    }

    if (media) {
      await deleteProductMedia(productId)
      for (const item of media) {
        if (item.id) {
          delete item.id
        }
        await createMedia({ ...item, product_id: productId })
      }
    }

    return NextResponse.json({ success: true, data: product })
  } catch (error) {
    console.error("[API] PATCH /admin/products/[id]", error)
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const productId = Number.parseInt(id)

    await deleteProductVariants(productId)
    await deleteProductMedia(productId)
    await deleteProduct(productId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[API] DELETE /admin/products/[id]", error)
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 })
  }
}
