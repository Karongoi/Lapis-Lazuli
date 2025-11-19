export interface ProductFormProps {
    productId?: number
    collections: any[]
    categories: any[]
}

export interface Variant {
    id?: number
    color: string
    size: string
    additional_price: number
    stock: number
    sku: string
}

export interface MediaItem {
    id?: number
    media_url: string
    media_type: "image" | "mockup" | "artwork"
    is_primary: boolean
}
export interface Collection {
    id: number;
    name: string;
    theme: string | null;
    description: string | null;
    launch_date: string | null;
    status: string;
    main_image_url: string | null;
    creative_notes: string | null;
    created_at: string;
    updated_at: string;
}

export interface Category {
    id: number;
    name: string;
    slug: string;
    gender: string;
    created_at: string;
}

export interface Product {
    id: number;
    name: string;
    design_name?: string;
    description?: string;
    material?: string;
    print_type?: string;
    price: string;
    stock: number;
    status: string;
    collection_id?: number | null;
    category_id?: number;
    created_at: string;
    updated_at: string;
}

export interface ProductVariant {
    id: number;
    product_id: number;
    color: string;
    size: string;
    additional_price: string;
    stock: number;
    sku: string;
}

export interface ProductMedia {
    id: number;
    product_id: number;
    media_url: string;
    media_type: "image" | "mockup" | "artwork";
    is_primary: boolean;
}

export interface ProductFull extends Product {
    variants: ProductVariant[];
    media: ProductMedia[];
    collection: Collection | null;
    category: Category | null;
}

// Cart Item
export interface CartItem {
    id: number
    quantity: number
    variant: {
        id: number
        color: string
        size: string
        sku: string
        price: string
        stock: number
        product: {
            id: number
            name: string
            image_url?: string
            media: ProductMedia[]
        }
    }
}

export interface Cart {
    id: number
    items: CartItem[]
    total: number
}

// Review
export interface Review {
    id: number
    rating: number
    comment: string
    author: {
        full_name: string
        email: string
    }
    created_at: string
}

export interface ReviewsData {
    reviews: Review[]
    averageRating: number
    count: number
}

export interface BillingDetails {
    fullName: string
    email: string
    phone: string
    address: string
}

// ORDERS
export interface OrderItem {
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

export interface Order {
    id: number
    order_number: string
    status: "pending" | "paid" | "payment_failed" | "cancelled" | "processing" | "shipped" | "delivered"
    tax: string
    discount: string
    receipt_url?: string
    subtotal: string
    total_price: string
    created_at: string
    items?: OrderItem[]
    itemCount?: number
}