"use server"
import { db } from "@/db"
import { preAlerts } from "@/db/schema"
import { dbInvoiceType, dbFileType, newPreAlertSchema, newPreAlertType, preAlertSchema, preAlertType, tableFilterTypes, updatePreAlertSchema } from "@/types"
import { and, desc, eq, SQLWrapper } from "drizzle-orm"
import { deleteInvoices } from "./handleDocuments"

export async function addPreAlert(newPreAlertObj: newPreAlertType) {
    //security check 

    //validation
    newPreAlertSchema.parse(newPreAlertObj)

    //add new request
    await db.insert(preAlerts).values({
        ...newPreAlertObj
    })
}

export async function updatePreAlert(preAlertId: preAlertType["id"], updatedPreAlertObj: Partial<preAlertType>) {
    //security check  

    updatePreAlertSchema.partial().parse(updatedPreAlertObj)

    await db.update(preAlerts)
        .set({
            ...updatedPreAlertObj
        })
        .where(eq(preAlerts.id, preAlertId));
}

export async function deletePreAlert(preAlertId: preAlertType["id"]) {
    //validation
    preAlertSchema.shape.id.parse(preAlertId)

    await db.delete(preAlerts).where(eq(preAlerts.id, preAlertId));
}

export async function deleteInvoiceOnPreAlert(preAlertId: preAlertType["id"], dbInvoiceType: dbInvoiceType[]) {
    //validation
    preAlertSchema.shape.id.parse(preAlertId)

    //validate that user can delete

    //delete from folder
    await deleteInvoices(dbInvoiceType.map(eachDbInvoiceType => eachDbInvoiceType.file.src))
}

export async function getSpecificPreAlert(preAlertId: preAlertType["id"]): Promise<preAlertType | undefined> {
    //security check

    preAlertSchema.shape.id.parse(preAlertId)

    const result = await db.query.preAlerts.findFirst({
        where: eq(preAlerts.id, preAlertId),
    });

    return result
}

export async function getPreAlerts(filter: tableFilterTypes<preAlertType>, limit = 50, offset = 0): Promise<preAlertType[]> {
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