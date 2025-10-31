import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const stats = [
    { label: "Total Products", value: "0", href: "/admin/products" },
    { label: "Active Collections", value: "0", href: "/admin/collections" },
    { label: "Categories", value: "0", href: "/admin/categories" },
    { label: "Recent Orders", value: "0", href: "/admin/orders" },
]

export default function AdminDashboard() {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <Card key={stat.label}>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{stat.value}</div>
                            <Link href={stat.href}>
                                <Button variant="outline" size="sm" className="mt-4 w-full bg-transparent">
                                    Manage
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Quick Start</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                        Get started by managing your storefront resources. Use the navigation menu on the left to access different
                        sections.
                    </p>
                    <div className="flex flex-wrap gap-2">
                        <Link href="/admin/collections">
                            <Button variant="default" size="sm">
                                Create Collection
                            </Button>
                        </Link>
                        <Link href="/admin/products">
                            <Button variant="outline" size="sm">
                                Add Product
                            </Button>
                        </Link>
                        <Link href="/admin/categories">
                            <Button variant="outline" size="sm">
                                Add Category
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
