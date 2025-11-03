"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { FormField } from "@/components/admin/form-field"

interface PromotionFormProps {
    promotionId?: number
}

export function PromotionForm({ promotionId }: PromotionFormProps) {
    const router = useRouter()
    const isEditing = !!promotionId
    const [loading, setLoading] = useState(isEditing)
    const [submitting, setSubmitting] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})

    const [formData, setFormData] = useState({
        code: "",
        description: "",
        discount_percentage: "",
        valid_from: "",
        valid_until: "",
    })

    useEffect(() => {
        if (isEditing && promotionId) {
            fetchPromotion(promotionId)
        }
    }, [isEditing, promotionId])

    async function fetchPromotion(id: number) {
        try {
            const res = await fetch(`/api/admin/promotions/${id}`)
            if (!res.ok) throw new Error("Failed to fetch")
            const { data } = await res.json()
            setFormData({
                code: data.code,
                description: data.description,
                discount_percentage: data.discount_percentage,
                valid_from: data.valid_from,
                valid_until: data.valid_until,
            })
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    function validateForm() {
        const newErrors: Record<string, string> = {}
        if (!formData.code) newErrors.code = "Promotion code is required"
        if (!formData.discount_percentage) newErrors.discount_percentage = "Discount percentage is required"
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!validateForm()) return

        setSubmitting(true)
        try {
            const payload = {
                ...formData,
                discount_percentage: Number.parseFloat(formData.discount_percentage),
            }
            const url = isEditing ? `/api/admin/promotions/${promotionId}` : "/api/admin/promotions"
            const method = isEditing ? "PATCH" : "POST"
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            })

            if (!res.ok) throw new Error("Failed to save promotion")
            router.push("/admin/promotions")
        } catch (err) {
            alert(err instanceof Error ? err.message : "An error occurred")
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) return <div className="py-8 text-center">Loading...</div>

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>{isEditing ? "Edit Promotion" : "Create New Promotion"}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <FormField label="Promotion Code" required error={errors.code}>
                            <Input
                                value={formData.code}
                                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                placeholder="e.g., SUMMER20"
                            />
                        </FormField>

                        <FormField label="Discount %" required error={errors.discount_percentage}>
                            <Input
                                type="number"
                                step="0.01"
                                value={formData.discount_percentage}
                                onChange={(e) => setFormData({ ...formData, discount_percentage: e.target.value })}
                                placeholder="e.g., 20"
                            />
                        </FormField>
                    </div>

                    <FormField label="Description">
                        <Textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Promotion description..."
                            rows={3}
                        />
                    </FormField>

                    <div className="grid grid-cols-2 gap-4">
                        <FormField label="Valid From">
                            <Input
                                type="datetime-local"
                                value={formData.valid_from}
                                onChange={(e) => setFormData({ ...formData, valid_from: e.target.value })}
                            />
                        </FormField>

                        <FormField label="Valid Until">
                            <Input
                                type="datetime-local"
                                value={formData.valid_until}
                                onChange={(e) => setFormData({ ...formData, valid_until: e.target.value })}
                            />
                        </FormField>
                    </div>
                </CardContent>
            </Card>

            <div className="flex gap-2">
                <Button type="submit" disabled={submitting} className="flex-1">
                    {submitting ? "Saving..." : isEditing ? "Update Promotion" : "Create Promotion"}
                </Button>
                <Button type="button" variant="outline" onClick={() => router.back()} className="flex-1">
                    Cancel
                </Button>
            </div>
        </form>
    )
}
