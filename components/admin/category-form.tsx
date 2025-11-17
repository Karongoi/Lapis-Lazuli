"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FormField } from "@/components/admin/form-field"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import LoadingSkeleton from "@/common/shared/loadingSkeleton"

interface CategoryFormProps {
    categoryId?: number
}

export function CategoryForm({ categoryId }: CategoryFormProps) {
    const router = useRouter()
    const isEditing = !!categoryId
    const [loading, setLoading] = useState(isEditing)
    const [submitting, setSubmitting] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})

    const [formData, setFormData] = useState({
        name: "T-shirts",
        gender: "men",
    })

    useEffect(() => {
        if (isEditing && categoryId) {
            fetchCategory(categoryId)
        }
    }, [isEditing, categoryId])

    async function fetchCategory(id: number) {
        try {
            const res = await fetch(`/api/admin/categories/${id}`)
            if (!res.ok) throw new Error("Failed to fetch")
            const { data } = await res.json()
            setFormData({ name: data.name, gender: data.gender })
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    function validateForm() {
        const newErrors: Record<string, string> = {}
        if (!formData.name) newErrors.name = "Category name is required"
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!validateForm()) return

        setSubmitting(true)
        try {
            const url = isEditing ? `/api/admin/categories/${categoryId}` : "/api/admin/categories"
            const method = isEditing ? "PATCH" : "POST"
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            })

            if (!res.ok) throw new Error("Failed to save category")
            router.push("/admin/categories")
        } catch (err) {
            alert(err instanceof Error ? err.message : "An error occurred")
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) return <div className="py-8 text-center"><LoadingSkeleton /></div>

    return (
        <form onSubmit={handleSubmit} className="space-y-6 w-full">
            <Card>
                <CardHeader>
                    <CardTitle>{isEditing ? "Edit Category" : "Create New Category"}</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 gap-6 sm:grid-cols-2 w-full">
                    <FormField label="Category Name" required error={errors.name}>
                        {/* T-Shirts, Hoodies, Cropped Hoodies, Tank Tops, Cropped Tank Tops, Tote bags */}
                        <Select
                            value={formData.name}
                            onValueChange={(val) => setFormData({ ...formData, name: val })}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue  />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="T-Shirts">T-Shirts</SelectItem>
                                <SelectItem value="Hoodies">Hoodies</SelectItem>
                                <SelectItem value="Cropped Hoodies">Cropped Hoodies</SelectItem>
                                <SelectItem value="Tank Tops">Tank Tops</SelectItem>
                                <SelectItem value="Cropped Tank Tops">Cropped Tank Tops</SelectItem>
                                <SelectItem value="Tote Bags">Tote Bags</SelectItem>
                            </SelectContent>
                        </Select>
                    </FormField>

                    <FormField label="Gender">
                        <Select
                            value={formData.gender}
                            onValueChange={(val) => setFormData({ ...formData, gender: val })}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="men">Men</SelectItem>
                                <SelectItem value="women">Women</SelectItem>
                                <SelectItem value="kids">Kids</SelectItem>
                                <SelectItem value="unisex">Unisex</SelectItem>
                            </SelectContent>
                        </Select>
                    </FormField>
                </CardContent>
            </Card>

            <div className="flex gap-2">
                <Button type="submit" disabled={submitting} className="flex-1">
                    {submitting ? "Saving..." : isEditing ? "Update Category" : "Create Category"}
                </Button>
                <Button type="button" variant="outline" onClick={() => router.back()} className="flex-1">
                    Cancel
                </Button>
            </div>
        </form>
    )
}
