import { mockProducts } from "@/lib/mockData"


export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")?.toLowerCase() || ""

    if (!query) {
        return Response.json({ results: [] })
    }

    const results = mockProducts.filter((product) => {
        const searchableText = `
      ${product.name}
      ${product.color}
      ${product.collectionId}
      ${product.categoryId}
      ${product.availableSizes.join(" ")}
    `.toLowerCase()

        return searchableText.includes(query)
    })

    return Response.json({ results })
}
