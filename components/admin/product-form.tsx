"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { FormField } from "@/components/admin/form-field"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { generateSKU } from "@/lib/sku-generator"
import { CLOTHING_SIZES } from "@/lib/constants"
import { MediaItem, ProductFormProps, Variant } from "@/lib/types"
import { CloudinaryUpload } from "./upload-form"
import toast from "react-hot-toast"
import LoadingSkeleton from "@/common/shared/loadingSkeleton"

export function ProductForm({ productId, collections, categories }: ProductFormProps) {
    const router = useRouter()
    const isEditing = !!productId
    const [loading, setLoading] = useState(isEditing)
    const [submitting, setSubmitting] = useState(false)
    const [variants, setVariants] = useState<Variant[]>([])
    const [media, setMedia] = useState<MediaItem[]>([])
    const [newVariant, setNewVariant] = useState<Variant>({
        color: "",
        size: "",
        additional_price: 0,
        stock: 0,
        sku: "",
    })
    const [newMedia, setNewMedia] = useState<MediaItem>({
        media_url: "",
        media_type: "image",
        is_primary: false,
    })

    const [formData, setFormData] = useState({
        name: "",
        design_name: "",
        description: "",
        material: "",
        print_type: "",
        price: "",
        stock: "",
        status: "available",
        collection_id: "",
        category_id: "",
    })

    const [errors, setErrors] = useState<Record<string, string>>({})

    // Load existing product data if editing
    useEffect(() => {
        if (isEditing && productId) {
            fetchProduct(productId)
        }
    }, [isEditing, productId])

    async function fetchProduct(id: number) {
        try {
            const res = await fetch(`/api/admin/products/${id}`)
            if (!res.ok) throw new Error("Failed to fetch product")
            const { data } = await res.json()
            setFormData({
                name: data.name,
                design_name: data.design_name,
                description: data.description,
                material: data.material,
                print_type: data.print_type,
                price: data.price,
                stock: data.stock,
                status: data.status,
                collection_id: data.collection_id?.toString() || "",
                category_id: data.category_id?.toString() || "",
            })
            // Fetch variants and media
            const [varRes, mediaRes] = await Promise.all([
                fetch(`/api/admin/products/${id}/variants`),
                fetch(`/api/admin/products/${id}/media`),
            ])
            if (varRes.ok) setVariants(await varRes.json())
            if (mediaRes.ok) setMedia(await mediaRes.json())
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    function validateForm() {
        const newErrors: Record<string, string> = {}
        if (!formData.name) newErrors.name = "Product name is required"
        if (!formData.price) newErrors.price = "Price is required"
        if (!formData.stock) newErrors.stock = "Stock is required"
        if (!formData.category_id) newErrors.category_id = "Category is required"
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
                price: Number.parseFloat(formData.price),
                stock: Number.parseInt(formData.stock),
                collection_id: formData.collection_id ? Number.parseInt(formData.collection_id) : null,
                category_id: Number.parseInt(formData.category_id),
                variants,
                media,
            }

            const url = isEditing ? `/api/admin/products/${productId}` : "/api/admin/products"
            const method = isEditing ? "PATCH" : "POST"
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            })

            if (!res.ok) throw new Error("Failed to save product")
            router.push("/admin/products")
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "An error occurred")
        } finally {
            setSubmitting(false)
        }
    }

    function addVariant() {
        if (!newVariant.color || !newVariant.size || !newVariant.sku) {
            toast.error("Please fill all variant fields")
            return
        }
        setVariants([
            ...variants,
            { ...newVariant, additional_price: Number.parseFloat(newVariant.additional_price.toString()) },
        ])
        setNewVariant({ color: "", size: "", additional_price: 0, stock: 0, sku: "" })
    }

    function removeVariant(idx: number) {
        setVariants(variants.filter((_, i) => i !== idx))
    }

    function addMedia() {
        if (!newMedia.media_url) {
            toast.error("Please enter a media URL")
            return
        }
        setMedia([...media, newMedia])
        setNewMedia({ media_url: "", media_type: "image", is_primary: false })
    }

    function removeMedia(idx: number) {
        setMedia(media.filter((_, i) => i !== idx))
    }

    function handleGenerateSKU() {
        const generatedSku = generateSKU(formData.name, newVariant.color, newVariant.size)
        if (generatedSku) {
            setNewVariant({ ...newVariant, sku: generatedSku })
        }
    }

    useEffect(() => {
        if (formData.name && newVariant.color && newVariant.size) {
            const autoSku = generateSKU(formData.name, newVariant.color, newVariant.size)
            setNewVariant((prev) => ({ ...prev, sku: autoSku }))
        }
    }, [formData.name, newVariant.color, newVariant.size])

    if (loading) return <div className="py-8 text-center"><LoadingSkeleton /></div>

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>{isEditing ? "Edit Product" : "Create New Product"}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <FormField label="Product Name" required error={errors.name}>
                            <Input
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="e.g., Classic T-Shirt"
                            />
                        </FormField>

                        <FormField label="Design Name" error={errors.design_name}>
                            <Input
                                value={formData.design_name}
                                onChange={(e) => setFormData({ ...formData, design_name: e.target.value })}
                                placeholder="e.g., Summer Vibes"
                            />
                        </FormField>
                    </div>

                    <FormField label="Description" error={errors.description}>
                        <Textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Product description..."
                            rows={3}
                        />
                    </FormField>

                    <div className="grid grid-cols-3 gap-4">
                        <FormField label="Material" error={errors.material}>
                            <Input
                                value={formData.material}
                                onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                                placeholder="e.g., Cotton 100%"
                            />
                        </FormField>

                        <FormField label="Print Type" error={errors.print_type}>
                            <Input
                                value={formData.print_type}
                                onChange={(e) => setFormData({ ...formData, print_type: e.target.value })}
                                placeholder="e.g., Direct-to-Garment"
                            />
                        </FormField>

                        <FormField label="Status" error={errors.status}>
                            <Select value={formData.status} onValueChange={(val) => setFormData({ ...formData, status: val })}>
                                <SelectTrigger className="w-full">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="available">Available</SelectItem>
                                    <SelectItem value="sold_out">Sold Out</SelectItem>
                                    <SelectItem value="coming_soon">Coming Soon</SelectItem>
                                </SelectContent>
                            </Select>
                        </FormField>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField label="Price" required error={errors.price}>
                            <Input
                                type="number"
                                step="0.01"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                placeholder="0.00"
                            />
                        </FormField>

                        <FormField label="Stock" required error={errors.stock}>
                            <Input
                                type="number"
                                value={formData.stock}
                                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                placeholder="0"
                            />
                        </FormField>

                        <FormField label="Category" required error={errors.category_id}>
                            <Select
                                value={formData.category_id}
                                onValueChange={(val) => setFormData({ ...formData, category_id: val })}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((cat) => (
                                        <SelectItem key={cat.id} value={cat.id.toString()}>
                                            {cat.name} - {cat.gender}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </FormField>
                    </div>

                    <FormField label="Collection (Optional)">
                        <Select
                            value={formData.collection_id}
                            onValueChange={(val) => setFormData({ ...formData, collection_id: val })}
                        >
                            <SelectTrigger className="w-full lg:w-[32%]">
                                <SelectValue placeholder="Select collection" />
                            </SelectTrigger>
                            <SelectContent>
                                {collections.map((col) => (
                                    <SelectItem key={col.id} value={col.id.toString()}>
                                        {col.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </FormField>
                </CardContent>
            </Card>

            {/* VARIANTS SECTION */}
            <Card>
                <CardHeader>
                    <CardTitle>Product Variants</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-b-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                            <div className="flex flex-col gap-1">
                                <p className="text-foreground/50 text-xs">color ie. White, Black</p>
                                <Input
                                    placeholder="Color"
                                    value={newVariant.color}
                                    onChange={(e) => setNewVariant({ ...newVariant, color: e.target.value })}
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <p className="text-foreground/50 text-xs">size ie. S, M</p>
                                <Select value={newVariant.size} onValueChange={(val) => setNewVariant({ ...newVariant, size: val })}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select size" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {CLOTHING_SIZES.map((size) => (
                                            <SelectItem key={size.value} value={size.value}>
                                                {size.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex flex-col gap-1">
                                <p className="text-foreground/50 text-xs">Extra Price</p>
                                <Input
                                    type="number"
                                    step="0.01"
                                    placeholder="Extra Price"
                                    value={newVariant.additional_price}
                                    onChange={(e) =>
                                        setNewVariant({ ...newVariant, additional_price: Number.parseFloat(e.target.value) || 0 })
                                    }
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <p className="text-foreground/50 text-xs">Stock Qty</p>
                                <Input
                                    type="number"
                                    placeholder="Stock"
                                    value={newVariant.stock}
                                    onChange={(e) => setNewVariant({ ...newVariant, stock: Number.parseInt(e.target.value) || 0 })}
                                />
                            </div>
                            <div className="flex gap-1">
                                <div className="flex flex-col gap-1">
                                    <p className="text-foreground/50 text-xs">SKU</p>
                                    <Input
                                        placeholder="SKU"
                                        value={newVariant.sku}
                                        onChange={(e) => setNewVariant({ ...newVariant, sku: e.target.value })}
                                        readOnly
                                        className="text-xs"
                                        title="Auto-generated from product name, color, and size. Click 'Regenerate' to change."
                                    />
                                </div>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleGenerateSKU}
                                    title="Regenerate SKU"
                                    className="whitespace-nowrap bg-transparent"
                                >
                                    ↻
                                </Button>
                            </div>
                        </div>
                    </div>
                    <Button type="button" variant="outline" onClick={addVariant} className="w-fit px-8">
                        Add Variant
                    </Button>

                    {variants.length > 0 && (
                        <div className="space-y-2 flex flex-wrap gap-y-2 gap-x-8">
                            {variants.map((variant, idx) => (
                                <div key={idx} className="flex flex-col sm:flex-row items-center justify-between rounded-sm border p-3">
                                    <div className="text-sm">
                                        <p className="font-medium">
                                            {variant.color} - {variant.size}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            SKU: {variant.sku} | Stock: {variant.stock} | +KES {Number(variant.additional_price).toFixed(2)}
                                        </p>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeVariant(idx)}
                                        className="text-destructive"
                                    >
                                        Remove
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* MEDIA SECTION */}
            <Card>
                <CardHeader>
                    <CardTitle>Product Media</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <CloudinaryUpload
                            folder="products"
                            onUploadComplete={(url) =>
                                setNewMedia((prev) => ({ ...prev, media_url: url }))
                            }
                        />
                        <Input
                            placeholder="Media URL"
                            value={newMedia.media_url}
                            onChange={(e) => setNewMedia({ ...newMedia, media_url: e.target.value })}
                        />
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            <Select
                                value={newMedia.media_type}
                                onValueChange={(val) => setNewMedia({ ...newMedia, media_type: val as any })}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="image">Image</SelectItem>
                                    <SelectItem value="mockup">Mockup</SelectItem>
                                    <SelectItem value="artwork">Artwork</SelectItem>
                                </SelectContent>
                            </Select>
                            <label className="flex items-center gap-2 text-sm">
                                <input
                                    type="checkbox"
                                    checked={newMedia.is_primary}
                                    onChange={(e) => setNewMedia({ ...newMedia, is_primary: e.target.checked })}
                                    className="rounded"
                                />
                                Set as Primary
                            </label>
                            <Button type="button" variant="outline" onClick={addMedia}>
                                Add Media
                            </Button>
                        </div>
                    </div>

                    {media.length > 0 && (
                        <div className="grid grid-cols-3 gap-3">
                            {media.map((item, idx) => (
                                <div key={idx} className="relative rounded-lg border">
                                    <img
                                        src={item.media_url || "/placeholder.svg"}
                                        alt="preview"
                                        className="h-48 w-full object-contain rounded-lg"
                                    />
                                    <div className="absolute inset-0 flex flex-col justify-between rounded-lg bg-black/30 p-2 opacity-0 hover:opacity-100 transition-opacity">
                                        <div className="text-xs text-white">
                                            <p>{item.media_type}</p>
                                            {item.is_primary && <p className="font-semibold">Primary</p>}
                                        </div>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeMedia(idx)}
                                            className="h-6 self-end text-white hover:bg-red-500"
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* SUBMIT BUTTONS */}
            <div className="flex gap-2">
                <Button type="submit" disabled={submitting} className="flex-1">
                    {submitting ? "Saving..." : isEditing ? "Update Product" : "Create Product"}
                </Button>
                <Button type="button" variant="outline" onClick={() => router.back()} className="flex-1">
                    Cancel
                </Button>
            </div>
        </form>
    )
}
