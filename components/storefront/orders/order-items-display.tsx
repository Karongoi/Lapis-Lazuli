import Image from "next/image"

interface OrderItem {
    id: number
    quantity: number
    unit_price: string
    color?: string
    size?: string
    sku?: string
    product_name?: string
    product_id?: number
    media_url?: string
}

interface OrderItemsDisplayProps {
    items: OrderItem[]
}

export function OrderItemsDisplay({ items }: OrderItemsDisplayProps) {
    return (
        <div className="w-full flex flex-col gap-4">
            <h3 className="font-semibold">Order Items</h3>
            <div className="divide-y border-t">
                {items.map((item) => (
                    <div key={item.id} className="py-4 flex items-center gap-4">
                        {item.media_url && (
                            <div className="relative w-16 h-16 flex-shrink-0 overflow-hidden bg-gray-100">
                                <Image
                                    src={item.media_url || "/placeholder.svg"}
                                    alt={item.product_name || "Product"}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm">{item.product_name || "Product"}</p>
                            <div className="text-xs text-foreground/60 flex flex-col sm:flex-row gap-2 mt-1">
                                {item.color && <p className="sm:border-r pr-2">Color: {item.color}</p>}
                                {item.size && <p className="sm:border-r pr-2">Size: {item.size}</p>}
                                {item.sku && <p>SKU: {item.sku}</p>}
                            </div>
                        </div>
                        <div className="flex-shrink-0 text-right space-y-1">
                            <p className="text-xs text-foreground/60">
                                {item.quantity} x KES {parseFloat(item.unit_price).toFixed(2)}
                            </p>
                            <p className="font-semibold text-sm">KES {(parseFloat(item.unit_price) * item.quantity).toFixed(2)}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
