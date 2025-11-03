import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@/db/schema"; // Import all your schemas here

const client = postgres(process.env.SUPABASE_DB_URL!);
export const db = drizzle(client, {schema, casing: 'snake_case'} );
