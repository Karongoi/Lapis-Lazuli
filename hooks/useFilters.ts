"use client"

import { useState, useCallback } from "react"
import { Category, Collection, ProductFull } from "@/lib/types"

export interface Filters {
    categories: Category[]
    collections: Collection[]
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

    const toggleFilter = useCallback(
        (filterType: keyof Filters, value: Category | Collection | string) => {
            setFilters((prev) => {
                // Check if the filter is for category or collection (objects), else for strings
                if (filterType === "categories" || filterType === "collections") {
                    // It's an object with an id
                    const list = prev[filterType] as (Category | Collection)[];
                    const valueWithId = value as Category | Collection;
                    return {
                        ...prev,
                        [filterType]: list.some((item) => item.id === valueWithId.id)
                            ? list.filter((item) => item.id !== valueWithId.id)
                            : [...list, valueWithId],
                    };
                } else {
                    // It's a string (size or color)
                    const list = prev[filterType] as string[];
                    const strValue = value as string;
                    return {
                        ...prev,
                        [filterType]: list.includes(strValue)
                            ? list.filter((item) => item !== strValue)
                            : [...list, strValue],
                    };
                }
            });
        },
        []
    );

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
