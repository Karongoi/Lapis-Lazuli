export const SITE_TITLE = "Lapis Lazuli Threads"
export const SITE_DESCRIPTION = "Discover the elegance of Lapis Lazuli Threads - where timeless beauty meets exquisite craftsmanship in every stitch."
export const SITE_URL = "https://lapislazuli.com"
export const SITE_NAME = "Lapis Lazuli Threads"

export const META_IMAGE = "https://res.cloudinary.com/dadkir6u2/image/upload/v1749398041/Payd_Meta_Images_evgffn.webp"
export const FAVICON = "https://res.cloudinary.com/dadkir6u2/image/upload/v1738661548/favicon_kngoce.svg"
export const LOGO = "https://res.cloudinary.com/dadkir6u2/image/upload/v1738661862/logo_vyhw3u.svg"
export const PRELOADER = "https://res.cloudinary.com/dadkir6u2/video/upload/v1738668407/Animation_-_1738667843996_mjnfws.webm"

// Common clothing sizes used across product variants
export const CLOTHING_SIZES = [
    { value: "XS", label: "Extra Small" },
    { value: "S", label: "Small" },
    { value: "M", label: "Medium" },
    { value: "L", label: "Large" },
    { value: "XL", label: "Extra Large" },
    { value: "2XL", label: "2X Large" },
    { value: "3XL", label: "3X Large" },
    { value: "4XL", label: "4X Large" },
    { value: "ONE", label: "One Size" },
]

// Common colors for variants
export const COMMON_COLORS = [
    "Black",
    "White",
    "Red",
    "Navy",
    "Gray",
    "Charcoal",
    "Forest Green",
    "Royal Blue",
    "Burgundy",
    "Olive",
]

export const CATEGORIES = [
    "T-Shirts",
    "Hoodies",
    "Cropped Hoodies",
    "Tank Tops",
    "Cropped Tank Tops",
    "Tote Bags",
];

export const GENDERS = ["Men", "Women", "Kids"];

export const COLLECTIONS = [
    { label: "Imani Collection", slug: "imani" },
    { label: "Heritage Collection", slug: "heritage" },
];

// build a nested menu structure for collections
export function buildCollectionsMenu() {
    return COLLECTIONS.map((collection) => ({
        label: collection.label,
        href: `/collections/${collection.slug}`,
        items: CATEGORIES.map((category) => ({
            label: category,
            href: `/collections/${collection.slug}/${category.toLowerCase().replace(/\s+/g, "-")}`,
            items: GENDERS.map((gender) => ({
                label: gender,
                href: `/collections/${collection.slug}/${category.toLowerCase().replace(/\s+/g, "-")}/${gender.toLowerCase()}`,
            })),
        })),
    }));
}

// build a nested menu structure for categories with extra Tote bags item that has no gender
export function buildCategoriesMenu() {
    return CATEGORIES.map((category) => ({
        label: category,
        href: `/shop/${category.toLowerCase().replace(/\s+/g, "-")}`,
        items: category === "Tote Bags"
            ? []
            : GENDERS.map((gender) => ({
                label: gender,
                href: `/shop/${category.toLowerCase().replace(/\s+/g, "-")}/${gender.toLowerCase()}`,
            })),
    }));
}

export function formatCollectionSlug(name: string) {
    return name
        .toLowerCase()
        .replace(/\s*collection\s*$/, "") // remove trailing "collection"
        .trim()
        .replace(/\s+/g, "-"); // replace spaces with hyphens
}

export function toInputDate(value: string | null) {
    if (!value) return ""
    const d = new Date(value)
    const offset = d.getTimezoneOffset()
    // Adjust for timezone to get local time
    const local = new Date(d.getTime() - offset * 60 * 1000)
    return local.toISOString().slice(0, 16) // "YYYY-MM-DDTHH:mm"
}


export const statusConfig = {
    pending: {
        title: "Payment Pending",
        message: "Your payment is being processed. Please check your phone for the M-Pesa prompt.",
        color: "bg-yellow-50",
        textColor: "text-yellow-900",
    },
    paid: {
        title: "Order Confirmed!",
        message: "Your payment has been received. We're preparing your order.",
        color: "bg-green-50",
        textColor: "text-green-900",
    },
    payment_failed: {
        title: "Payment Failed",
        message: "Your payment could not be processed. Your cart items are saved. Please try again.",
        color: "bg-red-50",
        textColor: "text-red-900",
        showRetry: true,
    },
    cancelled: {
        title: "Order Cancelled",
        message: "This order has been cancelled.",
        color: "bg-gray-50",
        textColor: "text-gray-900",
    },
    processing: {
        title: "Processing",
        message: "Your order is being prepared for shipment.",
        color: "bg-blue-50",
        textColor: "text-blue-900",
    },
    shipped: {
        title: "Shipped!",
        message: "Your order has been shipped. Track your package.",
        color: "bg-blue-50",
        textColor: "text-blue-900",
    },
    delivered: {
        title: "Delivered",
        message: "Your order has been delivered. Thank you for your purchase!",
        color: "bg-green-50",
        textColor: "text-green-900",
    },
}