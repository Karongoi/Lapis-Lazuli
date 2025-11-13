import { type NextRequest, NextResponse } from "next/server"
import { getUserCart, getGuestCart, getCartWithItems } from "@/db/cart"

export async function GET(request: NextRequest) {
    try {
        const userId = request.headers.get("x-user-id")
        const guestId = request.headers.get("x-guest-id")

        let cart
        if (userId) {
            cart = await getUserCart(userId)
        } else if (guestId) {
            cart = await getGuestCart(guestId)
        } else {
            return NextResponse.json({ error: "No user or guest ID provided" }, { status: 400 })
        }

        const cartWithItems = await getCartWithItems(cart.id)
        console.log('GET /cart cartWithItems', cartWithItems)

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
        console.log('Transformed GET /cart cartWithItems', cartWithItems)

        return NextResponse.json({ success: true, data: cartWithItems })
    } catch (error) {
        console.error("[API] GET /cart", error)
        return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        const userId = request.headers.get("x-user-id")
        const guestId = request.headers.get("x-guest-id")
        const body = await request.json()
        const { variantId, quantity } = body

        let cart
        if (userId) {
            cart = await getUserCart(userId)
        } else if (guestId) {
            cart = await getGuestCart(guestId)
        } else {
            return NextResponse.json({ error: "No user or guest ID provided" }, { status: 400 })
        }

        const { addToCart } = await import("@/db/cart")
        await addToCart(cart.id, variantId, quantity)

        const cartWithItems = await getCartWithItems(cart.id)

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

        return NextResponse.json({ success: true, data: cartWithItems }, { status: 201 })
    } catch (error) {
        console.error("[API] POST /cart", error)
        return NextResponse.json({ error: "Failed to add to cart" }, { status: 500 })
    }
}
