"use client"
import { ProductImageGallery } from "@/components/storefront/product-gallery"
import { ProductInfo } from "@/components/storefront/product-info"
import { notFound, useParams } from "next/navigation"
import { useProductFull } from "@/hooks/useStore"
import LoadingSkeleton from "@/common/shared/loadingSkeleton"
import { Breadcrumb } from "@/components/breadcrumb"
import { ReviewsSection } from "@/components/storefront/reviews-section"

export default function ProductPage() {
    const params = useParams()
    const productId = Number.parseInt(params.id as string)
    console.log('product page productId', productId)
    const { data: product, isLoading } = useProductFull(productId);
    console.log('product page product', product)

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSkeleton />
            </div>
        )
    }

    if (!product) {
        notFound()
    }

    return (
        <main className="min-h-screen w-full bg-background">
            <div className="p-4 bg-primary/10">
                <Breadcrumb
                    className="ml-10 capitalize"
                    items={[
                        { label: "Home", href: "/" },
                        { label: "Shop", href: "/shop" },
                        { label: `${product?.name ? product.name : 'Product'}` },
                    ]}
                />
            </div>
            <div className="w-full max-w-6xl mx-auto py-8 px-4 md:px-8">
                <div className="w-full relative grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                    {/* Image Gallery */}
                    <ProductImageGallery media={product.media} productName={product.name} />

                    {/* Product Info */}
                    <ProductInfo product={product} />
                </div>
                <ReviewsSection productId={product.id} />
            </div>

            {/* Related Products */}
        </main>
    )
}
