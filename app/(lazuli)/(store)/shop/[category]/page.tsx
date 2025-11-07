"use client"
import { Breadcrumb } from "@/components/breadcrumb"
import { ShopDetails } from "@/common/shared/ShopDetails"
import { useAllProductDetails } from "@/hooks/useFullProducts";
import { useMemo } from "react";
import { useParams } from "next/navigation";
import { ProductFull } from "@/lib/types";

export default function ShopCategoriesPage() {
    const params = useParams();
    const { data: products = [], isLoading } = useAllProductDetails();
    const categorySlug = typeof params.category === "string" ? params.category : params.category?.[0];

    // Find products where the product.category.name matches the param
    const filteredProducts = useMemo(() => {
        return products.filter(
            (product: ProductFull) => product.category?.name?.toLowerCase().includes(categorySlug?.toLowerCase() || "")
        );
    }, [products, categorySlug]);

    const categoryData = filteredProducts[0]?.category;

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-background w-full pt-4">
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
                        {categoryData?.name ? categoryData.name : categorySlug?.toString()}
                    </h1>
                </div>
            </div>
            <div className="px-4 pt-6">
                <Breadcrumb
                    className="ml-10 capitalize"
                    items={[
                        { label: "Home", href: "/home" },
                        { label: "Shop", href: "/shop" },
                        { label: `${categoryData?.name ? categoryData.name : categorySlug?.toString()}` },
                    ]}
                />
                <ShopDetails initialProducts={filteredProducts || []} />
            </div>
        </div>
    )
}
