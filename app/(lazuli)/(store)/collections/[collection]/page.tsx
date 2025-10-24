import { mockProducts, Product } from "@/lib/mockData"
import { Breadcrumb } from "@/components/breadcrumb"
import { ShopDetails } from "@/common/shared/ShopDetails"

export default async function CollectionPage({ params }: { params: Promise<{ collection: string }> }) {
    const { collection } = await params
    console.log("collection ID:", collection)

    // Filter products for that collection (later you’ll fetch from DB)
    const products: Product[] = mockProducts.filter(
        (p) => p.collectionId.toLowerCase() === collection?.toLowerCase()
    )

    if (products.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-muted-foreground">No products found for this collection.</p>
            </div>
        );
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
                        {collection?.toString()} Collection
                    </h1>
                </div>
            </div>
            <div className="px-4 pt-6">
                <Breadcrumb
                    className="ml-10 capitalize"
                    items={[
                        { label: "Home", href: "/home" },
                        { label: "Shop", href: "/shop" },
                        { label: `${collection.toString()} Collection` },
                    ]}
                />
                <ShopDetails initialProducts={products} />
            </div>
        </div>
    )
}
