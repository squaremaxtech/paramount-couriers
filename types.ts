import { z } from "zod";

export const dateSchma = z.preprocess((val) => {
    if (typeof val === "string" || typeof val === "number") return new Date(val);
    return val;
}, z.date())

export const dbFileUploadSchema = z.object({
    createdAt: dateSchma,
    fileName: z.string().min(1),
    src: z.string().min(1),
    status: z.enum(["to-delete", "to-upload"]),
    uploaded: z.boolean()
})
export type dbFileUploadType = z.infer<typeof dbFileUploadSchema>

export const dbImageSchema = z.object({
    file: dbFileUploadSchema,
    alt: z.string().min(1),
})
export type dbImageType = z.infer<typeof dbImageSchema>

export const dbInvoiceSchema = z.object({
    file: dbFileUploadSchema,
    type: z.enum(["shipping", "internal"]),
})
export type dbInvoiceType = z.infer<typeof dbInvoiceSchema>

export type tableFilterTypes<T> = {
    [key in keyof T]?: T[key]
}

//handle search component with limits/offsets
export type searchObjType<T> = {
    searchItems: T[],
    loading?: true,
    limit?: number, //how many
    offset?: number, //increaser
    incrementOffsetBy?: number, //how much to increase by
    refreshAll?: boolean
}

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
export const roleOptions = ["admin", "employee", "customer"] as const
export const roleSchema = z.enum(roleOptions)
export type roleType = z.infer<typeof roleSchema>

export const accessLevelOptions = ["regular", "warehouse", "elevated", "supervisor"] as const
export const accessLevelSchema = z.enum(accessLevelOptions)
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

export const newUserSchema = userSchema.omit({ id: true, role: true })
export type newUserType = z.infer<typeof newUserSchema>

export const updateUserSchema = userSchema.omit({ id: true, emailVerified: true })
export type updateUserType = z.infer<typeof updateUserSchema>




export const statusOptions = ["fulfilled", "in progress", "cancelled", "on hold"] as const
export const statusSchema = z.enum(statusOptions)
export type statusType = z.infer<typeof statusSchema>

export const locationOptions = ["on way to warehouse", "warehouse delivered", "in transit to jamaica", "jamaica arrived", "ready for pickup"] as const
export const locationSchema = z.enum(locationOptions)
export type locationType = z.infer<typeof locationSchema>

export const packageSchema = z.object({
    id: z.number(),
    dateCreated: dateSchma,

    userId: userSchema.shape.id,
    location: locationSchema,
    status: statusSchema,
    trackingNumber: z.string().min(1),
    images: dbImageSchema.array(),
    weight: z.string(),
    payment: z.string(),
    store: z.string().min(1),
    consignee: z.string().min(1),
    description: z.string().min(1),
    price: z.string(),
    invoices: dbInvoiceSchema.array(),
    comments: z.string(),
})
export type packageType = z.infer<typeof packageSchema> & {
    fromUser?: userType,
}

export const newPackageSchema = packageSchema.omit({ id: true, dateCreated: true })
export type newPackageType = z.infer<typeof newPackageSchema>

export const updatePackageSchema = packageSchema.omit({ id: true, dateCreated: true, userId: true })
export type updatePackageType = z.infer<typeof updatePackageSchema>



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