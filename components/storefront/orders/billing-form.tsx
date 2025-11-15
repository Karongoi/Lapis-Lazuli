"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { FormField } from "@/components/admin/form-field"
import toast from "react-hot-toast"
import { BillingDetails } from "@/lib/types"
import { Input } from "@/components/ui/input"

interface BillingFormProps {
    onSubmit: (details: BillingDetails) => void
    isLoading?: boolean
}

export function BillingForm({ onSubmit, isLoading }: BillingFormProps) {
    const [formData, setFormData] = useState<BillingDetails>({
        fullName: "",
        email: "",
        phone: "",
        address: "",
    })

    const [errors, setErrors] = useState<Partial<BillingDetails>>({})

    const validateForm = () => {
        const newErrors: Partial<BillingDetails> = {}

        if (!formData.fullName.trim()) newErrors.fullName = "Full name is required"
        if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            newErrors.email = "Valid email is required"
        }
        if (!formData.phone.match(/^0\d{9}$|^254\d{9}$/)) {
            newErrors.phone = "Valid phone number is required"
        }
        if (!formData.address.trim()) newErrors.address = "Address is required"

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleChange = (field: keyof BillingDetails, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: undefined }))
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (validateForm()) {
            onSubmit(formData)
        } else {
            toast.error("Please fix the errors in the form")
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-xl font-semibold">Billing Details</h2>

            <FormField
                label="Full Name"
                required
                error={errors.fullName}
            >
                <Input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => handleChange("fullName", e.target.value)}
                    placeholder="John Doe"
                />
            </FormField>

            <FormField
                label="Email"
                required
                error={errors.email}
            >
                <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    placeholder="john@example.com"
                />
            </FormField>

            <FormField
                label="Phone Number"
                required
                error={errors.phone}
            >
                <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    placeholder="0712345678"
                />
            </FormField>

            <FormField
                label="Address"
                required
                error={errors.address}
            >
                <textarea
                    value={formData.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                    placeholder="123 Main St, City, Country"
                    rows={3}
                    className="w-full px-3 py-2 border border-border rounded-md"
                />
            </FormField>

            <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? "Processing..." : "Continue to Payment"}
            </Button>
        </form>
    )
}
