"use client"
import { mockProducts } from "@/lib/mockData"
import { ProductCard } from "@/common/shared/productCard"
import { Breadcrumb } from "@/components/breadcrumb"
import { filterProducts } from "@/lib/filterUtils"
import { useFilters } from "@/hooks/useFilters"
import { SelectedFilters } from "@/common/shared/selectedFilters"
import { ResponsiveFilterWrapper } from "@/common/shared/responsive-filter-wrapper"

export default function ShopPage() {
    const { filters, toggleFilter, clearFilter, clearAllFilters } = useFilters()
    const filteredProducts = filterProducts(mockProducts, filters)

    return (
        <div className="min-h-100vh w-full px-4 py-12">
            <Breadcrumb
                className="ml-8"
                items={[
                    { label: "Home", href: "/home" },
                    { label: "Search" },
                ]}
            />
            <div className="flex flex-col md:flex-row w-full gap-6 p-6">
                <aside className="relative w-full max-w-[300px]">
                    <ResponsiveFilterWrapper products={mockProducts} filters={filters} onFilterChange={toggleFilter} />
                </aside>

                <main className="flex-1">
                    <SelectedFilters filters={filters} onClearFilter={clearFilter} onClearAll={clearAllFilters} />

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                />
                            ))
                        ) : (
                            <div className="col-span-full text-center py-12">
                                <p className="text-muted-foreground">No products match your filters</p>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    )
}
