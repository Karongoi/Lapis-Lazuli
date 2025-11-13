"use client"

import { useState } from "react"
import type { ProductVariant } from "@/lib/types"
import type { ProductFull } from "@/lib/types"
import { Button } from "@/components/ui/button"
import toast from "react-hot-toast"
import { VariantSelector } from "./variant-selector"
import { InfoIcon } from "lucide-react"
import { ProductDetailsSection } from "./product-details"
import { ProductCareSection } from "./product-care"
import { ProductShippingSection } from "./product-shipping"
import { Accordion, AccordionItem, AccordionTrigger } from "../ui/accordion"
import { AccordionContent } from "@radix-ui/react-accordion"
import { AddToCartButton } from "./add-cart-button"

interface ProductInfoProps {
    product: ProductFull
}

export function ProductInfo({ product }: ProductInfoProps) {
    const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null)
    const [quantity, setQuantity] = useState(1)
    const [isAdding, setIsAdding] = useState(false)

    const basePrice = Number.parseFloat(product.price)
    const additionalPrice = selectedVariant ? Number.parseFloat(selectedVariant.additional_price) : 0
    const totalPrice = basePrice + additionalPrice

    const handleAddToCart = async () => {
        if (!selectedVariant) {
            toast.error("Please select a variant")
            return
        }

        setIsAdding(true)
        try {
            // TODO: Implement add to cart functionality
            toast.success(`Added ${quantity} x ${product.name || ''} (${selectedVariant.color}, ${selectedVariant.size}) to cart`)
        } catch (error) {
            toast.error("Failed to add to cart")
        } finally {
            setIsAdding(false)
        }
    }

    return (
        <div className="w-full max-w-2xl mx-auto space-y-3">
            {/* Header */}
            <div>
                <div className="flex gap-2 items-center flex-wrap">
                    {product.collection && (
                        <span className="text-xs text-muted-foreground py-1">
                            {product.collection.name}
                        </span>
                    )}
                    {product.stock > 0 && (
                        <span className="text-xs font-medium border border-emerald-500 bg-green-100 text-green-600 px-2 py-0.5 ml-8">
                            In Stock
                        </span>
                    )}
                </div>
                <h1 className="text-2xl capitalize font-medium text-balance">{product.name || ''}</h1>
            </div>

            {/* Price and Category */}
            <div className="space-y-2">
                <div className="text-2xl font-semibold text-primary">KES. {totalPrice}</div>
            </div>

            {/* Description */}
            {product.description && (
                <div className="leading-relaxed">
                    <p>{product.description}</p>
                </div>
            )}

            {/* Variant Selection */}
            <VariantSelector variants={product.variants} onSelectVariant={setSelectedVariant} />

            {/* Quantity and Add to Cart */}
            <div className="space-y-3 pt-4 border-t">
                <div className="flex flex-col gap-4">
                    <span className="text-sm flex gap-2 font-medium">
                        <InfoIcon className="w-4 h-4" />We recommend ordering your actual size
                    </span>
                    <AddToCartButton
                        variantId={selectedVariant ? selectedVariant.id : 0}
                        variantName={selectedVariant ? `${product.name} - ${selectedVariant.color} / ${selectedVariant.size}` : ''}
                        stock={selectedVariant ? selectedVariant.stock : 0}
                        disabled={!selectedVariant || isAdding}
                    />
                </div>

            </div>

            {/* Stock Status */}
            {selectedVariant && selectedVariant.stock === 0 && (
                <div className="p-3 bg-destructive/10 text-destructive rounded-md text-sm">Out of stock</div>
            )}

            {/* Product Details */}
            <Accordion
                type="single"
                collapsible
                defaultValue="item-1"
            >
                <AccordionItem value="item-1">
                    <AccordionTrigger>Product Information</AccordionTrigger>
                    <AccordionContent className="flex flex-col gap-4 text-balance">
                        <ProductDetailsSection product={product} />
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                    <AccordionTrigger>Care Instructions</AccordionTrigger>
                    <AccordionContent className="flex flex-col gap-4 text-balance">
                        <ProductCareSection />
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                    <AccordionTrigger>Shipping & Returns</AccordionTrigger>
                    <AccordionContent className="flex flex-col gap-4 text-balance">
                        <ProductShippingSection />
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    )
}
