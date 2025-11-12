import { Category, Collection, ProductFull } from "./types";

export async function fetchAllProductsFullWithMeta() {
    // Fetch all products, collections, categories in parallel:
    const [productsRes, collectionsRes, categoriesRes] = await Promise.all([
        fetch("/api/admin/products"),
        fetch("/api/admin/collections"),
        fetch("/api/admin/categories"),
    ]);
    if (!productsRes.ok) throw new Error("Failed to fetch products");
    if (!collectionsRes.ok) throw new Error("Failed to fetch collections");
    if (!categoriesRes.ok) throw new Error("Failed to fetch categories");

    const { data: products } = await productsRes.json();
    const { data: collections } = await collectionsRes.json();
    const { data: categories } = await categoriesRes.json();
    console.log('collections', collections);
    console.log('categories', categories);
    console.log('products', products);

    // For each product, fetch variants and media, and add collection/category object:
    const detailPromises = products.map(async (product: ProductFull) => {
        const [variantsRes, mediaRes] = await Promise.all([
            fetch(`/api/admin/products/${product.id}/variants`),
            fetch(`/api/admin/products/${product.id}/media`),
        ]);
        const variants = variantsRes.ok ? await variantsRes.json() : [];
        const media = mediaRes.ok ? await mediaRes.json() : [];

        // Find matching collection & category objects:
        const collection = collections.find((c: Collection) => c.id === product.collection_id) || null;
        const category = categories.find((c: Category) => c.id === product.category_id) || null;
        console.log('collection', collection);
        console.log('category', category);

        return { ...product, variants, media, collection, category };
    });

    return await Promise.all(detailPromises);
}

export async function getProductFull(productId: number): Promise<ProductFull | null> {
    console.log('Fetching full details for product ID:', productId);
    // Fetch the product, its variants, and its media in parallel
    const [productRes, variantsRes, mediaRes, collectionsRes, categoriesRes] = await Promise.all([
        fetch(`/api/admin/products/${productId}`),
        fetch(`/api/admin/products/${productId}/variants`),
        fetch(`/api/admin/products/${productId}/media`),
        fetch("/api/admin/collections"),
        fetch("/api/admin/categories"),
    ]);

    console.log('productRes', productRes);
    console.log('variantsRes', variantsRes);
    console.log('mediaRes', mediaRes);
    console.log('collectionsRes', collectionsRes);
    console.log('categoriesRes', categoriesRes);
    // Check for base product existence
    if (!productRes.ok) {
        console.error(`Product ${productId} not found`);
        return null;
    }

    const { data: product } = await productRes.json();
    const variants = variantsRes.ok ? await variantsRes.json() : [];
    const media = mediaRes.ok ? await mediaRes.json() : [];

    const { data: collections } = collectionsRes.ok ? await collectionsRes.json() : { data: [] };
    const { data: categories } = categoriesRes.ok ? await categoriesRes.json() : { data: [] };

    const collection = collections.find((c: Collection) => c.id === product.collection_id) || null;
    const category = categories.find((c: Category) => c.id === product.category_id) || null;

    return { ...product, variants, media, collection, category };
}