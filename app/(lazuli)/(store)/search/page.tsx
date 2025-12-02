"use client"
import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { ProductCard } from "@/common/shared/productCard"
import { Breadcrumb } from "@/components/breadcrumb"
import { filterProducts } from "@/lib/filterUtils"
import { useFilters } from "@/hooks/useFilters"
import { ResponsiveFilterWrapper } from "@/common/shared/responsive-filter-wrapper"
import { SelectedFilters } from "@/common/shared/selectedFilters"
import { ProductFull } from "@/lib/types"
import { useAllProductDetails } from "@/hooks/useFullProducts"
import LoadingSkeleton from "@/common/shared/loadingSkeleton"

export default function SearchPage() {
    const searchParams = useSearchParams()
    const query = searchParams.get("q") || ""
    const { data: products = [], isLoading } = useAllProductDetails()
    const [debouncedQuery, setDebouncedQuery] = useState("")

    useEffect(() => {
        const timeout = setTimeout(() => setDebouncedQuery(query), 300)
        return () => clearTimeout(timeout)
    }, [query])

    // 🔍 Filter products locally
    const results = useMemo(() => {
        if (!debouncedQuery.trim()) return []
        const query = debouncedQuery.toLowerCase()

        return products.filter((p: ProductFull) => {
            const searchableText = `
          ${p.name}
          ${p.design_name}
          ${p.material || ""}
          ${p.print_type || ""}
          ${(p.variants || []).map(v => `${v.color} ${v.size}`).join(" ")}
          ${p.collection?.name || ""}
          ${p.category?.name || ""}
        `.toLowerCase()

            return searchableText.includes(query)
        })
    }, [debouncedQuery, products])
    const { filters, toggleFilter, clearFilter, clearAllFilters } = useFilters()
    const filteredProducts = filterProducts(results, filters)

    return (
        <div className="min-h-screen bg-background w-full px-4 pt-4 border-t border-border">
            <Breadcrumb
                className="ml-10"
                items={[
                    { label: "Home", href: "/" },
                    { label: "Search" },
                ]}
            />
            <div className="flex flex-col md:flex-row w-full gap-6 px-6">
                <aside className="relative w-full max-w-[300px]">
                    <ResponsiveFilterWrapper products={results} filters={filters} onFilterChange={toggleFilter} />
                </aside>

                <main className="flex-1">
                    <div className="max-w-6xl mx-auto">
                        {/* Header */}
                        <div className="mb-8">
                            <h1 className="text-2xl font-bold mb-2">Search Results</h1>
                            <p className="text-sm text-muted-foreground"> {filteredProducts?.length} product{filteredProducts.length !== 1 ? "s" : ""} {query && `results for "${query}"`}</p>
                        </div>

                        {/* Results */}
                        {isLoading && <p className="text-muted-foreground"><LoadingSkeleton /></p>}

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
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
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
