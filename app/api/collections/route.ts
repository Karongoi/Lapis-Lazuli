import { db } from "@/lib/db";
import { collections } from "@/db/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

// GET all collections
export async function GET() {
    const data = await db.select().from(collections);
    return NextResponse.json(data);
}

// POST new collection
export async function POST(req: Request) {
    const body = await req.json();
    const newItem = await db.insert(collections).values(body).returning();
    return NextResponse.json(newItem[0]);
}

// PUT update collection by ID
export async function PUT(req: Request) {
    const body = await req.json();
    const { id, ...updateData } = body;
    const updatedItem = await db
        .update(collections)
        .set(updateData)
        .where(eq(collections.id, id))
        .returning();
    return NextResponse.json(updatedItem[0]);
}

// DELETE collection by ID
export async function DELETE(req: Request) {
    const { id } = await req.json();
    if (!id) {
        return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }
    await db
        .delete(collections)
        .where(eq(collections.id, Number(id)))
        .returning();
    return NextResponse.json({ success: true });
}