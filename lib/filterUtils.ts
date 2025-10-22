import { Product } from '@/lib/mockData'

export function getUniqueColors(products: Product[]): string[] {
    const colors = new Set(products.map((p) => p.color))
    return Array.from(colors).sort()
}

export function getUniqueSizes(products: Product[]): string[] {
    const sizes = new Set<string>()
    products.forEach((p) => {
        p.availableSizes.forEach((size) => sizes.add(size))
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
    categories: string[]
    collections: string[]
    sizes: string[]
    colors: string[]
}

export function filterProducts(products: Product[], filters: Filters): Product[] {
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
        if (filters.categories.length > 0 && !filters.categories.includes(product.categoryId)) {
            return false
        }

        // Check collection filter
        if (filters.collections.length > 0 && !filters.collections.includes(product.collectionId)) {
            return false
        }

        // Check color filter
        if (filters.colors.length > 0 && !filters.colors.includes(product.color)) {
            return false
        }

        // Check size filter
        if (filters.sizes.length > 0) {
            const hasSize = filters.sizes.some((size) => product.availableSizes.includes(size))
            if (!hasSize) return false
        }

        return true
    })
}

export function getFilterCounts(
    products: Product[],
    filters: Filters,
    filterType: keyof Filters,
): { [key: string]: number } {
    const counts: { [key: string]: number } = {}

    // Get all possible values for this filter type
    let allValues: string[] = []
    if (filterType === "categories") {
        allValues = Array.from(new Set(products.map((p) => p.categoryId)))
    } else if (filterType === "collections") {
        allValues = Array.from(new Set(products.map((p) => p.collectionId)))
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
