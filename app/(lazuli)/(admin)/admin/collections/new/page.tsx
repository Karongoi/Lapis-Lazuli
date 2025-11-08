import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CollectionForm } from "@/components/admin/collection-form"

export default function NewCollectionPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Create New Collection</h1>
        <Link href="/admin/collections">
          <Button variant="outline">Back to Collections</Button>
        </Link>
      </div>
      <CollectionForm />
    </div>
  )
}
