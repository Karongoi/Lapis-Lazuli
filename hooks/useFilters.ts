"use client"

import { useState, useCallback } from "react"

export interface Filters {
    categories: string[]
    collections: string[]
    sizes: string[]
    colors: string[]
}

export function useFilters() {
    const [filters, setFilters] = useState<Filters>({
        categories: [],
        collections: [],
        sizes: [],
        colors: [],
    })

    const toggleFilter = useCallback((filterType: keyof Filters, value: string) => {
        setFilters((prev) => ({
            ...prev,
            [filterType]: prev[filterType].includes(value)
                ? prev[filterType].filter((item) => item !== value)
                : [...prev[filterType], value],
        }))
    }, [])

    const clearFilter = useCallback((filterType: keyof Filters) => {
        setFilters((prev) => ({
            ...prev,
            [filterType]: [],
        }))
    }, [])

    const clearAllFilters = useCallback(() => {
        setFilters({
            categories: [],
            collections: [],
            sizes: [],
            colors: [],
        })
    }, [])

    const hasActiveFilters = Object.values(filters).some((arr) => arr.length > 0)

    return {
        filters,
        toggleFilter,
        clearFilter,
        clearAllFilters,
        hasActiveFilters,
    }
}
