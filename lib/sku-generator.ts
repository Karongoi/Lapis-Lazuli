/**
 * Generates a unique SKU from product name, color, and size abbreviations
 * Format: PRODUCT-COLOR-SIZE (e.g., CTX-RED-XL, TSHIRT-BLU-MD)
 */

const COLOR_ABBREVIATIONS: Record<string, string> = {
    red: "RED",
    blue: "BLU",
    green: "GRN",
    yellow: "YLW",
    orange: "ORN",
    purple: "PUR",
    pink: "PNK",
    black: "BLK",
    white: "WHT",
    gray: "GRY",
    grey: "GRY",
    brown: "BRN",
    navy: "NAV",
    teal: "TEA",
    cyan: "CYN",
    magenta: "MAG",
    gold: "GLD",
    silver: "SLV",
    beige: "BEI",
    cream: "CRM",
}

const SIZE_ABBREVIATIONS: Record<string, string> = {
    "extra small": "XS",
    xs: "XS",
    small: "SM",
    s: "SM",
    medium: "MD",
    m: "MD",
    large: "LG",
    l: "LG",
    "extra large": "XL",
    xl: "XL",
    "2xl": "2XL",
    "3xl": "3XL",
    "4xl": "4XL",
    "5xl": "5XL",
    // Numeric sizes
    "32": "32",
    "34": "34",
    "36": "36",
    "38": "38",
    "40": "40",
    "42": "42",
    "44": "44",
    "46": "46",
    "48": "48",
    "50": "50",
}

/**
 * Get abbreviation for a color, with fallback to first 3 uppercase letters
 */
export function getColorAbbr(color: string): string {
    const normalized = color.toLowerCase().trim()
    return COLOR_ABBREVIATIONS[normalized] || normalized.substring(0, 3).toUpperCase()
}

/**
 * Get abbreviation for a size, with fallback to first 3 uppercase letters
 */
export function getSizeAbbr(size: string): string {
    const normalized = size.toLowerCase().trim()
    return SIZE_ABBREVIATIONS[normalized] || normalized.substring(0, 3).toUpperCase()
}

/**
 * Generates a SKU from product name, color, and size
 * Ensures consistent, unique, and readable SKUs
 */
export function generateSKU(productName: string, color: string, size: string): string {
    if (!productName || !color || !size) {
        return ""
    }

    // Extract first meaningful part of product name (e.g., "Classic T-Shirt" -> "CTX" or "TSHIRT")
    const words = productName.trim().split(/\s+/)
    const nameAbbr = words
        .map((word) => word.charAt(0).toUpperCase())
        .join("")
        .substring(0, 3)
        .padEnd(3, "X") // Pad with X if less than 3 chars

    const colorAbbr = getColorAbbr(color)
    const sizeAbbr = getSizeAbbr(size)

    return `${nameAbbr}-${colorAbbr}-${sizeAbbr}`
}

/**
 * Generates a SKU with a timestamp suffix for uniqueness when needed
 */
export function generateUniqueSKU(productName: string, color: string, size: string, timestamp = true): string {
    const baseSku = generateSKU(productName, color, size)
    if (!timestamp) return baseSku

    const ts = Date.now().toString().slice(-4)
    return `${baseSku}-${ts}`
}
