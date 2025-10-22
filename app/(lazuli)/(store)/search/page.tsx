"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Product } from "@/lib/mockData"
import { ProductCard } from "@/common/shared/productCard"
import { Breadcrumb } from "@/components/breadcrumb"
import { filterProducts } from "@/lib/filterUtils"
import { useFilters } from "@/hooks/useFilters"
import { ResponsiveFilterWrapper } from "@/common/shared/responsive-filter-wrapper"
import { SelectedFilters } from "@/common/shared/selectedFilters"

export default function SearchPage() {
    const searchParams = useSearchParams()
    const query = searchParams.get("q") || ""
    const [results, setResults] = useState<Product[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const { filters, toggleFilter, clearFilter, clearAllFilters } = useFilters()
    const filteredProducts = filterProducts(results, filters)

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
        <div className="min-h-screen bg-background w-full px-4 py-12">
            <Breadcrumb
                className="ml-10"
                items={[
                    { label: "Home", href: "/home" },
                    { label: "Search" },
                ]}
            />
            <div className="flex flex-col md:flex-row w-full gap-6 p-6">
                <aside className="relative w-full max-w-[300px]">
                    <ResponsiveFilterWrapper products={results} filters={filters} onFilterChange={toggleFilter} />
                </aside>

                <main className="flex-1">
                    <div className="max-w-6xl mx-auto">
                        {/* Header */}
                        <div className="mb-8">
                            <h1 className="text-4xl font-bold mb-2">Search Results</h1>
                            <p className="text-sm text-muted-foreground"> {filteredProducts?.length} product{filteredProducts.length !== 1 ? "s" : ""} {query && `results for "${query}"`}</p>
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

                        {!isLoading && filteredProducts.length > 0 && (
                            <>
                                <SelectedFilters filters={filters} onClearFilter={clearFilter} onClearAll={clearAllFilters} />

                                {/* Product Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {filteredProducts.map((product) => (
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
            </div>
        </div>
    )
}
