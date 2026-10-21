import { z } from 'zod';

const itemSchema = z.object({
    name: z.string(),
    description: z.string().nullable(),
    ingredients: z.array(z.string()),
    prices: z.array(z.object({
        label: z.string().nullable(),
        amount: z.number(),
    })),
    allergens: z.array(z.string()),
    tags: z.array(z.string()),
    needs_review: z.boolean(),
});

const categorySchema = z.object({
    name: z.string(),
    continues_from_previous_page: z.boolean(),
    items: z.array(itemSchema),
});

export const menuPageSchema = z.object({
    language: z.string().nullable(),
    currency: z.string().nullable(),
    page_notes: z.array(z.string()),
    categories: z.array(categorySchema),
});

// Export the inferred type so components can use it
export type MenuPage = z.infer<typeof menuPageSchema>;
export type RawItem = z.infer<typeof itemSchema>;