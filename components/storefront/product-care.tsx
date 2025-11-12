// components/product/product-care-section.tsx
"use client"

import {
    Ban,
    Shirt,
    CircleSlash2,
    Droplet,
    WashingMachine,
} from "lucide-react"

export function ProductCareSection() {
    const careItems = [
        { icon: <Ban className="w-4 h-4" />, text: "Don’t Bleach" },
        { icon: <Shirt className="w-4 h-4" />, text: "Wash & Iron inside out" },
        { icon: <CircleSlash2 className="w-4 h-4" />, text: "Do not Dry Clean" },
        { icon: <Shirt className="w-4 h-4" />, text: "Touch Up with Warm Iron" },
        { icon: <Droplet className="w-4 h-4" />, text: "Do not Tumble Dry" },
        { icon: <WashingMachine className="w-4 h-4" />, text: "Machine wash Cold Delicate Cycle" },
    ]

    return (
        <ul className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-3">
            {careItems.map((item) => (
                <li key={item.text} className="flex items-center gap-3">
                    {item.icon}
                    <span>{item.text}</span>
                </li>
            ))}
        </ul>
    )
}
