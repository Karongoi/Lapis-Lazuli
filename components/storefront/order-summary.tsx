"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

interface OrderSummaryProps {
    items: number
    discount: number
    subtotal: number
    total: number
}

export function OrderSummary({ items, discount, subtotal, total }: OrderSummaryProps) {
    return (
        <div className="lg:col-span-1">
            <div className="border border-primary p-6 sticky top-8">
                <h2 className="text-xl font-bold mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6">
                    <div className="flex justify-between">
                        <span className="text-gray-600">Items</span>
                        <span>{items}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal</span>
                        <span>KES {subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600"> Coupon Discount</span>
                        <span>KES {discount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Shipping</span>
                        <span>FREE</span>
                    </div>
                </div>

                <div className="border-t pt-4 mb-6">
                    <div className="flex justify-between text-lg font-semibold">
                        <span>Estimated Total</span>
                        <span>KES {total.toFixed(2)}</span>
                    </div>
                </div>

                <span className="text-sm text-muted-foreground italic ml-auto">Shipping calculated at checkout</span>
                <div className="flex flex-col sm:flex-row md:flex-col items-center w-full gap-4">
                    <Button className="w-full shrink-1">Proceed to Checkout</Button>

                    <Link href="/shop" className="w-full">
                        <Button variant="outline" className="w-full bg-transparent">
                            Continue Shopping
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}
