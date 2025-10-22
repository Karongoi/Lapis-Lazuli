"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { X } from "lucide-react"
import { Product } from "@/lib/mockData"

interface SearchPopupProps {
    isOpen: boolean
    onClose: () => void
}

export function SearchPopup({ isOpen, onClose }: SearchPopupProps) {
    const [searchQuery, setSearchQuery] = useState("")
    const [results, setResults] = useState<Product[]>([])
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (!searchQuery.trim()) {
            setResults([])
            return
        }

        setIsLoading(true)
        const timer = setTimeout(async () => {
            try {
                const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`)
                const data = await response.json()
                setResults(data.results)
            } catch (error) {
                console.error("Search error:", error)
                setResults([])
            } finally {
                setIsLoading(false)
            }
        }, 300) // Debounce search

        return () => clearTimeout(timer)
    }, [searchQuery])

    if (!isOpen) return null

    return (
        <>
            {/* Overlay */}
            <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

            {/* Popup */}
            <div className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border h-full max-h-100vh overflow-y-auto">
                <div className="max-w-4xl mx-auto p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold">Search Products</h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-muted rounded-lg transition-colors"
                            aria-label="Close search"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Search Input */}
                    <div className="mb-6">
                        <input
                            type="text"
                            placeholder="Search by name, color, collection, or category..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            autoFocus
                            className="w-full px-4 py-3 border border-border rounded-lg bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    {/* Results */}
                    <div>
                        {isLoading && <p className="text-muted-foreground">Searching...</p>}

                        {!isLoading && searchQuery && results.length === 0 && (
                            <p className="text-muted-foreground">No products found matching your search.</p>
                        )}

                        {!isLoading && results.length > 0 && (
                            <>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Showing {Math.min(8, results.length)} of {results.length} results
                                </p>

                                {/* Product Grid - Show 8 results */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                                    {results.slice(0, 8).map((product) => (
                                        <Link
                                            key={product.id}
                                            href={`/product/${product.id}`}
                                            onClick={onClose}
                                            className="group border border-border rounded-lg overflow-hidden hover:shadow-lg hover:shadow-primary/30 transition-shadow"
                                        >
                                            <div className="aspect-square bg-muted overflow-hidden">
                                                <img
                                                    src={product.image || "/placeholder.svg"}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                                />
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
                                    ))}
                                </div>

                                {/* View All Button */}
                                {results.length > 8 && (
                                    <div className="flex justify-center">
                                        <Link
                                            href={`/search?q=${encodeURIComponent(searchQuery)}`}
                                            onClick={onClose}
                                            className="px-6 py-2 bg-foreground text-primary-foreground rounded-sm hover:bg-primary transition-colors font-semibold"
                                        >
                                            View All Results
                                        </Link>
                                    </div>
                                )}
                            </>
                        )}

                        {!searchQuery && (
                            <p className="text-muted-foreground text-center py-8">Start typing to search for products...</p>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}
