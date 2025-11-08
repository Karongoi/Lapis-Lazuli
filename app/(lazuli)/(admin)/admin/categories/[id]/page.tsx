"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CategoryForm } from "@/components/admin/category-form"

export default function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
    const resolveParams = async () => {
        const { id } = await params
        return Number.parseInt(id)
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Edit Category</h1>
                <Link href="/admin/categories">
                    <Button variant="outline">Back to Categories</Button>
                </Link>
            </div>
            <CategoryFormWrapper />
        </div>
    )
}

function CategoryFormWrapper() {
    const params = useParams()
    const categoryId = Number.parseInt(params.id as string)
    return <CategoryForm categoryId={categoryId} />
}
