"use client"
import { useEffect, useMemo, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { AnimatePresence, motion } from "motion/react"
import Image from "next/image"
import { useFetchCollections } from "@/hooks/useStore"
import { useAllProductDetails } from "@/hooks/useFullProducts"
import { Collection, ProductFull } from "@/lib/types"
import { formatCollectionSlug } from "@/lib/constants"
import LoadingSkeleton from "@/common/shared/loadingSkeleton"

interface Slide {
    id: string
    title: string
    description: string
    image: string
    tags: string[]
    ctaLink: string
}

export default function HeroCarousel() {
    const [current, setCurrent] = useState(0)
    const { collections = [] } = useFetchCollections()
    const { data: products = [], isLoading } = useAllProductDetails();

    // select the recently launched collection if not found, use the last collection
    const recentlyLaunchedCollection = collections.sort((a: Collection, b: Collection) =>
        new Date(b.launch_date || "").getTime() - new Date(a.launch_date || "").getTime())[0] || collections[collections.length - 1];
    console.log('Recently Launched Collection:', recentlyLaunchedCollection);

    // Find products where the product.collection.name matches the recently launched collection
    const filteredProducts = useMemo(() => {
        return products.filter(
            (product: ProductFull) => product.collection?.name?.toLowerCase().includes(recentlyLaunchedCollection.name.toLowerCase())
        );
    }, [products, recentlyLaunchedCollection]);
    console.log('Filtered Products for Carousel:', filteredProducts);

    // build the slides from the filtered products
    const slides: Slide[] = useMemo(() => {
        return filteredProducts.slice(0, 3).map((product) => ({
            id: product.id,
            title: product.name || product.design_name,
            description: product.description,
            image: product.media[0].media_url,
            ctaLink: `/collections/${formatCollectionSlug(recentlyLaunchedCollection.name)}`,
            tags: [product.category?.name || ""],
        }))
    }, [filteredProducts])

    const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length)
    const prevSlide = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length)

    useEffect(() => {
        if (current >= slides.length) {
            setCurrent(0);
        }
    }, [slides, current]);

    useEffect(() => {
        const interval = setInterval(nextSlide, 8000)
        return () => clearInterval(interval)
    }, [slides])

    if (!slides.length || isLoading) return <LoadingSkeleton />


    return (
        <section className="relative w-full h-[80vh] overflow-hidden bg-white flex items-center justify-between">
            {/* <div
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
            /> */}
            <motion.div
                key={slides[current]?.id || "placeholder"}
                className="absolute inset-0 bg-center bg-cover sm:bg-contain transition-all duration-700"
                style={{
                    backgroundImage: `url(${slides[current]?.image || "/images/background.png"})`,
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            />

            {/* Overlay for readability */}
            <div className="absolute inset-0 bg-black/30" />

            {/* Social Icons */}
            <div className="absolute left-6 top-1/2 -translate-y-1/2 flex flex-col gap-4 text-primary">
                <Link href="#">
                    <Image className="w-6 h-6" src="/icons/instagram.svg" alt="Instagram Logo" width={100} height={38} />
                </Link>
                <Link href="#">
                    <Image className="w-6 h-6" src="/icons/instagram.svg" alt="Facebook Logo" width={100} height={38} />
                </Link>
                <Link href="#">
                    <Image className="w-6 h-6" src="/icons/tiktok.svg" alt="Tiktok Logo" width={100} height={38} />
                </Link>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={slides[current]?.id}
                    className="z-5 w-full md:w-4/5 h-full mx-auto flex flex-col md:flex-row items-center justify-between px-10 md:px-20"
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.8 }}
                >
                    {/* Text Section */}
                    <div className="text-left my-auto md:my-0 max-w-xl space-y-6">
                        <h1 className="text-lg md:text-xl uppercase text-white drop-shadow-lg">
                            {slides[current]?.title || "Featured Product"}
                        </h1>
                        <p className="text-gray-100">
                            {slides[current]?.description || "Discover our latest collection"}
                        </p>
                        <Link
                            href={slides[current]?.ctaLink || "/shop"}
                            className="inline-block px-6 py-2 bg-primary text-white font-medium hover:bg-foreground transition"
                        >
                            Shop Now
                        </Link>
                    </div>

                    {/* Image */}
                    <motion.img
                        src={slides[current]?.image}
                        alt={slides[current]?.title}
                        className="hidden sm:visible w-[300px] md:w-[450px] object-cover"
                    />
                </motion.div>
            </AnimatePresence>

            {/* Tags */}
            <div className="absolute right-6 top-1/2 -translate-y-1/2 hidden sm:flex flex-col items-end gap-3">
                {slides.map((slide, index) => (
                    <div
                        key={slide?.id}
                        className={`text-sm font-medium cursor-pointer ${index === current ? "text-white" : "text-white/50"
                            }`}
                        onClick={() => setCurrent(index)}
                    >
                        {slide?.title}
                    </div>
                ))}
            </div>

            {/* Chevrons */}
            <button
                onClick={prevSlide}
                className="absolute left-1/2 -translate-x-[200%] bottom-6 bg-white/70 rounded-full p-2 hover:bg-white"
            >
                <ChevronLeft size={20} />
            </button>
            <button
                onClick={nextSlide}
                className="absolute right-1/2 translate-x-[200%] bottom-6 bg-white/70 rounded-full p-2 hover:bg-white"
            >
                <ChevronRight size={20} />
            </button>
        </section>
    )
}
