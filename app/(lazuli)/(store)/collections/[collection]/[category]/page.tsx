"use client"
import { Breadcrumb } from "@/components/breadcrumb"
import { ShopDetails } from "@/common/shared/ShopDetails"
import { useAllProductDetails } from "@/hooks/useFullProducts";
import { useMemo } from "react";
import { useParams } from "next/navigation";
import { ProductFull } from "@/lib/types";
import LoadingSkeleton from "@/common/shared/loadingSkeleton";

export default function CollectionCategoryPage() {
    const params = useParams();
    const { data: products = [], isLoading } = useAllProductDetails();
    // param eg /imani/t-shirt
    // Extracting the collection and category from the params (supports catch-all/arrays)
    const collectionCategory =
        typeof params.category === "string" ? params.category : params.category?.[0];
    const collectionSlug =
        typeof params.collection === "string" ? params.collection : params.collection?.[0];

    // Find products where the product collection's category matches the param
    const filteredProducts = useMemo(() => {
        return products.filter(
        (product: ProductFull) => {
            const collectionMatch = product.collection?.name?.toLowerCase().includes(collectionSlug?.toLowerCase() || "");
            const categoryMatch = product.category?.name?.toLowerCase().includes(collectionCategory?.toLowerCase() || "");
            return collectionMatch && categoryMatch;
        }
        );
    }, [products, collectionCategory, collectionSlug]);

    const collectionData = filteredProducts[0]?.collection;

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center"><LoadingSkeleton /></div>;
    }

    return (
        <div className="min-h-screen bg-background w-full">
            <div className="relative bg-primary/10 h-20">
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
                <div className="flex gap-4 justify-center items-center h-full my-auto">
                    <h1 className="text-xl md:text-2xl lg:text-3xl capitalize leading-tight">
                        {collectionData?.name ? collectionData.name : collectionCategory?.toString()}
                    </h1>
                </div>
            </div>
            <div className="px-4 pt-6">
                <Breadcrumb
                    className="ml-10 capitalize"
                    items={[
                        { label: "Home", href: "/home" },
                        { label: "Shop", href: "/shop" },
                        { label: `${collectionData?.name ? collectionData.name : collectionCategory?.toString()}`, href: `/collections/${collectionSlug}` },
                        { label: `${collectionCategory?.toString()}` },
                    ]}
                />
                <ShopDetails initialProducts={filteredProducts || []} />
            </div>
        </div>
    )
}
