"use server"
import { db } from "@/db"
import { preAlerts } from "@/db/schema"
import { crudType, dbInvoiceType, newPreAlertSchema, newPreAlertType, preAlertSchema, preAlertType, tableFilterTypes, updatePreAlertSchema, wantedCrudObjType } from "@/types"
import { and, desc, eq, SQLWrapper } from "drizzle-orm"
import { deleteInvoices } from "./handleDocuments"
import { ensureCanAccessTable } from "./handleAuth"

export async function addPreAlert(newPreAlertObj: newPreAlertType) {
    //auth check
    await ensureCanAccessTable("preAlerts", { crud: 'c' })

    //validation
    newPreAlertSchema.parse(newPreAlertObj)

    //add new request
    await db.insert(preAlerts).values({
        ...newPreAlertObj
    })
}

export async function updatePreAlert(preAlertId: preAlertType["id"], updatedPreAlertObj: Partial<preAlertType>, wantedCrudObj: wantedCrudObjType) {
    //first validate on client
    //client only sends key value pairs that can be updated
    //server validates again, shows any errors

    // id;
    // userId;
    // dateCreated;
    // trackingNumber;
    // store;
    // consignee;
    // description;
    // price;
    // invoices
    // acknowledged

    //go over all key values
    const updatedPreAlertObjEntries = Object.entries(updatedPreAlertObj)

    const validatedUpdatedPreAlertObjPre = await Promise.all(
        updatedPreAlertObjEntries.map(async eachEntry => {
            const eachKey = eachEntry[0] as keyof preAlertType
            const eachValue = eachEntry[1]

            if (eachKey === "fromUser") return null

            //auth check
            await ensureCanAccessTable("preAlerts", wantedCrudObj, eachKey)

            //pass validation return info
            return [eachKey, eachValue]
        })
    )

    const validatedUpdatedPreAlertObj: Partial<preAlertType> = Object.fromEntries(validatedUpdatedPreAlertObjPre.filter(eachEntryArr => eachEntryArr !== null))

    updatePreAlertSchema.partial().parse(validatedUpdatedPreAlertObj)

    await db.update(preAlerts)
        .set({
            ...validatedUpdatedPreAlertObj
        })
        .where(eq(preAlerts.id, preAlertId));
}

export async function deletePreAlert(preAlertId: preAlertType["id"], wantedCrudObj: wantedCrudObjType) {
    //auth check
    await ensureCanAccessTable("preAlerts", wantedCrudObj)

    //validation
    preAlertSchema.shape.id.parse(preAlertId)

    await db.delete(preAlerts).where(eq(preAlerts.id, preAlertId));
}

export async function deleteInvoiceOnPreAlert(preAlertId: preAlertType["id"], dbInvoiceType: dbInvoiceType[], wantedCrudObj: wantedCrudObjType) {
    //validation
    preAlertSchema.shape.id.parse(preAlertId)

    //auth check
    await ensureCanAccessTable("preAlerts", wantedCrudObj)

    //delete from folder
    await deleteInvoices(dbInvoiceType.map(eachDbInvoiceType => eachDbInvoiceType.file.src))
}

export async function getSpecificPreAlert(preAlertId: preAlertType["id"], wantedCrudObj: wantedCrudObjType): Promise<preAlertType | undefined> {
    //auth check
    await ensureCanAccessTable("preAlerts", wantedCrudObj)

    preAlertSchema.shape.id.parse(preAlertId)

    const result = await db.query.preAlerts.findFirst({
        where: eq(preAlerts.id, preAlertId),
    });

    return result
}

export async function getPreAlerts(filter: tableFilterTypes<preAlertType>, wantedCrudObj: wantedCrudObjType, limit = 50, offset = 0): Promise<preAlertType[]> {
    //auth check
    await ensureCanAccessTable("preAlerts", wantedCrudObj)

    // Collect conditions dynamically
    const whereClauses: SQLWrapper[] = []

    if (filter.id !== undefined) {
        whereClauses.push(eq(preAlerts.id, filter.id))
    }

    if (filter.userId !== undefined) {
        whereClauses.push(eq(preAlerts.userId, filter.userId))
    }

    if (filter.acknowledged !== undefined) {
        whereClauses.push(eq(preAlerts.acknowledged, filter.acknowledged))
    }

    const results = await db.query.preAlerts.findMany({
        where: and(...whereClauses),
        limit: limit,
        offset: offset,
        orderBy: [desc(preAlerts.dateCreated)],
        with: {
            fromUser: true
        }
    });

    return results
}