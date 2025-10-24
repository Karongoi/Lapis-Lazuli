"use client"
import { useEffect, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { AnimatePresence, motion } from "motion/react"
import Image from "next/image"

interface Slide {
    id: string
    title: string
    description: string
    image: string
    tags: string[]
    ctaLink: string
}

export default function HeroCarousel() {
    const [slides, setSlides] = useState<Slide[]>([])
    const [current, setCurrent] = useState(0)

    useEffect(() => {
        const fetchData = async () => {
            const collectionsRes = await fetch("/api/collections")
            const collections = await collectionsRes.json()
            console.log("Fetched collections:", collections)

            const productsRes = await fetch(`/api/products?collectionId=${collections[0].id}`)
            const products = await productsRes.json()
            console.log("Fetched products for carousel:", products)

            const data: Slide[] = collections.slice(0, 3).map((col: any, index: number) => ({
                id: col.id,
                title: col.name,
                description: col.description,
                image: "/images/carousel3.png",
                tags: ["Faith", "Style", "Comfort"],
                ctaLink: `/collections/${col.id}`,
            }))
            setSlides(data)
        }
        fetchData()
    }, [])

    const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length)
    const prevSlide = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length)

    useEffect(() => {
        const interval = setInterval(nextSlide, 8000)
        return () => clearInterval(interval)
    }, [slides])

    if (!slides.length) return null

    return (
        <section className="relative w-full h-[80vh] overflow-hidden bg-white flex items-center justify-between">
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
            {/* Social Icons */}
            <div className="absolute left-6 top-1/2 -translate-y-1/2 flex flex-col gap-4 text-gray-600">
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
                    key={slides[current].id}
                    className="z-5 w-full md:w-4/5 h-full mx-auto flex flex-col md:flex-row items-center justify-between px-10 md:px-20"
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.8 }}
                >
                    {/* Text Section */}
                    <div className="text-center md:text-left max-w-xl space-y-6">
                        <h1 className="text-4xl md:text-5xl font-semibold text-[#1F1F1F]">
                            {slides[current].title}
                        </h1>
                        <p className="text-gray-700">{slides[current].description}</p>
                        <Link
                            href={slides[current].ctaLink}
                            className="inline-block px-6 py-2 bg-primary text-white rounded-sm font-medium hover:bg-foreground transition"
                        >
                            Shop Now
                        </Link>
                    </div>

                    {/* Image */}
                    <motion.img
                        src={slides[current].image}
                        alt={slides[current].title}
                        className="w-[300px] md:w-[450px] object-contain"
                    />
                </motion.div>
            </AnimatePresence>

            {/* Tags */}
            <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col items-end gap-3">
                {slides.map((slide, index) => (
                    <div
                        key={slide.id}
                        className={`text-sm font-medium cursor-pointer ${index === current ? "text-primary" : "text-foreground/50"
                            }`}
                        onClick={() => setCurrent(index)}
                    >
                        {slide.title}
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
