import HeroCarousel from '@/components/HeroCarousel'
import React from 'react'

export default async function HomePage() {
    return (
        <div className="min-h-screen flex flex-col w-full">
            <HeroCarousel />
        </div>
    )
}
