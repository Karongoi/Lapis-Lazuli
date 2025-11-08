import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CategoryForm } from "@/components/admin/category-form"

export default function NewCategoryPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Create New Category</h1>
                <Link href="/admin/categories">
                    <Button variant="outline">Back to Categories</Button>
                </Link>
            </div>
            <CategoryForm />
        </div>
    )
}
