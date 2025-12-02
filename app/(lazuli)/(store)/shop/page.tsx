"use client"
import { ProductCard } from "@/common/shared/productCard"
import { Breadcrumb } from "@/components/breadcrumb"
import { filterProducts } from "@/lib/filterUtils"
import { useFilters } from "@/hooks/useFilters"
import { SelectedFilters } from "@/common/shared/selectedFilters"
import { ResponsiveFilterWrapper } from "@/common/shared/responsive-filter-wrapper"
import { useAllProductDetails } from "@/hooks/useFullProducts"
import LoadingSkeleton from "@/common/shared/loadingSkeleton"

export default function ShopPage() {
    const { filters, toggleFilter, clearFilter, clearAllFilters } = useFilters()
    const { data: products, isLoading } = useAllProductDetails();
    const filteredProducts = filterProducts(products || [], filters)

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center"><LoadingSkeleton /></div>;
    }

    return (
        <div className="min-h-100vh w-full">
            <div className="relative bg-primary/10 h-10">
                <div
                    className="absolute inset-0 z-0"
                    style={{
                        backgroundImage: `
        radial-gradient(circle, rgba(236,72,153,0.15) 6px, transparent 7px),
        radial-gradient(circle, rgba(59,130,246,0.15) 6px, transparent 7px),
        radial-gradient(circle, rgba(16,185,129,0.15) 6px, transparent 7px),
        radial-gradient(circle, rgba(245,158,11,0.15) 6px, transparent 7px)
      `,
                        backgroundSize: "60px 60px",
                        backgroundPosition: "0 0, 30px 30px, 30px 0, 0 30px",
                    }}
                />
            </div>
            <Breadcrumb
                className="ml-8 px-4 pt-4 "
                items={[
                    { label: "Home", href: "/" },
                    { label: "Shop" },
                ]}
            />
            <div className="flex flex-col md:flex-row w-full gap-6 px-8">
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
