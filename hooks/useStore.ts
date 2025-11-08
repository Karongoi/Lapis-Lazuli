import { useQuery } from "@tanstack/react-query"

export const useFetchCollections = () => {
    const { data: collections = [], error, isLoading: isCollectionsLoading } = useQuery({
        queryKey: ["collections"],
        queryFn: async () => {
            const res = await fetch("/api/admin/collections")
            if (!res.ok) throw new Error("Failed to fetch collections")
            const result = await res.json()
            return result.data || []
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 1000 * 60 * 10,
    })
    return { collections, error, isCollectionsLoading }
}

export const useFetchCategories = () => {
    const { data: categories = [], error, isLoading: isCategoriesLoading } = useQuery({
        queryKey: ["categories"],
        queryFn: async () => {
            const res = await fetch("/api/admin/categories")
            if (!res.ok) throw new Error("Failed to fetch categories")
            const result = await res.json()
            return result.data || []
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 1000 * 60 * 10,
    })
    return { categories, error, isCategoriesLoading }
}

export const useFetchProducts = () => {
    const { data: products = [], error, isLoading: isProductsLoading } = useQuery({
        queryKey: ["products"],
        queryFn: async () => {
            const res = await fetch("/api/admin/products")
            if (!res.ok) throw new Error("Failed to fetch products")
            const result = await res.json()
            return result.data || []
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 1000 * 60 * 10,
    })
    return { products, error, isProductsLoading }
}