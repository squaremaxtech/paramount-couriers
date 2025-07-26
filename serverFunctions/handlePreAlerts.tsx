"use server"
import { db } from "@/db"
import { preAlerts } from "@/db/schema"
import { dbInvoiceType, newPreAlertSchema, newPreAlertType, preAlertSchema, preAlertType, tableColumns, tableFilterTypes, tableNames, wantedCrudObjType } from "@/types"
import { and, desc, eq, SQLWrapper } from "drizzle-orm"
import { deleteInvoices } from "./handleDocuments"
import { ensureCanAccessTable } from "./handleAuth"
import { handleEnsureCanAccessTableResults } from "@/utility/utility"

export async function addPreAlert(newPreAlertObj: newPreAlertType) {
    //auth check
    const accessTableResults = await ensureCanAccessTable("preAlerts", { crud: 'c' })
    handleEnsureCanAccessTableResults(accessTableResults)

    //validation
    newPreAlertSchema.parse(newPreAlertObj)

    //add new request
    await db.insert(preAlerts).values({
        ...newPreAlertObj
    })
}

export async function updatePreAlert(preAlertId: preAlertType["id"], updatedPreAlertObj: Partial<preAlertType>, wantedCrudObj: wantedCrudObjType) {
    //validation
    preAlertSchema.partial().parse(updatedPreAlertObj)

    //auth
    const accessTableResults = await ensureCanAccessTable("preAlerts", wantedCrudObj, Object.keys(updatedPreAlertObj) as tableColumns["preAlerts"][])
    handleEnsureCanAccessTableResults(accessTableResults)

    await db.update(preAlerts)
        .set({
            ...updatedPreAlertObj
        })
        .where(eq(preAlerts.id, preAlertId));
}

export async function deletePreAlert(preAlertId: preAlertType["id"], wantedCrudObj: wantedCrudObjType) {
    //auth check
    const accessTableResults = await ensureCanAccessTable("preAlerts", wantedCrudObj)
    handleEnsureCanAccessTableResults(accessTableResults)

    //validation
    preAlertSchema.shape.id.parse(preAlertId)

    await db.delete(preAlerts).where(eq(preAlerts.id, preAlertId));
}

export async function deleteInvoiceOnPreAlert(preAlertId: preAlertType["id"], dbInvoiceType: dbInvoiceType[], wantedCrudObj: wantedCrudObjType) {
    //validation
    preAlertSchema.shape.id.parse(preAlertId)

    //auth check
    const accessTableResults = await ensureCanAccessTable("preAlerts", wantedCrudObj)
    handleEnsureCanAccessTableResults(accessTableResults)

    //delete from folder
    await deleteInvoices(dbInvoiceType.map(eachDbInvoiceType => eachDbInvoiceType.file.src))
}

export async function getSpecificPreAlert(preAlertId: preAlertType["id"], wantedCrudObj: wantedCrudObjType, runAuth = true): Promise<preAlertType | undefined> {
    if (runAuth) {
        //auth check
        const accessTableResults = await ensureCanAccessTable("preAlerts", wantedCrudObj)
        handleEnsureCanAccessTableResults(accessTableResults)
    }

    preAlertSchema.shape.id.parse(preAlertId)

    const result = await db.query.preAlerts.findFirst({
        where: eq(preAlerts.id, preAlertId),
    });

    return result
}

export async function getPreAlerts(filter: tableFilterTypes<preAlertType>, wantedCrudObj: wantedCrudObjType, limit = 50, offset = 0): Promise<preAlertType[]> {
    //auth check
    const accessTableResults = await ensureCanAccessTable("preAlerts", wantedCrudObj)
    handleEnsureCanAccessTableResults(accessTableResults)

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