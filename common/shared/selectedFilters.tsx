"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Filters } from "@/lib/filterUtils"
import { Category, Collection } from "@/lib/types"

interface SelectedFiltersProps {
    filters: Filters
    onClearFilter: (filterType: keyof Filters, value: string) => void
    onClearAll: () => void
}

export function SelectedFilters({ filters, onClearFilter, onClearAll }: SelectedFiltersProps) {
    const getFilterLabel = (filterType: keyof Filters, value: string | Category | Collection): string => {
        if (filterType === "categories" && typeof value !== "string") {
            return (value as Category).name;
        }
        if (filterType === "collections" && typeof value !== "string") {
            return (value as Collection).name;
        }
        return value as string;
    };

    const allFilters = [
        ...filters.categories.map((v) => ({ type: "categories" as const, value: v })),
        ...filters.collections.map((v) => ({ type: "collections" as const, value: v })),
        ...filters.colors.map((v) => ({ type: "colors" as const, value: v })),
        ...filters.sizes.map((v) => ({ type: "sizes" as const, value: v })),
    ]

    if (allFilters.length === 0) {
        return null
    }

    return (
        <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            {allFilters.map(({ type, value }) => (
                <div
                    key={`${type}-${value}`}
                    className="flex items-center gap-2 border border-primary bg-primary/5 text-secondary-foreground px-3 py-1 rounded-sm text-xs xl:text-sm"
                >
                    <span>{getFilterLabel(type, value)}</span>
                    <button
                        onClick={() => onClearFilter(type, value as string)}
                        className="hover:opacity-70 transition-opacity"
                        aria-label={`Remove ${getFilterLabel(type, value)} filter`}
                    >
                        <X className="h-3 w-3" />
                    </button>
                </div>
            ))}
            <Button
                variant="ghost"
                size="sm"
                onClick={onClearAll}
                className="text-xs text-muted-foreground underline hover:text-foreground"
            >
                Clear All
            </Button>
        </div>
    )
}
