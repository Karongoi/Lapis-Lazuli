"use client"

import { Truck } from "lucide-react"

export function ProductShippingSection() {
    return (
        <div className="flex items-center gap-2">
            <Truck className="w-4 h-4" />
            <span>Shipping details available at checkout.</span>
        </div>
    )
}
