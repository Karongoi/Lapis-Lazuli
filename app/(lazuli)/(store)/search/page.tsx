"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Product } from "@/lib/mockData"
import { ProductCard } from "@/common/shared/productCard"
import { Breadcrumb } from "@/components/breadcrumb"

export default function SearchPage() {
    const searchParams = useSearchParams()
    const query = searchParams.get("q") || ""
    const [results, setResults] = useState<Product[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (!query) {
            setResults([])
            setIsLoading(false)
            return
        }

        const fetchResults = async () => {
            try {
                const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
                const data = await response.json()
                setResults(data.results)
            } catch (error) {
                console.error("Search error:", error)
                setResults([])
            } finally {
                setIsLoading(false)
            }
        }

        fetchResults()
    }, [query])

    return (
        <main className="min-h-screen bg-background">
            <div className="max-w-6xl mx-auto px-4 py-12">
                {/* Header */}
                <div className="mb-8">
                    <Breadcrumb
                        items={[
                            { label: "Home", href: "/home" },
                            { label: "Shop" },
                        ]}
                    />
                    <h1 className="text-4xl font-bold mb-2">Search Results</h1>
                    <p className="text-muted-foreground">{query && `Results for "${query}"`}</p>
                </div>

                {/* Results */}
                {isLoading && <p className="text-muted-foreground">Loading...</p>}

                {!isLoading && results.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground mb-4">
                            {query ? "No products found matching your search." : "Enter a search query to find products."}
                        </p>
                        <Link href="/" className="text-primary hover:underline">
                            Back to home
                        </Link>
                    </div>
                )}

                {!isLoading && results.length > 0 && (
                    <>
                        <p className="text-sm text-muted-foreground mb-6">
                            Found {results.length} product{results.length !== 1 ? "s" : ""}
                        </p>

                        {/* Product Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {results.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </main>
    )
}
