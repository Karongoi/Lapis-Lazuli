// components/product/product-details-section.tsx
"use client"

import type { ProductFull } from "@/lib/types"

export function ProductDetailsSection({ product }: { product: ProductFull }) {
    const materials = product.material?.split(",").map((m) => m.trim()) || []

    return (
        <ul className="grid grid-cols-2 ml-3 gap-2 mb-3">
            {materials.length > 0 && (
                <>
                        {materials.map((material) => (
                            <li
                                key={material}
                                className="list-disc"
                            >
                                {material}
                            </li>
                        ))}
                </>
            )}
            {product.print_type && (
                    <li className="list-disc">{product.print_type} Print type</li>
            )}
        </ul>
    )
}
