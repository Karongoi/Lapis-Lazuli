"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { FormField } from "@/components/admin/form-field"

interface CollectionFormProps {
    collectionId?: number
}

export function CollectionForm({ collectionId }: CollectionFormProps) {
    const router = useRouter()
    const isEditing = !!collectionId
    const [loading, setLoading] = useState(isEditing)
    const [submitting, setSubmitting] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})

    const [formData, setFormData] = useState({
        name: "",
        description: "",
    })

    useEffect(() => {
        if (isEditing && collectionId) {
            fetchCollection(collectionId)
        }
    }, [isEditing, collectionId])

    async function fetchCollection(id: number) {
        try {
            const res = await fetch(`/api/admin/collections/${id}`)
            if (!res.ok) throw new Error("Failed to fetch")
            const { data } = await res.json()
            setFormData({ name: data.name, description: data.description })
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    function validateForm() {
        const newErrors: Record<string, string> = {}
        if (!formData.name) newErrors.name = "Collection name is required"
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!validateForm()) return

        setSubmitting(true)
        try {
            const url = isEditing ? `/api/admin/collections/${collectionId}` : "/api/admin/collections"
            const method = isEditing ? "PATCH" : "POST"
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            })

            if (!res.ok) throw new Error("Failed to save collection")
            router.push("/admin/collections")
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
                    <CardTitle>{isEditing ? "Edit Collection" : "Create New Collection"}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <FormField label="Collection Name" required error={errors.name}>
                        <Input
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="e.g., Summer Collection 2024"
                        />
                    </FormField>

                    <FormField label="Description" error={errors.description}>
                        <Textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Collection description..."
                            rows={4}
                        />
                    </FormField>
                </CardContent>
            </Card>

            <div className="flex gap-6 items-center justify-between w-2/3 mx-auto">
                <Button type="submit" disabled={submitting} className="flex-1">
                    {submitting ? "Saving..." : isEditing ? "Update Collection" : "Create Collection"}
                </Button>
                <Button type="button" variant="outline" onClick={() => router.back()} className="flex-1">
                    Cancel
                </Button>
            </div>
        </form>
    )
}
