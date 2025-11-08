"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useFetchCategories } from "@/hooks/useStore"

export default function CategoriesPage() {
    const { categories, isCategoriesLoading } = useFetchCategories()

    async function handleDelete(id: number) {
        if (!confirm("Delete this category?")) return
        try {
            await fetch(`/api/admin/categories/${id}`, { method: "DELETE" })
            categories.filter((c: any) => c.id !== id)
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
                    {isCategoriesLoading ? (
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
                                        <Link href={`/admin/categories/${category.id}`}>
                                            <Button variant="outline" size="sm">
                                                Edit
                                            </Button>
                                        </Link>
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
