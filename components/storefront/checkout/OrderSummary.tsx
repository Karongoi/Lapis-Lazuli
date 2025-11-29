// components/OrderSummary.tsx
import { CartItem } from "@/lib/types";
import React from "react";

interface OrderSummaryProps {
    items: CartItem[];
    subtotal: number;
    promotionDiscount?: number;
    discount?: number;
    tax?: number;
    total: number;
}

export function OrderSummary({
    items,
    subtotal,
    promotionDiscount = 0,
    discount = 0,
    tax = 0,
    total,
}: OrderSummaryProps) {
    return (
        <div className="border border-primary rounded-sm p-6 sticky top-8">
            <h2 className="text-lg font-semibold mb-6">Order Summary</h2>

            <div className="space-y-2 max-h-64 mb-4 overflow-y-auto">
                <h3 className="text-xs italic text-muted-foreground">Items</h3>
                {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                        <span>
                            {item.variant.product.name} ({item.variant.color}, {item.variant.size}) x{" "}
                            {item.quantity}
                        </span>
                        <span>
                            KES {(parseFloat(item.variant.price) * item.quantity).toFixed(2)}
                        </span>
                    </div>
                ))}
            </div>

            <div className="border-t border-primary/40 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>KES {subtotal.toFixed(2)}</span>
                </div>
                {promotionDiscount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                        <span>Discount ({promotionDiscount}%)</span>
                        <span>-KES {discount.toFixed(2)}</span>
                    </div>
                )}
                <div className="flex justify-between text-sm">
                    <span>Tax (0%)</span>
                    <span>KES {tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg border-t border-border pt-2">
                    <span>Total</span>
                    <span>KES {total.toFixed(2)}</span>
                </div>
            </div>
        </div>
    );
};