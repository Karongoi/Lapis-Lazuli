"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function CategoriesPage() {
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchCategories()
    }, [])

    async function fetchCategories() {
        try {
            const res = await fetch("/api/admin/categories")
            if (!res.ok) throw new Error("Failed to fetch")
            const result = await res.json()
            setCategories(result.data || [])
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    async function handleDelete(id: number) {
        if (!confirm("Delete this category?")) return
        try {
            await fetch(`/api/admin/categories/${id}`, { method: "DELETE" })
            setCategories(categories.filter((c: any) => c.id !== id))
        } catch (err) {
            alert("Failed to delete")
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Categories</h1>
                <Link href="/admin/categories/new">
                    <Button>New Category</Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Categories</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="py-8 text-center text-muted-foreground">Loading...</div>
                    ) : (
                        <div className="space-y-4">
                            {categories.map((category: any) => (
                                <div key={category.id} className="flex items-center justify-between rounded-lg border p-4">
                                    <div>
                                        <h3 className="font-semibold">{category.name}</h3>
                                        <p className="text-sm text-muted-foreground">Gender: {category.gender}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm">
                                            Edit
                                        </Button>
                                        <Button variant="destructive" size="sm" onClick={() => handleDelete(category.id)}>
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            ))}
                            {categories.length === 0 && <p className="py-8 text-center text-muted-foreground">No categories yet</p>}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
