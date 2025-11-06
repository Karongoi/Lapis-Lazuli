"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { SlidersHorizontal } from "lucide-react"
import { Filters } from "@/lib/filterUtils"
import { FilterPanel } from "./filterPanel"
import { ProductFull, Category, Collection } from "@/lib/types"

interface ResponsiveFilterWrapperProps {
    products: ProductFull[]
    filters: Filters
    onFilterChange: (filterType: keyof Filters, value: string | Category | Collection) => void
}

export function ResponsiveFilterWrapper({ products, filters, onFilterChange }: ResponsiveFilterWrapperProps) {
    const [isFilterOpen, setIsFilterOpen] = useState(false)

    return (
        <>
            {/* Mobile Filter Button */}
            <div className="md:hidden">
                <Button onClick={() => setIsFilterOpen(true)} variant="ghost" className="w-fit">
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    Filter & Sort
                </Button>
            </div>

            {/* Filter Panel */}
            <FilterPanel
                products={products}
                filters={filters}
                onFilterChange={onFilterChange}
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
            />
        </>
    )
}
