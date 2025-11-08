"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function PromotionsPage() {
    const [promotions, setPromotions] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchPromotions()
    }, [])

    async function fetchPromotions() {
        try {
            const res = await fetch("/api/admin/promotions")
            if (!res.ok) throw new Error("Failed to fetch")
            const result = await res.json()
            setPromotions(result.data || [])
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    async function handleDelete(id: number) {
        if (!confirm("Delete this promotion?")) return
        try {
            await fetch(`/api/admin/promotions/${id}`, { method: "DELETE" })
            setPromotions(promotions.filter((p: any) => p.id !== id))
        } catch (err) {
            alert("Failed to delete")
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Promotions</h1>
                <Link href="/admin/promotions/new">
                    <Button>New Promotion</Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Promotions</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="py-8 text-center text-muted-foreground">Loading...</div>
                    ) : (
                        <div className="space-y-4">
                            {promotions.map((promotion: any) => (
                                <div key={promotion.id} className="flex items-center justify-between rounded-lg border p-4">
                                    <div>
                                        <h3 className="font-semibold">Code: {promotion.code}</h3>
                                        <p className="text-sm text-muted-foreground">{promotion.discount_percentage}% off</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Link href={`/admin/promotions/${promotion.id}`}>
                                            <Button variant="outline" size="sm">
                                                Edit
                                            </Button>
                                        </Link>
                                        <Button variant="destructive" size="sm" onClick={() => handleDelete(promotion.id)}>
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            ))}
                            {promotions.length === 0 && <p className="py-8 text-center text-muted-foreground">No promotions yet</p>}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
