import { z } from "zod";

export const dateSchma = z.preprocess((val) => {
    if (typeof val === "string" || typeof val === "number") return new Date(val);
    return val;
}, z.date())

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
export type user = z.infer<typeof userSchema> & {
}