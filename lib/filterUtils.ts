import { Category, Collection, ProductFull } from "./types"


export function getUniqueColors(products: ProductFull[]): string[] {
    const colors = new Set(products.map((p) => p.variants[0].color))
    return Array.from(colors).sort()
}

export function getUniqueSizes(products: ProductFull[]): string[] {
    const sizes = new Set<string>()
    products.forEach((p) => {
        p.variants.forEach((variant) => sizes.add(variant.size))
    })
    return Array.from(sizes).sort((a, b) => {
        // Custom sort for sizes
        const sizeOrder: { [key: string]: number } = {
            XS: 1,
            S: 2,
            M: 3,
            L: 4,
            XL: 5,
            XXL: 6,
            "One Size": 7,
        }
        return (sizeOrder[a] || 999) - (sizeOrder[b] || 999)
    })
}

export interface Filters {
    categories: Category[]
    collections: Collection[]
    sizes: string[]
    colors: string[]
}

export function filterProducts(products: ProductFull[], filters: Filters): ProductFull[] {
    return products.filter((product) => {
        // If no filters are selected, include all products
        if (
            filters.categories.length === 0 &&
            filters.collections.length === 0 &&
            filters.sizes.length === 0 &&
            filters.colors.length === 0
        ) {
            return true
        }

        // Check category filter
        if (filters.categories.length > 0 && !filters.categories.some((c) => c.id === product.category?.id)) {
            return false
        }

        // Check collection filter
        if (filters.collections.length > 0 && !filters.collections.some((c) => c.id === product.collection?.id)) {
            return false
        }

        // Check color filter
        if (filters.colors.length > 0 && !product.variants.some(v => filters.colors.includes(v.color))) {
            return false;
        }

        // Check size filter
        if (filters.sizes.length > 0 && !product.variants.some(v => filters.sizes.includes(v.size))) {
            return false;
        }

        return true
    })
}

export function getFilterCounts(
    products: ProductFull[],
    filters: Filters,
    filterType: keyof Filters,
): { [key: string]: number } {
    const counts: { [key: string]: number } = {}

    // Get all possible values for this filter type
    let allValues: string[] = []
    if (filterType === "categories") {
        allValues = Array.from(new Set(products.map((p) => p.category?.name || "")))
    } else if (filterType === "collections") {
        allValues = Array.from(new Set(products.map((p) => p.collection?.name || "")))
    } else if (filterType === "colors") {
        allValues = getUniqueColors(products)
    } else if (filterType === "sizes") {
        allValues = getUniqueSizes(products)
    }

    // Count products for each value
    allValues.forEach((value) => {
        const tempFilters = { ...filters, [filterType]: [value] }
        counts[value] = filterProducts(products, tempFilters).length
    })

    return counts
}
