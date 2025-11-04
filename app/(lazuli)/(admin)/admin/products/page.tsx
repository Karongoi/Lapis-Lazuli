"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/admin/data-table"
import { useFetchProducts } from "@/hooks/useStore"

export default function ProductsPage() {
    const router = useRouter()
    const { products, isProductsLoading, error } = useFetchProducts()

    // useEffect(() => {
    //     fetchProducts()
    // }, [])

    // async function fetchProducts() {
    //     try {
    //         setLoading(true)
    //         const res = await fetch("/api/admin/products")
    //         if (!res.ok) throw new Error("Failed to fetch products")
    //         const result = await res.json()
    //         setProducts(result.data || [])
    //     } catch (err) {
    //         setError(err instanceof Error ? err.message : "An error occurred")
    //     } finally {
    //         setLoading(false)
    //     }
    // }

    async function handleDelete(id: number) {
        if (!confirm("Are you sure you want to delete this product?")) return
        try {
            const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" })
            if (!res.ok) throw new Error("Failed to delete product")
            products.filter((p: any) => p.id !== id)
        } catch (err) {
            alert(err instanceof Error ? err.message : "An error occurred")
        }
    }

    const columns = [
        { key: "id", label: "ID", width: 60 },
        { key: "name", label: "Name", width: 200 },
        { key: "design_name", label: "Design", width: 150 },
        { key: "price", label: "Price", width: 100 },
        { key: "stock", label: "Stock", width: 80 },
        { key: "status", label: "Status", width: 120 },
    ]

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Products</h1>
                <Link href="/admin/products/new">
                    <Button>Add Product</Button>
                </Link>
            </div>

            {error && (
                <div className="rounded-md bg-destructive/10 p-4 text-destructive">
                    {error instanceof Error ? error.message : String(error)}
                </div>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>All Products</CardTitle>
                </CardHeader>
                <CardContent>
                    {isProductsLoading ? (
                        <div className="py-8 text-center text-muted-foreground">Loading...</div>
                    ) : (
                        <DataTable
                            data={products}
                            columns={columns}
                            onEdit={(row) => router.push(`/admin/products/${row.id}`)}
                            onDelete={(row) => handleDelete(row.id)}
                        />
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
