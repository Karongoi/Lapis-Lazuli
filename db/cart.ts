import { db } from "@/lib/db"
import { carts, cart_items, product_variants, products, product_media } from "./schema"
import { eq, and, inArray } from "drizzle-orm"

// Get or create cart for user
export async function getUserCart(userId: string) {
    const cart = await db.select().from(carts).where(eq(carts.user_id, userId)).limit(1)
    console.log('getUserCart', cart)
    if (!cart.length) {
        const newCart = await db.insert(carts).values({ user_id: userId }).returning()
        return newCart[0]
    }
    return cart[0]
}

// Get or create cart for guest
export async function getGuestCart(guestId: string) {
    const cart = await db.select().from(carts).where(eq(carts.guest_id, guestId)).limit(1)
    if (!cart.length) {
        const newCart = await db.insert(carts).values({ guest_id: guestId }).returning()
        return newCart[0]
    }
    return cart[0]
}

// Get cart with all items and product details
export async function getCartWithItems(cartId: number) {
    // Fetch cart with items, variants, and products (without media to avoid relation issues)
    const cart = await db.query.carts.findFirst({
        where: eq(carts.id, cartId),
        with: {
            items: {
                with: {
                    variant: {
                        with: {
                            product: true,
                        },
                    },
                },
            },
        },
    })

    // Manually fetch media for each product to avoid deep relation nesting issues
    if (cart?.items) {
        const productIds = [...new Set(cart.items.map((item: any) => item.variant?.product?.id).filter(Boolean) as number[])]

        if (productIds.length > 0) {
            // Fetch all media for all products in one query
            const allMedia = await db.select().from(product_media).where(inArray(product_media.product_id, productIds))

            // Group media by product_id
            const mediaByProductId = new Map<number, typeof allMedia>()
            for (const mediaItem of allMedia) {
                if (!mediaByProductId.has(mediaItem.product_id!)) {
                    mediaByProductId.set(mediaItem.product_id!, [])
                }
                mediaByProductId.get(mediaItem.product_id!)!.push(mediaItem)
            }

            // Attach media to each product
            for (const item of cart.items) {
                if (item.variant?.product?.id) {
                    const media = mediaByProductId.get(item.variant.product.id) || []
                    if (item.variant.product) {
                        (item.variant.product as any).media = media
                    }
                }
            }
        }
    }

    console.log('getCartWithItems', cart)
    return cart
}

// Add item to cart
export async function addToCart(cartId: number, variantId: number, quantity: number) {
    // Fetch variant with product to calculate price
    const variant = await db.query.product_variants.findFirst({
        where: eq(product_variants.id, variantId),
        with: {
            product: true,
        },
    })

    if (!variant || !variant.product) {
        throw new Error("Variant or product not found")
    }

    // Calculate unit price: product base price + variant additional price
    const basePrice = Number.parseFloat(variant.product.price || "0")
    const additionalPrice = Number.parseFloat(variant.additional_price || "0")
    const unitPrice = (basePrice + additionalPrice).toFixed(2)

    const existing = await db
        .select()
        .from(cart_items)
        .where(and(eq(cart_items.cart_id, cartId), eq(cart_items.product_variant_id, variantId)))
        .limit(1)

    if (existing.length > 0) {
        const existingItem = existing[0]
        if (existingItem) {
            // Keep the original unit_price when updating quantity
            const updated = await db
                .update(cart_items)
                .set({ quantity: (existingItem.quantity || 0) + quantity })
                .where(eq(cart_items.id, existingItem.id))
                .returning()
            return updated[0]
        }
    }

    // Insert new item with calculated unit_price
    const item = await db
        .insert(cart_items)
        .values({
            cart_id: cartId,
            product_variant_id: variantId,
            quantity,
            unit_price: unitPrice,
        })
        .returning()
    return item[0]
}

// Update cart item quantity
export async function updateCartItem(itemId: number, quantity: number) {
    if (quantity <= 0) {
        return removeCartItem(itemId)
    }
    const result = await db.update(cart_items).set({ quantity }).where(eq(cart_items.id, itemId)).returning()
    return result[0]
}

// Remove item from cart
export async function removeCartItem(itemId: number) {
    await db.delete(cart_items).where(eq(cart_items.id, itemId))
}

// Clear entire cart
export async function clearCart(cartId: number) {
    await db.delete(cart_items).where(eq(cart_items.cart_id, cartId))
}

// Migrate guest cart to user cart on login
export async function migrateGuestCartToUser(guestId: string, userId: string) {
    // Get guest cart
    const guestCart = await db.select().from(carts).where(eq(carts.guest_id, guestId)).limit(1)

    if (!guestCart.length) return

    // Get user cart
    const userCart = await getUserCart(userId)

    // Copy items from guest cart to user cart
    const guestItems = await db.select().from(cart_items).where(eq(cart_items.cart_id, guestCart[0].id))

    for (const item of guestItems) {
        await addToCart(userCart.id, item.product_variant_id || 0, item.quantity || 0)
    }

    // Delete guest cart
    await clearCart(guestCart[0].id)
    await db.delete(carts).where(eq(carts.guest_id, guestId))
}
