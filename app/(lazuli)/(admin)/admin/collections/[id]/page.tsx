"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CollectionForm } from "@/components/admin/collection-form"

export default function EditCollectionPage() {
    const params = useParams()
    const collectionId = Number.parseInt(params.id as string)

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Edit Collection</h1>
                <Link href="/admin/collections">
                    <Button variant="outline">Back to Collections</Button>
                </Link>
            </div>
            <CollectionForm collectionId={collectionId} />
        </div>
    )
}
