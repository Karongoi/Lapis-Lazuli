"use client"

import { useState, useMemo } from "react"
import type { ProductVariant } from "@/lib/types"
import { cn } from "@/lib/utils"

interface VariantSelectorProps {
    variants: ProductVariant[]
    onSelectVariant: (variant: ProductVariant) => void
}

// Default size range — always rendered
const DEFAULT_SIZES = ["XS", "S", "M", "L", "XL", "2XL", "3XL"]

export function VariantSelector({ variants, onSelectVariant }: VariantSelectorProps) {
    const colors = useMemo(() => {
        const uniqueColors = [...new Set(variants.map((v) => v.color))]
        return uniqueColors
    }, [variants])

    // Automatically select the first (or only) color
    const [selectedColor, setSelectedColor] = useState<string | null>(colors[0] || null)
    const [selectedSize, setSelectedSize] = useState<string | null>(null)
    const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false)

    const sizes = DEFAULT_SIZES

    const selectedVariant = useMemo(() => {
        if (!selectedSize) return null
        return variants.find((v) => v.size === selectedSize && v.stock > 0) || null
    }, [selectedSize, variants])

    // Auto-select variant when size is chosen
    if (selectedVariant) {
        onSelectVariant(selectedVariant)
    }

    return (
        <div className="space-y-6">
            {/* Color Selection */}
            <div className="flex text-sm gap-2 items-center">
                <p className="font-semibold text-muted-foreground">Color:</p>
                <div className="flex flex-wrap gap-3">
                    {colors.map((color) => {
                        const isSelected = selectedColor === color
                        return (
                            <button
                                key={color}
                                onClick={() => setSelectedColor(color)}
                                className={cn(
                                    "transition-colors text-sm",
                                    isSelected
                                        ? "text-muted-foreground"
                                        : "text-foreground hover:text-muted-foreground",
                                )}
                            >
                                {color}
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Size Selection */}
            <div>
                <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-semibold">Select Size {selectedSize && `- ${selectedSize}`}</label>
                    <button
                        type="button"
                        onClick={() => setIsSizeGuideOpen(true)}
                        className="text-xs text-foreground underline hover:text-foreground/80"
                    >
                        Size Guide
                    </button>
                </div>
                <div className="flex flex-wrap gap-4">
                    {sizes.map((size) => {
                        const isSelected = selectedSize === size
                        const isAvailable = variants.some(
                            (v) =>
                                v.size === size &&
                                (!selectedColor || v.color === selectedColor) &&
                                v.stock > 0
                        )
                        return (
                            <button
                                key={size}
                                type="button"
                                onClick={() => setSelectedSize(size)}
                                disabled={!isAvailable}
                                className={cn(
                                    "py-2 w-12 tet-center border transition-colors text-sm font-medium",
                                    isSelected
                                        ? "border-foreground bg-foreground text-background"
                                        : "border-muted-foreground text-foreground hover:border-foreground",
                                    !isAvailable &&
                                    "opacity-50 cursor-not-allowed line-through text-muted-foreground"
                                )}
                            >
                                {size}
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* SKU Display */}
            {selectedVariant && (
                <div className="pt-4 text-[12px] border-t flex items-center justify-between">
                    <div className="text-muted-foreground">
                        SKU: <span className="font-mono text-foreground">{selectedVariant.sku}</span>
                    </div>
                    <div className="text-muted-foreground">
                        Stock: <span className="text-foreground">{selectedVariant.stock} available</span>
                    </div>
                </div>
            )}
            {/* Size Guide Modal */}
            {isSizeGuideOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-background p-6 max-w-lg w-full relative">
                        <button
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                            onClick={() => setIsSizeGuideOpen(false)}
                        >
                            ✕
                        </button>
                        <h2 className="text-lg font-semibold mb-4">Size Guide</h2>
                        <iframe
                            src="/size-guide.pdf"
                            width="100%"
                            height="400px"
                            className="border"
                            title="Size Guide"
                        ></iframe>
                        <a
                            href="/size-guide.pdf"
                            download
                            className="block mt-4 text-sm mx-auto text-center text-primary hover:bg-foreground hover:text-background px-3 py-2 w-40 border"
                        >
                            Download PDF
                        </a>
                    </div>
                </div>
            )}
        </div>
    )
}
