import { z } from "zod";

export const dateSchma = z.preprocess((val) => {
    if (typeof val === "string" || typeof val === "number") return new Date(val);
    return val;
}, z.date())

export type dbImageType = z.infer<typeof dbImageSchema>

export const dbInvoiceSchema = z.object({
    createdAt: dateSchma,
    src: z.string().min(1),
})
export type dbInvoiceType = z.infer<typeof dbInvoiceSchema>

export type preAlertFilterType = {
    [key in keyof preAlertType]?: preAlertType[key]
}

export const dbImageSchema = z.object({
    createdAt: dateSchma,
    src: z.string().min(1),
    alt: z.string().min(1),
})

export const uploadNamesResponseSchema = z.object({
    names: z.string().array(),
})
export type uploadNamesResponseType = z.infer<typeof uploadNamesResponseSchema>

export type dashboardMenu = {
    icon: React.JSX.Element,
    link: string | null,
    title: string,
    dashboardHome?: true,
}

















//keep synced with db schema
export const roleSchema = z.enum(["admin", "employee", "customer"])
export type roleType = z.infer<typeof roleSchema>

export const accessLevelSchema = z.enum(["regular", "warehouse", "elevated", "supervisor"])
export type accessLevelType = z.infer<typeof accessLevelSchema>

export const userSchema = z.object({
    //defaults
    id: z.string().min(1),
    role: roleSchema,
    accessLevel: accessLevelSchema,
    authorizedUsers: z.object({
        userId: z.string().min(1)
    }).array(),

    //regular

    //null
    name: z.string().min(1).nullable(),
    email: z.string().email().nullable(),
    emailVerified: dateSchma.nullable(),
    image: z.string().min(1).nullable(),
})
export type userType = z.infer<typeof userSchema> & {
    packages?: packageType[],
    preAlerts?: preAlertType[],
}




export const statusSchema = z.enum(["fulfilled", "in progress", "cancelled", "on hold"])
export type statusType = z.infer<typeof statusSchema>

export const locationSchema = z.enum(["on way to warehouse", "warehouse delivered", "in transit to jamaica", "jamaica arrived", "ready for pickup"])
export type locationType = z.infer<typeof locationSchema>

export const packageSchema = z.object({
    id: z.number(),
    dateCreated: dateSchma,

    userId: userSchema.shape.id,
    location: locationSchema,
    status: statusSchema,
    trackingNumber: z.string().min(1),
    images: dbImageSchema.array(),
    weight: z.number(),
    payment: z.number(),
    store: z.string().min(1),
    consignee: z.string().min(1),
    description: z.string().min(1),
    price: z.number(),
    invoices: dbInvoiceSchema.array(),
    comments: z.string(),
})
export type packageType = z.infer<typeof packageSchema> & {
    fromUser?: userType,
}




export const preAlertSchema = z.object({
    id: z.string().min(1),
    dateCreated: dateSchma,

    userId: z.string().min(1),
    trackingNumber: z.string().min(1),
    store: z.string().min(1),
    consignee: z.string().min(1),
    description: z.string().min(1),
    price: z.string(),
    invoices: dbInvoiceSchema.array(),
    acknowledged: z.boolean(),
})
export type preAlertType = z.infer<typeof preAlertSchema> & {
    fromUser?: userType,
}

export const newPreAlertSchema = preAlertSchema.omit({ id: true, dateCreated: true })
export type newPreAlertType = z.infer<typeof newPreAlertSchema>

export const updatePreAlertSchema = preAlertSchema.omit({ id: true, dateCreated: true, userId: true })
export type updatePreAlertType = z.infer<typeof updatePreAlertSchema>