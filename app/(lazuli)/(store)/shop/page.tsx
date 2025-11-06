"use client"
import { mockProducts } from "@/lib/mockData"
import { ProductCard } from "@/common/shared/productCard"
import { Breadcrumb } from "@/components/breadcrumb"
import { filterProducts } from "@/lib/filterUtils"
import { useFilters } from "@/hooks/useFilters"
import { SelectedFilters } from "@/common/shared/selectedFilters"
import { ResponsiveFilterWrapper } from "@/common/shared/responsive-filter-wrapper"
import { useAllProductDetails } from "@/hooks/useFullProducts"

export default function ShopPage() {
    const { filters, toggleFilter, clearFilter, clearAllFilters } = useFilters()
    const { data: products, isLoading } = useAllProductDetails();
    console.log(products);
    const filteredProducts = filterProducts(products || [], filters)

    return (
        <div className="min-h-100vh w-full px-4 pt-4 border-t border-border">
            <Breadcrumb
                className="ml-8"
                items={[
                    { label: "Home", href: "/home" },
                    { label: "Shop" },
                ]}
            />
            <div className="flex flex-col md:flex-row w-full gap-6 px-6">
                <aside className="relative w-full max-w-[300px]">
                    <ResponsiveFilterWrapper products={products || []} filters={filters} onFilterChange={toggleFilter} />
                </aside>

                <main className="flex-1">
                    <SelectedFilters filters={filters} onClearFilter={clearFilter} onClearAll={clearAllFilters} />

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
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
