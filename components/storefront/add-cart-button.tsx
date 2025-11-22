"use client"

import { useState } from "react"
import { useCart } from "@/hooks/useCart"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import toast from "react-hot-toast"

interface AddToCartButtonProps {
    variantId: number
    variantName: string
    stock: number
    disabled?: boolean
}

export function AddToCartButton({ variantId, variantName, stock, disabled = false }: AddToCartButtonProps) {
    const [quantity, setQuantity] = useState(1)
    const [isAdding, setIsAdding] = useState(false)
    const { addItem } = useCart()

    const handleAddToCart = async () => {
        if (stock <= 0) {
            toast.error("Product is out of stock")
            return
        }

        if (quantity > stock) {
            toast.error(`Only ${stock} units available for ${variantName}`)
            return
        }
        try {
            setIsAdding(true)
            await addItem(variantId, quantity)
            toast.success("Added to cart")
        } catch (error) {
            toast.error("Failed to add to cart")
        } finally {
            setIsAdding(false)
        }
    }

    return (
        <div className="flex gap-6">
            <div className="flex items-center border border-border">
                <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 hover:bg-muted border-r transition-colors"
                >
                    −
                </button>
                <span className="px-4 py-2 font-medium">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 hover:bg-muted border-l transition-colors">
                    +
                </button>
            </div>
            <Button onClick={handleAddToCart} disabled={disabled || stock <= 0 || isAdding} size="lg" className="flex-1">
                <ShoppingCart className="mr-2 h-4 w-4" />
                {variantId && stock <= 0 ? "Out of Stock" : isAdding ? "Adding..." : "Add to Cart"}
            </Button>
        </div>
    )
}
