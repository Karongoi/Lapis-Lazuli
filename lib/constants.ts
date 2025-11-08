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
