"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import toast from "react-hot-toast"
import { Input } from "@/components/ui/input"

interface PromotionInputProps {
    onApply: (code: string, discount: number) => void
    isLoading?: boolean
}

export function PromotionInput({ onApply, isLoading }: PromotionInputProps) {
    const [code, setCode] = useState("")
    const [validating, setValidating] = useState(false)
    const [applied, setApplied] = useState(false)

    const handleApply = async () => {
        if (!code.trim()) {
            toast.error("Enter a promotion code")
            return
        }

        setValidating(true)
        try {
            const response = await fetch("/api/checkout/validate-promotion", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code }),
            })

            if (!response.ok) {
                const error = await response.json()
                toast.error(error.error || "Invalid promotion code")
                return
            }

            const data = await response.json()
            onApply(code, data.discount)
            setApplied(true)
            toast.success("Promotion applied successfully")
        } catch (error) {
            toast.error("Failed to validate promotion")
        } finally {
            setValidating(false)
        }
    }

    if (applied) {
        return (
            <div className="bg-green-50 border border-green-200 p-3 rounded-lg flex justify-between items-center">
                <span className="text-sm text-green-700">Promotion code applied</span>
                <button
                    onClick={() => {
                        setApplied(false)
                        setCode("")
                        onApply("", 0)
                    }}
                    className="text-xs text-green-600 hover:text-green-700"
                >
                    Remove
                </button>
            </div>
        )
    }

    return (
        <div className="space-y-2">
            <label className="text-sm font-medium">Promotion Code (Optional)</label>
            <div className="flex gap-2 w-full">
                <Input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    placeholder="Enter code"
                    className="flex-1 px-3 py-2 border border-border w-2/3 rounded-md text-sm"
                    disabled={isLoading || validating}
                />
                <Button
                    type="button"
                    onClick={handleApply}
                    disabled={isLoading || validating || !code.trim()}
                >
                    {validating ? "Checking..." : "Apply"}
                </Button>
            </div>
        </div>
    )
}
