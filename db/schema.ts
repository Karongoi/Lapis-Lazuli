import {
    pgTable,
    uuid,
    serial,
    text,
    varchar,
    timestamp,
    integer,
    boolean,
    numeric,
} from "drizzle-orm/pg-core";

// USERS - extended profile info
export const profiles = pgTable('profiles', {
    id: uuid('id').primaryKey(), // matches auth.profiles.id
    email: text('email').notNull().unique(),
    role: text('role').default('user'), // 'user' | 'admin'
    full_name: text('full_name'),
    created_at: timestamp('created_at').defaultNow(),
});

// COLLECTIONS
export const collections = pgTable("collections", {
    id: serial("id").primaryKey(),
    name: varchar("name").unique(),
    theme: text("theme"),
    description: text("description"),
    launch_date: timestamp("launch_date"),
    status: varchar("status"), // active, upcoming, archived
    main_image_url: varchar("main_image_url"),
    creative_notes: text("creative_notes"),
    created_at: timestamp("created_at").defaultNow(),
    updated_at: timestamp("updated_at").defaultNow(),
});

// CATEGORIES
export const categories = pgTable("categories", {
    id: serial("id").primaryKey(),
    name: varchar("name"), // e.g. T-Shirts, Hoodies
    slug: varchar("slug").unique(),
    gender: varchar("gender"), // men, women, kids
    created_at: timestamp("created_at").defaultNow(),
});

// PRODUCTS
export const products = pgTable("products", {
    id: serial("id").primaryKey(),
    name: varchar("name"),
    design_name: varchar("design_name"),
    description: text("description"),
    material: varchar("material"),
    print_type: varchar("print_type"),
    price: numeric("price", { precision: 10, scale: 2 }),
    stock: integer("stock"),
    status: varchar("status"), // available, sold_out, coming_soon
    collection_id: integer("collection_id").references(() => collections.id),
    category_id: integer("category_id").references(() => categories.id),
    created_at: timestamp("created_at").defaultNow(),
    updated_at: timestamp("updated_at").defaultNow(),
});

// PRODUCT VARIANTS
export const product_variants = pgTable("product_variants", {
    id: serial("id").primaryKey(),
    product_id: integer("product_id").references(() => products.id),
    color: varchar("color"),
    size: varchar("size"),
    additional_price: numeric("additional_price", { precision: 10, scale: 2 }),
    stock: integer("stock"),
    sku: varchar("sku").unique(),
});

// PRODUCT MEDIA
export const product_media = pgTable("product_media", {
    id: serial("id").primaryKey(),
    product_id: integer("product_id").references(() => products.id),
    media_url: varchar("media_url"),
    media_type: varchar("media_type"), // image, mockup, artwork
    is_primary: boolean("is_primary"),
});

// WISHLISTS
export const wishlists = pgTable("wishlists", {
    id: serial("id").primaryKey(),
    user_id: integer("user_id").references(() => profiles.id),
    created_at: timestamp("created_at").defaultNow(),
});

export const wishlist_items = pgTable("wishlist_items", {
    id: serial("id").primaryKey(),
    wishlist_id: integer("wishlist_id").references(() => wishlists.id),
    product_variant_id: integer("product_variant_id").references(() => product_variants.id),
});

// CARTS
export const carts = pgTable("carts", {
    id: serial("id").primaryKey(),
    user_id: integer("user_id").references(() => profiles.id), // text because auth.uid() is text
    guest_id: text("guest_id"), // temporary ID for guest carts
    created_at: timestamp("created_at").defaultNow(),
});

export const cart_items = pgTable("cart_items", {
    id: serial("id").primaryKey(),
    cart_id: integer("cart_id").references(() => carts.id),
    product_variant_id: integer("product_variant_id").references(() => product_variants.id),
    quantity: integer("quantity"),
});

// ORDERS
export const orders = pgTable("orders", {
    id: serial("id").primaryKey(),
    user_id: integer("user_id").references(() => profiles.id),
    order_number: varchar("order_number").unique(),
    status: varchar("status"), // pending, paid, shipped, delivered, cancelled
    subtotal: numeric("subtotal", { precision: 10, scale: 2 }),
    discount: numeric("discount", { precision: 10, scale: 2 }),
    tax: numeric("tax", { precision: 10, scale: 2 }),
    total_price: numeric("total_price", { precision: 10, scale: 2 }),
    receipt_url: varchar("receipt_url"),
    created_at: timestamp("created_at").defaultNow(),
});

export const order_items = pgTable("order_items", {
    id: serial("id").primaryKey(),
    order_id: integer("order_id").references(() => orders.id),
    product_variant_id: integer("product_variant_id").references(() => product_variants.id),
    quantity: integer("quantity"),
    unit_price: numeric("unit_price", { precision: 10, scale: 2 }),
});

// PROMOTIONS
export const promotions = pgTable("promotions", {
    id: serial("id").primaryKey(),
    code: varchar("code").unique(),
    discount_percentage: numeric("discount_percentage", { precision: 5, scale: 2 }),
    valid_from: timestamp("valid_from"),
    valid_until: timestamp("valid_until"),
    is_active: boolean("is_active"),
    collection_id: integer("collection_id").references(() => collections.id),
});

// PAYMENTS
export const payments = pgTable("payments", {
    id: serial("id").primaryKey(),
    order_id: integer("order_id").references(() => orders.id),
    promotion_id: integer("promotion_id").references(() => promotions.id),
    method: varchar("method"), // card, mpesa, paypal
    amount: numeric("amount", { precision: 10, scale: 2 }),
    status: varchar("status"), // pending, success, failed
    created_at: timestamp("created_at").defaultNow(),
});

// REVIEWS
export const reviews = pgTable("reviews", {
    id: serial("id").primaryKey(),
    user_id: integer("user_id").references(() => profiles.id),
    product_id: integer("product_id").references(() => products.id),
    rating: integer("rating"), // 1 to 5
    comment: text("comment"),
    created_at: timestamp("created_at").defaultNow(),
});

// CUSTOM ORDERS
export const custom_orders = pgTable("custom_orders", {
    id: serial("id").primaryKey(),
    user_id: integer("user_id").references(() => profiles.id),
    description: text("description"),
    reference_images: text("reference_images"),
    status: varchar("status"), // pending, confirmed, in-progress, completed
    created_at: timestamp("created_at").defaultNow(),
});

// NOTIFICATIONS
export const notifications = pgTable("notifications", {
    id: serial("id").primaryKey(),
    user_id: integer("user_id").references(() => profiles.id),
    message: text("message"),
    type: varchar("type"), // order_update, promo, system
    is_read: boolean("is_read").default(false),
    created_at: timestamp("created_at").defaultNow(),
});

// NEWSLETTER SUBSCRIPTIONS
export const newsletter_subscriptions = pgTable("newsletter_subscriptions", {
    id: serial("id").primaryKey(),
    user_id: integer("user_id").references(() => profiles.id),
    subscribed: boolean("subscribed"),
    updated_at: timestamp("updated_at").defaultNow(),
});

// ANALYTICS
export const analytics = pgTable("analytics", {
    id: serial("id").primaryKey(),
    user_id: integer("user_id").references(() => profiles.id),
    product_id: integer("product_id").references(() => products.id),
    collection_id: integer("collection_id").references(() => collections.id),
    category_id: integer("category_id").references(() => categories.id),
    action: varchar("action"), // view, add_to_cart, checkout, purchase
    created_at: timestamp("created_at").defaultNow(),
});
