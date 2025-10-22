export interface Category {
    id: string
    name: string
}

export interface Collection {
    id: string
    name: string
    description: string
    created_at: string
}

export const mockCategories: Category[] = [
    {
        id: "men",
        name: "Men",
    },
    {
        id: "women",
        name: "Women",
    },
    {
        id: "unisex",
        name: "Unisex",
    },
]

export const mockCollections: Collection[] = [
    {
        id: "imani",
        name: "Imani Collection",
        description: "Faith-inspired apparel celebrating Christian values and beliefs",
        created_at: "2025-07-01T00:00:00Z",
    },
    {
        id: "heritage",
        name: "Heritage Collection",
        description: "Timeless pieces honoring tradition and cultural significance",
        created_at: "2025-06-01T00:00:00Z",
    },
    {
        id: "modern",
        name: "Modern Collection",
        description: "Contemporary designs for the modern Christian lifestyle",
        created_at: "2025-05-15T00:00:00Z",
    },
    {
        id: "limited",
        name: "Limited Edition",
        description: "Exclusive pieces available in limited quantities",
        created_at: "2025-04-15T00:00:00Z",
    },
]

export interface Product {
    id: string
    name: string
    price: number
    description: string
    stock: number
    collectionId: string
    categoryId: string
    color: string
    availableSizes: string[]
    image?: string
}

export const mockProducts: Product[] = [
    {
        id: "1",
        name: "Jesus is the Way T-Shirt",
        price: 34.99,
        description: "Premium cotton t-shirt with inspiring Christian message",
        stock: 22,
        collectionId: "imani",
        categoryId: "unisex",
        color: "White",
        availableSizes: ["XS", "S", "M", "L", "XL", "XXL"],
        image: "/images/jesus-way-tshirt.png",
    },
    {
        id: "2",
        name: "Through the Mountains T-Shirt",
        price: 34.99,
        description: "Comfortable tee celebrating faith through life's challenges",
        stock: 18,
        collectionId: "imani",
        categoryId: "unisex",
        color: "Sage Green",
        availableSizes: ["XS", "S", "M", "L", "XL", "XXL"],
        image: "/images/mountains-tshirt.png",
    },
    {
        id: "3",
        name: "Jesus Loves You Hoodie",
        price: 64.99,
        description: "Cozy hoodie with powerful message of divine love",
        stock: 16,
        collectionId: "imani",
        categoryId: "unisex",
        color: "Charcoal Gray",
        availableSizes: ["XS", "S", "M", "L", "XL", "XXL"],
        image: "/images/jesus-loves-hoodie.png",
    },
    {
        id: "4",
        name: "Burning Passion Hoodie",
        price: 64.99,
        description: "Premium hoodie representing spiritual fervor and dedication",
        stock: 14,
        collectionId: "imani",
        categoryId: "men",
        color: "Deep Burgundy",
        availableSizes: ["S", "M", "L", "XL", "XXL"],
        image: "/images/burning-passion-hoodie.png",
    },
    {
        id: "5",
        name: "Classic Heritage Shirt",
        price: 45.99,
        description: "Timeless cotton shirt honoring tradition",
        stock: 15,
        collectionId: "heritage",
        categoryId: "men",
        color: "Navy Blue",
        availableSizes: ["XS", "S", "M", "L", "XL", "XXL"],
        image: "/images/burning-passion-hoodie.png",
    },
    {
        id: "6",
        name: "Elegant Heritage Dress",
        price: 89.99,
        description: "Breathable linen dress with timeless elegance",
        stock: 8,
        collectionId: "heritage",
        categoryId: "women",
        color: "Cream",
        availableSizes: ["XS", "S", "M", "L", "XL"],
        image: "/images/burning-passion-hoodie.png",
    },
    {
        id: "7",
        name: "Leather Accessories Set",
        price: 55.99,
        description: "Premium leather accessories including belt and wallet",
        stock: 10,
        collectionId: "heritage",
        categoryId: "men",
        color: "Brown",
        availableSizes: ["One Size"],
        image: "/images/burning-passion-hoodie.png",
    },
    {
        id: "8",
        name: "Modern Essentials Hoodie",
        price: 65.99,
        description: "Contemporary hoodie for everyday comfort",
        stock: 20,
        collectionId: "modern",
        categoryId: "unisex",
        color: "Charcoal",
        availableSizes: ["XS", "S", "M", "L", "XL", "XXL"],
        image: "/images/burning-passion-hoodie.png",
    },
    {
        id: "9",
        name: "Premium Modern T-Shirt",
        price: 29.99,
        description: "High-quality cotton t-shirt with perfect fit",
        stock: 25,
        collectionId: "modern",
        categoryId: "unisex",
        color: "White",
        availableSizes: ["XS", "S", "M", "L", "XL", "XXL"],
        image: "/images/burning-passion-hoodie.png",
    },
    {
        id: "10",
        name: "Modern Wool Sweater",
        price: 78.99,
        description: "Warm and comfortable wool sweater for winter",
        stock: 11,
        collectionId: "modern",
        categoryId: "women",
        color: "Gray",
        availableSizes: ["XS", "S", "M", "L", "XL"],
        image: "/images/burning-passion-hoodie.png",
    },
    {
        id: "11",
        name: "Floral Summer Top",
        price: 38.99,
        description: "Lightweight floral top perfect for warm weather",
        stock: 18,
        collectionId: "limited",
        categoryId: "women",
        color: "Multicolor",
        availableSizes: ["XS", "S", "M", "L", "XL"],
        image: "/images/burning-passion-hoodie.png",
    },
    {
        id: "12",
        name: "Limited Edition Denim Jacket",
        price: 95.99,
        description: "Classic denim jacket with timeless style",
        stock: 7,
        collectionId: "limited",
        categoryId: "unisex",
        color: "Light Blue",
        availableSizes: ["XS", "S", "M", "L", "XL", "XXL"],
        image: "/images/burning-passion-hoodie.png",
    },
    {
        id: "13",
        name: "Slim Fit Premium Pants",
        price: 72.99,
        description: "Modern slim fit pants with premium fabric",
        stock: 12,
        collectionId: "limited",
        categoryId: "men",
        color: "Black",
        availableSizes: ["28", "30", "32", "34", "36", "38"],
        image: "/images/burning-passion-hoodie.png",
    },
    {
        id: "14",
        name: "Silk Scarf",
        price: 42.99,
        description: "Luxurious silk scarf with elegant patterns",
        stock: 14,
        collectionId: "limited",
        categoryId: "women",
        color: "Burgundy",
        availableSizes: ["One Size"],
        image: "/images/burning-passion-hoodie.png",
    },
]
