import { Product } from '@/lib/mockData'
import Link from 'next/link'
import React from 'react'

interface ProductCardProps {
    product: Product
    onClose?: () => void
}
export function ProductCard({ product, onClose }: ProductCardProps) {
    return (
        <Link
            key={product.id}
            href={`/product/${product.id}`}
            onClick={onClose}
            className="group border border-border rounded-lg overflow-hidden hover:shadow-lg hover:shadow-primary/30 transition-shadow"
        >
            <div className="aspect-square relative bg-muted overflow-hidden">
                <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                {product.stock == 0 &&
                    <p className="absolute top-2 right-2 z-20 text-xs text-center bg-red-100 border border-red-300 px-1 py-0.5 text-red-400">
                        Out of stock
                    </p>
                }
            </div>
            <div className="p-3">
                <h2 className="text-xs text-muted-foreground">{product.collectionId}</h2>
                <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
                    {product.name}
                </h3>
                <p className="text-sm mb-2">{product.color}</p>
                <p className="font-bold text-secondary">KES {product.price.toFixed(2)}</p>
            </div>
        </Link>
    )
}
