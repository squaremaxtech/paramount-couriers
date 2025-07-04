import { z } from "zod";

export const dateSchma = z.preprocess((val) => {
    if (typeof val === "string" || typeof val === "number") return new Date(val);
    return val;
}, z.date())




export const dbImageSchema = z.object({
    createdAt: dateSchma,
    src: z.string().min(1),
    alt: z.string().min(1),
})
export type dbImageType = z.infer<typeof dbImageSchema>

export const dbInvoiceSchema = z.object({
    createdAt: dateSchma,
    src: z.string().min(1),
})
export type dbInvoiceType = z.infer<typeof dbInvoiceSchema>



















//keep synced with db schema
export const roleSchema = z.enum(["admin", "employee", "customer"])
export type roleType = z.infer<typeof roleSchema>

export const accessLevelSchema = z.enum(["regular", "elevated", "head"])
export type accessLevelType = z.infer<typeof accessLevelSchema>

export const userSchema = z.object({
    id: z.string().min(1),

    role: roleSchema,
    accessLevel: accessLevelSchema,

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

export const packageSchema = z.object({
    //normal
    id: z.string().min(1),
    userId: z.string().min(1),
    sequenceId: z.number(),
    status: statusSchema,
    store: z.string().min(1),
    trackingNumber: z.string().min(1),
    consignee: z.string().min(1),
    comments: z.string().min(1),
    invoices: dbInvoiceSchema.array(),

    //defaults
    dateCreated: dateSchma,

    //null
})
export type packageType = z.infer<typeof packageSchema> & {
    fromUser?: userType,
    items?: itemType[],
}




export const locationSchema = z.enum(["on way to warehouse", "warehouse delivered", "in transit to jamaica", "jamaica arrived", "ready for pickup"])
export type locationType = z.infer<typeof locationSchema>

export const itemSchema = z.object({
    id: z.string().min(1),
    packageId: z.string().min(1),
    location: locationSchema,
    images: dbImageSchema.array(),
    weight: z.number(),
    price: z.number(),
    paid: z.boolean(),

    dateCreated: dateSchma,
})
export type itemType = z.infer<typeof itemSchema> & {
    fromPackage?: packageType,
}




export const preAlertSchema = z.object({
    id: z.string().min(1),
    userId: z.string().min(1),
    trackingNumber: z.string().min(1),
    store: z.string().min(1),
    value: z.number(),
    description: z.string().min(1),
    consignee: z.string().min(1),
    invoices: dbInvoiceSchema.array(),

    dateCreated: dateSchma,
})
export type preAlertType = z.infer<typeof preAlertSchema> & {
    fromUser?: userType,
}