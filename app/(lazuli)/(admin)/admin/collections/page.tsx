"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function CollectionsPage() {
    const [collections, setCollections] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchCollections()
    }, [])

    async function fetchCollections() {
        try {
            const res = await fetch("/api/admin/collections")
            if (!res.ok) throw new Error("Failed to fetch")
            const result = await res.json()
            setCollections(result.data || [])
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    async function handleDelete(id: number) {
        if (!confirm("Delete this collection?")) return
        try {
            await fetch(`/api/admin/collections/${id}`, { method: "DELETE" })
            setCollections(collections.filter((c: any) => c.id !== id))
        } catch (err) {
            alert("Failed to delete")
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Collections</h1>
                <Link href="/admin/collections/new">
                    <Button>New Collection</Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Collections</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="py-8 text-center text-muted-foreground">Loading...</div>
                    ) : (
                        <div className="space-y-4">
                            {collections.map((collection: any) => (
                                <div key={collection.id} className="flex items-center justify-between rounded-lg border p-4">
                                    <div>
                                        <h3 className="font-semibold">{collection.name}</h3>
                                        <p className="text-sm text-muted-foreground">{collection.description}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm">
                                            Edit
                                        </Button>
                                        <Button variant="destructive" size="sm" onClick={() => handleDelete(collection.id)}>
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            ))}
                            {collections.length === 0 && <p className="py-8 text-center text-muted-foreground">No collections yet</p>}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
