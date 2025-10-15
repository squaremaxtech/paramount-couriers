import { accessLevelOptions, dbImageType, dbInvoiceType, locationOptions, packageDeliveryMethodOptions, packageType, roleOptions, statusOptions, userType } from "@/types";
import { relations } from "drizzle-orm";
import { boolean, timestamp, pgTable, text, primaryKey, integer, pgEnum, serial, json, decimal, index } from "drizzle-orm/pg-core"
import type { AdapterAccountType } from "next-auth/adapters"

export const roleEnum = pgEnum("role", roleOptions);
export const accessLevelEnum = pgEnum("accessLevel", accessLevelOptions);
export const packageDeliveryMethodEnum = pgEnum("packageDeliveryMethod", packageDeliveryMethodOptions);

export const users = pgTable("users", {
    //defaults
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    role: roleEnum().notNull().default("customer"),
    accessLevel: accessLevelEnum().notNull().default("regular"),
    authorizedUsers: json("authorizedUsers").$type<userType["authorizedUsers"]>().notNull().default([]),
    address: json("address").$type<userType["address"]>().default(null),
    packageDeliveryMethod: packageDeliveryMethodEnum().notNull().default("Kingston"),
    active: boolean("active").notNull().default(true),

    //regular

    //null
    name: text("name"),
    email: text("email").unique(),
    emailVerified: timestamp("emailVerified", { mode: "string" }),
    image: text("image"),
})
export const userRelations = relations(users, ({ many }) => ({
    packages: many(packages),
}));




export const locationEnum = pgEnum("location", locationOptions);
export const statusEnum = pgEnum("status", statusOptions);

export const packages = pgTable("packages", {
    id: serial("id").primaryKey(),
    dateCreated: timestamp("dateCreated", { mode: "string" }).notNull().defaultNow(),

    userId: text("userId").notNull().references(() => users.id),
    location: locationEnum().notNull(),
    status: statusEnum().notNull(),
    trackingNumber: text("trackingNumber").notNull(),
    store: text("store").notNull(),
    consignee: text("consignee").notNull(),
    description: text("description").notNull(),
    packageValue: decimal("packageValue").notNull(),
    cifValue: decimal("cifValue").notNull(),
    charges: json("charges").$type<packageType["charges"]>().notNull(),
    invoices: json("invoices").$type<dbInvoiceType[]>().notNull(),
    images: json("images").$type<dbImageType[]>().notNull(),
    weight: decimal("weight").notNull(),
    payment: decimal("payment").notNull(),
    comments: text("comments").notNull(),
    needAttention: boolean("needAttention").notNull(),
},
    (table) => {
        return {
            packageUserIdIndex: index("packageUserIdIndex").on(table.userId),
            packagesDateCreatedIndex: index("packagesDateCreatedIndex").on(table.dateCreated),
        };
    })
export const packageRelations = relations(packages, ({ one, many }) => ({
    fromUser: one(users, {
        fields: [packages.userId],
        references: [users.id]
    }),
}));









export const accounts = pgTable(
    "account",
    {
        userId: text("userId")
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
        type: text("type").$type<AdapterAccountType>().notNull(),
        provider: text("provider").notNull(),
        providerAccountId: text("providerAccountId").notNull(),
        refresh_token: text("refresh_token"),
        access_token: text("access_token"),
        expires_at: integer("expires_at"),
        token_type: text("token_type"),
        scope: text("scope"),
        id_token: text("id_token"),
        session_state: text("session_state"),
    },
    (account) => [
        {
            compoundKey: primaryKey({
                columns: [account.provider, account.providerAccountId],
            }),
        },
    ]
)
export const sessions = pgTable("session", {
    sessionToken: text("sessionToken").primaryKey(),
    userId: text("userId")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    expires: timestamp("expires", { mode: "date" }).notNull(),
})
export const verificationTokens = pgTable(
    "verificationToken",
    {
        identifier: text("identifier").notNull(),
        token: text("token").notNull(),
        expires: timestamp("expires", { mode: "date" }).notNull(),
    },
    (verificationToken) => [
        {
            compositePk: primaryKey({
                columns: [verificationToken.identifier, verificationToken.token],
            }),
        },
    ]
)
export const authenticators = pgTable(
    "authenticator",
    {
        credentialID: text("credentialID").notNull().unique(),
        userId: text("userId")
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
        providerAccountId: text("providerAccountId").notNull(),
        credentialPublicKey: text("credentialPublicKey").notNull(),
        counter: integer("counter").notNull(),
        credentialDeviceType: text("credentialDeviceType").notNull(),
        credentialBackedUp: boolean("credentialBackedUp").notNull(),
        transports: text("transports"),
    },
    (authenticator) => [
        {
            compositePK: primaryKey({
                columns: [authenticator.userId, authenticator.credentialID],
            }),
        },
    ]
)