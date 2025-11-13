"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

interface OrderSummaryProps {
    subtotal: number
    tax: number
    total: number
}

export function OrderSummary({ subtotal, tax, total }: OrderSummaryProps) {
    return (
        <div className="lg:col-span-1">
            <div className="border rounded-lg p-6 sticky top-8">
                <h2 className="text-xl font-bold mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6">
                    <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal</span>
                        <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Tax (10%)</span>
                        <span>${tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Shipping</span>
                        <span>FREE</span>
                    </div>
                </div>

                <div className="border-t pt-4 mb-6">
                    <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                    </div>
                </div>

                <Button className="w-full mb-3">Proceed to Checkout</Button>

                <Link href="/shop">
                    <Button variant="outline" className="w-full bg-transparent">
                        Continue Shopping
                    </Button>
                </Link>
            </div>
        </div>
    )
}
