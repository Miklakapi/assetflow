import { z } from 'zod'

export const menuItemSchema = z.object({
    id: z.string().min(1),
    label: z.string().min(1),
    icon: z.string().min(1).nullable(),
    route: z.string().min(1).nullable(),
    get children() {
        return z.array(menuItemSchema)
    },
})

export const menuResponseSchema = z.object({
    items: z.array(menuItemSchema),
})

export type MenuItem = z.output<typeof menuItemSchema>
export type MenuResponse = z.output<typeof menuResponseSchema>
