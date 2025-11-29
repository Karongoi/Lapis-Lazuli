"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Trash2, Plus, Minus } from "lucide-react"
import toast from "react-hot-toast"
import { CartItem, ProductMedia } from "@/lib/types"

interface CartItemsProps {
    items: CartItem[]
    onUpdateQuantity: (itemId: number, newQuantity: number) => Promise<void>
    onRemoveItem: (itemId: number) => Promise<void>
}

export function CartItems({ items, onUpdateQuantity, onRemoveItem }: CartItemsProps) {
    const [updatingId, setUpdatingId] = useState<number | null>(null)
    console.log('CartItems items', items)

    const handleUpdateQuantity = async (itemId: number, newQuantity: number, stock: number) => {
        if (newQuantity < 1) return

        // enforce max stock
        if (newQuantity > stock) {
            toast.error(`Only ${stock} units available`)
            return
        }
        setUpdatingId(itemId)
        try {
            await onUpdateQuantity(itemId, newQuantity)
            toast.success("Quantity updated successfully")
        } catch (error) {
            toast.error("Failed to update quantity")
        } finally {
            setUpdatingId(null)
        }
    }

    const handleRemoveItem = async (itemId: number) => {
        try {
            await onRemoveItem(itemId)
            toast.success("Item removed from cart")
        } catch (error) {
            toast.error("Failed to remove item")
        }
    }

    return (
        <div className="w-full">
            {/* <Link href="/shop" className="mt-6 inline-block">
                Continue Shopping
            </Link> */}
            <div className="space-y-4 border-y px-3 py-3 sm:py-6 md:px-0 lg:p-6">
                {items.map((item: CartItem) => {
                    const primaryImage =
                        item.variant.product.media?.find((media: ProductMedia) => media.is_primary)?.media_url || item.variant.product.media?.[0]?.media_url

                    return (
                        <div key={item.id} className="flex gap-4 pb-4 border-b last:border-b-0">
                            {/* Remove Item */}
                            <button
                                onClick={() => handleRemoveItem(item.id)}
                                className="text-muted-foreground hover:text-red-400 transition-colors"
                                aria-label="Remove item"
                            >
                                <Trash2 className="w-6 h-6 xl:w-8 xl:h-8" />
                            </button>

                            {/* Product Image */}
                            <div className="flex-shrink-0">
                                {primaryImage ? (
                                    <Image
                                        src={primaryImage || "/placeholder.svg"}
                                        alt={item.variant.product.name}
                                        width={120}
                                        height={120}
                                        className="w-[120px] h-[120px] object-cover"
                                    />
                                ) : (
                                    <div className="w-[120px] h-[120px] bg-gray-200 rounded-lg flex items-center justify-center text-gray-400">
                                        No image
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full">
                                {/* Product Details */}
                                <div className="flex-1 md:flex-none">
                                    <Link href={`/product/${item.variant.product.id}`}>
                                        <h3 className="font-semibold hover:text-primary transition-colors">{item.variant.product.name}</h3>
                                    </Link>
                                    <p className="text-sm text-gray-600 mt-1">
                                        Color: {item.variant.color} | Size: {item.variant.size}
                                    </p>
                                    <p className="text-sm text-gray-600">SKU: {item.variant.sku}</p>
                                </div>

                                <div className="flex flex-col sm:flex-row justify-between md:justify-evenly items-start md:items-center gap-2 w-full">
                                    {/* Price */}
                                    <p className="font-semibold mt-2 md:mt-0">KES {Number.parseFloat(item.variant.price).toFixed(2)}</p>

                                    {/* Quantity */}
                                    <div className="flex items-center border border-border">
                                        <button
                                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1, item.variant.stock)}
                                            className="px-3 py-1 hover:bg-gray-100 border-r transition-colors"
                                            disabled={item.quantity <= 1 || updatingId === item.id}
                                        >
                                            <Minus size={16} />
                                        </button>
                                        <span className="px-4 py-1 font-semibold">{item.quantity}</span>
                                        <button
                                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1, item.variant.stock)}
                                            className="px-3 py-1 hover:bg-gray-100 border-l transition-colors disabled:text-muted-foreground"
                                            disabled={item.quantity >= item.variant.stock || updatingId === item.id}
                                        >
                                            <Plus size={16} />
                                        </button>
                                    </div>
                                    {/* Total Price */}
                                    <p className="font-semibold">KES {Number.parseFloat((Number.parseFloat(item.variant.price) * item.quantity).toFixed(2))}</p>
                                </div>
                            </div>
                        </div>
                    )
                }
                )}
            </div>
        </div>
    )
}
