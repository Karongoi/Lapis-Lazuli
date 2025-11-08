"use client"
import { useState } from "react"
import { ChevronDown, X, SlidersHorizontal } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { getUniqueColors, getUniqueSizes, getFilterCounts, type Filters } from "@/lib/filterUtils"
import { ProductFull, Category, Collection } from "@/lib/types"

interface FilterPanelProps {
    products: ProductFull[]
    filters: Filters
    onFilterChange: (filterType: keyof Filters, value: string | Category | Collection) => void
    isOpen?: boolean
    onClose?: () => void
}

export function FilterPanel({ products, filters, onFilterChange, isOpen = true, onClose }: FilterPanelProps) {
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
        categories: true,
        collections: true,
        colors: false,
        sizes: false,
    })

    const toggleSection = (section: string) => {
        setExpandedSections((prev) => ({
            ...prev,
            [section]: !prev[section],
        }))
    }

    // Build unique categories (from product.full.category, filtering out nulls)
    const categoriesArray: Category[] = Array.from(
        new Map(
            products
                .map((p) => p.category)
                .filter((c): c is Category => Boolean(c))
                .map((c) => [c.id, c])
        ).values()
    )

    // Likewise for collections
    const collectionsArray: Collection[] = Array.from(
        new Map(
            products
                .map((p) => p.collection)
                .filter((c): c is Collection => Boolean(c))
                .map((c) => [c.id, c])
        ).values()
    )

    const colors = getUniqueColors(products)
    const sizes = getUniqueSizes(products)
    const categoryCounts = getFilterCounts(products, filters, "categories")
    const collectionCounts = getFilterCounts(products, filters, "collections")
    const colorCounts = getFilterCounts(products, filters, "colors")
    const sizeCounts = getFilterCounts(products, filters, "sizes")

    // Accept either object or string
    type FilterSectionItem = Category | Collection | string

    const FilterSection = ({
        title,
        items,
        filterType,
        counts,
    }: {
        title: string
        items: FilterSectionItem[]
        filterType: keyof Filters
        counts: { [key: string]: number }
    }) => (
        <div className="border-b border-border py-4">
            <button
                onClick={() => toggleSection(filterType)}
                className="flex w-full items-center justify-between text-sm font-semibold text-foreground hover:text-primary transition-colors"
            >
                {title}
                <ChevronDown className={`h-4 w-4 transition-transform ${expandedSections[filterType] ? "rotate-180" : ""}`} />
            </button>

            {expandedSections[filterType] && (
                <div className="mt-4 space-y-3">
                    {items.map((item) => {
                        // Category/Collection: object with id
                        if (filterType === "categories" || filterType === "collections") {
                            const obj = item as Category | Collection
                            return (
                                <div key={obj.id} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`${filterType}-${obj.id}`}
                                        checked={filters[filterType].some((f) => f.id === obj.id)}
                                        onCheckedChange={() => onFilterChange(filterType, obj)}
                                    />
                                    <Label htmlFor={`${filterType}-${obj.id}`} className="flex-1 cursor-pointer text-sm font-normal">
                                        {obj.name}
                                    </Label>
                                    <span className="text-xs text-muted-foreground">({counts[obj.name] || 0})</span>
                                </div>
                            )
                        } else {
                            // color/size: plain string
                            const name = item as string
                            return (
                                <div key={name} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`${filterType}-${name}`}
                                        checked={(filters[filterType] as string[]).includes(name)}
                                        onCheckedChange={() => onFilterChange(filterType, name)}
                                    />
                                    <Label htmlFor={`${filterType}-${name}`} className="flex-1 cursor-pointer text-sm font-normal">
                                        {name}
                                    </Label>
                                    <span className="text-xs text-muted-foreground">({counts[name] || 0})</span>
                                </div>
                            )
                        }
                    })}
                </div>
            )}
        </div>
    )

    const filterContent = (
        <>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-foreground flex gap-2 items-center">
                    <SlidersHorizontal className="h-5 w-5" />
                    Filters
                </h2>
                {onClose && (
                    <button
                        onClick={onClose}
                        className="md:hidden p-1 hover:bg-muted rounded-md transition-colors"
                        aria-label="Close filters"
                    >
                        <X className="h-5 w-5" />
                    </button>
                )}
            </div>

            <FilterSection title="Category" items={categoriesArray} filterType="categories" counts={categoryCounts} />
            <FilterSection title="Collection" items={collectionsArray} filterType="collections" counts={collectionCounts} />
            <FilterSection title="Color" items={colors} filterType="colors" counts={colorCounts} />
            <FilterSection title="Size" items={sizes} filterType="sizes" counts={sizeCounts} />
        </>
    )

    return (
        <>
            {/* Mobile Drawer - visible only on small screens */}
            {isOpen && (
                <div className="fixed inset-0 z-40 md:hidden">
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/50 transition-opacity" onClick={onClose} aria-hidden="true" />
                    {/* Drawer Panel */}
                    <div className="absolute left-0 top-0 bottom-0 w-full max-w-sm bg-card border-r border-border overflow-y-auto p-4 shadow-lg">
                        {filterContent}
                    </div>
                </div>
            )}

            {/* Desktop Sidebar - visible only on medium screens and up */}
            <div className="hidden md:block w-full max-w-xs bg-card border-r border-border p-4 h-[100dvh] sticky top-4 overflow-y-auto">
                {filterContent}
            </div>
        </>
    )
}
