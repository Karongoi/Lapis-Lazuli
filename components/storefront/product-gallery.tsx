"use client"
import { useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { ProductMedia } from "@/lib/types"

interface ProductImageGalleryProps {
    media: ProductMedia[]
    productName: string | null
}

export function ProductImageGallery({ media, productName }: ProductImageGalleryProps) {
    const [selectedImage, setSelectedImage] = useState(media.find((m) => m.is_primary) || media[0])

    if (!media || media.length === 0) {
        return (
            <div className="aspect-square bg-muted flex items-center justify-center rounded-lg">
                <span className="text-muted-foreground">No images available</span>
            </div>
        )
    }

    return (
        <div className="w-full md:sticky top-0 h-auto flex flex-col md:flex-row-reverse gap-4 md:gap-6 lg:gap-8">
            {/* Main Image */}
            <div className="bg-muted aspect-square max-h-[60vh] md:aspect-auto overflow-hidden">
                {selectedImage && (
                    <Image
                        src={selectedImage.media_url || "/placeholder.svg"}
                        alt={productName ? `${productName} - ${selectedImage.media_type}` : selectedImage.media_type}
                        width={600}
                        height={600}
                        className="w-full h-full object-cover"
                    />
                )}
            </div>

            {/* Thumbnail Gallery */}
            {media.length > 1 && (
                <div className="flex md:flex-col gap-3">
                    {media.map((image) => (
                        <button
                            key={image.id}
                            onClick={() => setSelectedImage(image)}
                            className={cn(
                                "relative w-16 h-16 md:h-32 rounded-md overflow-hidden border-2 transition-colors cursor-pointer",
                                selectedImage?.id === image.id ? "border-foreground" : "border-border hover:border-primary",
                            )}
                        >
                            <Image
                                src={image.media_url || "/placeholder.svg"}
                                alt={`${productName} - ${image.media_type}`}
                                width={64}
                                height={64}
                                className="w-full h-full object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}
