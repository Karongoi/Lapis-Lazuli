import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PromotionForm } from "@/components/admin/promotion-form"

export default function NewPromotionPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Create New Promotion</h1>
                <Link href="/admin/promotions">
                    <Button variant="outline">Back to Promotions</Button>
                </Link>
            </div>
            <PromotionForm />
        </div>
    )
}
