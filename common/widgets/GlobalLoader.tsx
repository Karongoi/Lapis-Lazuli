'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import NProgress from 'nprogress' // optional library for progress bar
import 'nprogress/nprogress.css' // customize in globals.css if desired

export function GlobalRouteLoader() {
    const pathname = usePathname()
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        // When pathname changes, briefly show loader
        setIsLoading(true)
        const timeout = setTimeout(() => setIsLoading(false), 400) // fade out after route change
        return () => clearTimeout(timeout)
    }, [pathname])

    useEffect(() => {
        NProgress.start()
        const timeout = setTimeout(() => NProgress.done(), 400)
        return () => {
            NProgress.done()
            clearTimeout(timeout)
        }
    }, [pathname])

    return (
        <>
            {isLoading && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/50 backdrop-blur-sm">
                    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
            )}
        </>
    )
}
