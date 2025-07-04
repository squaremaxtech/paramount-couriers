import { dbImageType, dbInvoiceType } from "@/types";
import { relations } from "drizzle-orm";
import { boolean, timestamp, pgTable, text, primaryKey, integer, pgEnum, serial, json, decimal, index } from "drizzle-orm/pg-core"
import type { AdapterAccountType } from "next-auth/adapters"

export const roleEnum = pgEnum("role", ["admin", "employee", "customer"]);
export const accessLevelEnum = pgEnum("accessLevel", ["regular", "elevated", "head"]);

export const users = pgTable("user", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    role: roleEnum().notNull().default("customer"),
    accessLevel: accessLevelEnum().notNull().default("regular"),

    name: text("name"),
    email: text("email").unique(),
    emailVerified: timestamp("emailVerified", { mode: "date" }),
    image: text("image"),
})
export const userRelations = relations(users, ({ one, many }) => ({
    packages: many(packages),
    preAlerts: many(preAlerts),
}));







export const statusEnum = pgEnum("status", ["fulfilled", "in progress", "cancelled", "on hold"]);

export const packages = pgTable("packages", { //unique for amazon, shein, multiple amazon orders... all separate packages
    //regular
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    userId: text("userId").notNull().references(() => users.id),
    sequenceId: serial("sequenceId").notNull(),
    status: statusEnum().notNull(),
    store: text("store").notNull(),
    trackingNumber: text("trackingNumber").notNull(),
    consignee: text("consignee").notNull(),
    comments: text("comments").notNull(),
    invoices: json("invoices").$type<dbInvoiceType[]>().notNull(),

    //defaults
    dateCreated: timestamp("dateCreated", { mode: "date" }).notNull().defaultNow(),

    //null
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
    items: many(items),
}));




export const locationEnum = pgEnum("location", ["on way to warehouse", "warehouse delivered", "in transit to jamaica", "jamaica arrived", "ready for pickup"]);

export const items = pgTable("items", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    packageId: text("packageId").notNull().references(() => packages.id),
    location: locationEnum().notNull(),
    images: json("images").$type<dbImageType[]>().notNull(),
    weight: decimal("weight").notNull(),
    price: decimal("price").notNull(),
    paid: boolean("paid").notNull(),

    dateCreated: timestamp("dateCreated", { mode: "date" }).notNull().defaultNow(),
},
    (table) => {
        return {
            itemsPackageIdIndex: index("itemsPackageIdIndex").on(table.packageId),
            itemsDateCreatedIndex: index("itemsDateCreatedIndex").on(table.dateCreated),
        };
    })
export const itemRelations = relations(items, ({ one }) => ({
    fromPackage: one(packages, {
        fields: [items.packageId],
        references: [packages.id]
    })
}));




export const preAlerts = pgTable("preAlerts", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    userId: text("userId").notNull().references(() => users.id),
    trackingNumber: text("trackingNumber").notNull(),
    store: text("store").notNull(),
    value: decimal("value").notNull(),
    description: text("description").notNull(),
    consignee: text("consignee").notNull(),
    invoices: json("invoices").$type<dbInvoiceType[]>().notNull(),

    dateCreated: timestamp("dateCreated", { mode: "date" }).notNull().defaultNow(),
},
    (table) => {
        return {
            preAlertUserIdIndex: index("preAlertUserIdIndex").on(table.userId),
            preAlertTrackingNumberIndex: index("preAlertTrackingNumberIndex").on(table.trackingNumber),
        };
    })
export const preAlertRelations = relations(preAlerts, ({ one }) => ({
    fromUser: one(users, {
        fields: [preAlerts.userId],
        references: [users.id]
    })
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