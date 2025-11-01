"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ProductForm } from "@/components/admin/product-form"

export default function EditProductPage() {
    const params = useParams()
    const productId = Number.parseInt(params.id as string)
    const [collections, setCollections] = useState([])
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        Promise.all([
            fetch("/api/admin/collections").then((r) => r.json()),
            fetch("/api/admin/categories").then((r) => r.json()),
        ])
            .then(([colRes, catRes]) => {
                setCollections(colRes.data || [])
                setCategories(catRes.data || [])
            })
            .finally(() => setLoading(false))
    }, [])

    if (loading) return <div className="py-8 text-center">Loading...</div>

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Edit Product</h1>
                <Link href="/admin/products">
                    <Button variant="outline">Back to Products</Button>
                </Link>
            </div>
            <ProductForm productId={productId} collections={collections} categories={categories} />
        </div>
    )
}
