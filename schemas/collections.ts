import { z } from "zod";

export const collectionSchema = z.object({
    name: z.string().min(1, "Name is required"),
    theme: z.string().optional().nullable(),
    description: z.string().optional().nullable(),
    launch_date: z.string().optional().nullable(), // ISO date string
    status: z.enum(["active", "upcoming", "archived"]),
    main_image_url: z.string().url("Invalid image URL"),
    creative_notes: z.string().optional().nullable(),
});

export type CollectionForm = z.infer<typeof collectionSchema>;
