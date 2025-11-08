import { useQuery } from "@tanstack/react-query";
import { fetchAllProductsFullWithMeta } from "@/lib/fetchProductDetails";

export function useAllProductDetails() {
    return useQuery({
        queryKey: ["full-products-meta"],
        queryFn: fetchAllProductsFullWithMeta,
        staleTime: 5 * 60 * 1000,
        gcTime: 1000 * 60 * 10,
    });
}
