import { type NextRequest, NextResponse } from "next/server"
import { updateCartItem, removeCartItem, getCartWithItems } from "@/db/cart"

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params
        const body = await request.json()
        const { quantity } = body

        const updatedItem = await updateCartItem(Number.parseInt(id), quantity)
        console.log('PATCH /cart/[id] updatedItem', updatedItem)

        if (!updatedItem) return NextResponse.json({ success: true, data: null })

        const cart_id = updatedItem.cart_id && Number.parseInt(updatedItem.cart_id.toString()) || 0
        const cartWithItems = await getCartWithItems(cart_id)

        console.log('PATCH /cart/[id] cartWithItems', cartWithItems)
        // Transform cart items to include variant.price from unit_price and product.image_url from primary media
        if (cartWithItems?.items) {
            cartWithItems.items = cartWithItems.items.map((item: any) => {
                // Find primary media image
                const primaryMedia = item.variant?.product?.media?.find((m: any) => m.is_primary) || item.variant?.product?.media?.[0]
                const imageUrl = primaryMedia?.media_url || null

                return {
                    ...item,
                    variant: {
                        ...item.variant,
                        price: item.unit_price || (item.variant?.product?.price && item.variant?.additional_price
                            ? (Number.parseFloat(item.variant.product.price) + Number.parseFloat(item.variant.additional_price || "0")).toFixed(2)
                            : "0.00"),
                        product: {
                            ...item.variant.product,
                            image_url: imageUrl,
                        },
                    },
                }
            })
        }
        console.log('Transformed PATCH /cart/[id] cartWithItems', cartWithItems)
        return NextResponse.json({ success: true, data: cartWithItems })
    } catch (error) {
        console.error("[API] PATCH /cart/[id]", error)
        return NextResponse.json({ error: "Failed to update cart item" }, { status: 500 })
    }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params
        await removeCartItem(Number.parseInt(id))
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("[API] DELETE /cart/[id]", error)
        return NextResponse.json({ error: "Failed to remove cart item" }, { status: 500 })
    }
}
