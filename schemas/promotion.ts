import { z } from "zod"

export const PromotionSchema = z.object({
  code: z.string(),
  description: z.string().optional(),
  discount_percentage: z.string(),
  valid_from: z.coerce.date(),
  valid_until: z.coerce.date(),
  is_active: z.boolean().default(true),
  collection_id: z.number().nullable().optional(),
})

export type Promotion = z.infer<typeof PromotionSchema>