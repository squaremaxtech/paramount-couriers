"use server"
import { db } from "@/db"
import { preAlerts } from "@/db/schema"
import { newPreAlertSchema, newPreAlertType, preAlertFilterType, preAlertSchema, preAlertType, updatePreAlertSchema } from "@/types"
import { and, desc, eq, SQLWrapper } from "drizzle-orm"

export async function addPreAlerts(newPreAlertObj: newPreAlertType) {
    //security check 

    //validation
    newPreAlertSchema.parse(newPreAlertObj)

    //add new request
    await db.insert(preAlerts).values({
        ...newPreAlertObj
    })
}

export async function updatePreAlerts(preAlertId: preAlertType["id"], updatedPreAlertObj: Partial<preAlertType>) {
    //security check  

    updatePreAlertSchema.partial().parse(updatedPreAlertObj)

    await db.update(preAlerts)
        .set({
            ...updatedPreAlertObj
        })
        .where(eq(preAlerts.id, preAlertId));
}

export async function deletePreAlerts(preAlertId: preAlertType["id"]) {
    //validation
    preAlertSchema.shape.id.parse(preAlertId)

    await db.delete(preAlerts).where(eq(preAlerts.id, preAlertId));
}

export async function getSpecificPreAlert(preAlertId: preAlertType["id"]): Promise<preAlertType | undefined> {
    //security check

    preAlertSchema.shape.id.parse(preAlertId)

    const result = await db.query.preAlerts.findFirst({
        where: eq(preAlerts.id, preAlertId),
    });

    return result
}

export async function getPreAlerts(filter: preAlertFilterType, limit = 50, offset = 0): Promise<preAlertType[]> {
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
    });

    return results
}