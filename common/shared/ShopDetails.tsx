"use client"
import { ProductCard } from "@/common/shared/productCard"
import { filterProducts } from "@/lib/filterUtils"
import { useFilters } from "@/hooks/useFilters"
import { SelectedFilters } from "@/common/shared/selectedFilters"
import { ResponsiveFilterWrapper } from "@/common/shared/responsive-filter-wrapper"
import { ProductFull } from "@/lib/types"

type ShopDetailsProps = {
    initialProducts: ProductFull[]
}

export function ShopDetails({ initialProducts }: ShopDetailsProps) {
    const { filters, toggleFilter, clearFilter, clearAllFilters } = useFilters()
    const filteredProducts = filterProducts(initialProducts, filters)

    return (
        <div className="flex flex-col md:flex-row w-full gap-6 px-6">
            <aside className="relative w-full max-w-[300px]">
                <ResponsiveFilterWrapper products={initialProducts} filters={filters} onFilterChange={toggleFilter} />
            </aside>

            <main className="flex-1">
                <SelectedFilters filters={filters} onClearFilter={clearFilter} onClearAll={clearAllFilters} />

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12">
                            <p className="text-muted-foreground">No products found for this.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
