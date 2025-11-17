"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export type PaymentMethod = "mpesa" | "card"

interface PaymentMethodSelectorProps {
    onSelect: (method: PaymentMethod) => void
    isLoading?: boolean
    total: number
}

export function PaymentMethodSelector({
    onSelect,
    isLoading,
    total,
}: PaymentMethodSelectorProps) {
    const [selected, setSelected] = useState<PaymentMethod>("mpesa")

    const handleSelect = (method: PaymentMethod) => {
        setSelected(method)
    }

    const handleContinue = () => {
        onSelect(selected)
    }

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold">Payment Method</h2>

            <div className="space-y-3">
                <label className="flex items-center gap-3 p-4 border border-border rounded-lg cursor-pointer hover:bg-primary/5 transition"
                    onClick={() => handleSelect("mpesa")}
                >
                    <input
                        type="radio"
                        name="payment"
                        checked={selected === "mpesa"}
                        onChange={() => handleSelect("mpesa")}
                        className="w-4 h-4"
                    />
                    <div className="flex-1">
                        <div className="font-semibold">M-Pesa</div>
                        <div className="text-sm text-foreground/60">Pay via M-Pesa STK Push</div>
                    </div>
                </label>

                <label className="flex items-center gap-3 p-4 border border-border/50 rounded-lg cursor-pointer opacity-50"
                    onClick={() => { }}
                >
                    <input
                        type="radio"
                        name="payment"
                        disabled
                        className="w-4 h-4"
                    />
                    <div className="flex-1">
                        <div className="font-semibold">Card Payment</div>
                        <div className="text-sm text-foreground/60">Coming soon</div>
                    </div>
                </label>
            </div>

            <div className="bg-background/50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                    <span>Total Amount:</span>
                    <span className="font-semibold">KES {total.toFixed(2)}</span>
                </div>
            </div>

            <Button
                onClick={handleContinue}
                disabled={isLoading}
                className="w-full"
            >
                {isLoading ? "Processing..." : "Complete Payment"}
            </Button>
        </div>
    )
}
