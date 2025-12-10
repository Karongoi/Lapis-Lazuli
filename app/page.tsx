import Footer from '@/common/widgets/Footer'
import Navbar from '@/common/widgets/Navbar'
import HeroCarousel from '@/components/HeroCarousel'
import React from 'react'

export default async function HomePage() {
    return (
        <div className="min-h-screen flex flex-col w-full">
            <div className="transition-all duration-500 ease-in-out">
                <Navbar />
            </div>
            <HeroCarousel />
            <Footer />
        </div>
    )
}
