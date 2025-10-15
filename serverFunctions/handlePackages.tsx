"use server"
import { db } from "@/db"
import { packages } from "@/db/schema"
import { dbImageType, dbInvoiceType, newPackageSchema, newPackageType, packageSchema, packageType, tableColumns, tableFilterTypes, crudActionObjType, userType } from "@/types"
import { and, desc, eq, SQLWrapper } from "drizzle-orm"
import { deleteImages, deleteInvoices } from "./handleFiles"
import { ensureCanAccessTable } from "./handleAuth"
import { handleEnsureCanAccessTableResults, makeWhereClauses } from "@/utility/utility"
import { filterTableObjectByColumnAccess } from "@/useful/usefulFunctions"
import { initialNewPackageObj } from "@/lib/initialFormData"
import { sendNotificationEmail } from "./handleEmailNotifications"

export async function addPackage(newPackageObj: newPackageType) {
    const accessTableResults = await ensureCanAccessTable("packages", Object.keys(newPackageObj) as tableColumns["packages"][], { action: "c" })
    handleEnsureCanAccessTableResults(accessTableResults, "table")

    //validate on server as well - if no rights then it'll replace
    const filteredPackage = filterTableObjectByColumnAccess(accessTableResults.tableColumnAccess, newPackageObj, initialNewPackageObj)

    //validation
    const validatedPackage = newPackageSchema.parse(filteredPackage)

    //add new request
    const [newPackage] = await db.insert(packages).values({
        ...validatedPackage
    }).returning()

    //notifs
    sendNotificationEmail({
        table: { name: "packages", updatedPackage: newPackage },
        action: "c",
        sendTo: { type: "id", userId: validatedPackage.userId }
    })
}

export async function updatePackage(packageId: packageType["id"], userId: userType["id"], updatedPackageObj: Partial<packageType>, crudActionObj: crudActionObjType): Promise<packageType> {
    //validation
    packageSchema.partial().parse(updatedPackageObj)

    //auth
    const accessTableResults = await ensureCanAccessTable("packages", Object.keys(updatedPackageObj) as tableColumns["packages"][], crudActionObj)
    handleEnsureCanAccessTableResults(accessTableResults, "both")

    //get current package
    const currentPackage = await getSpecificPackage(packageId, crudActionObj)
    if (currentPackage === undefined) throw new Error(`not seeing package for id ${packageId}`)

    const [updatedPackage] = await db.update(packages)
        .set({
            ...updatedPackageObj
        })
        .where(eq(packages.id, packageId)).returning()

    //notifs
    sendNotificationEmail({
        table: { name: "packages", oldPackage: currentPackage, updatedPackage: updatedPackage },
        action: "u",
        sendTo: { type: "id", userId: userId }
    })

    return updatedPackage
}

export async function deletePackage(packageId: packageType["id"], crudActionObj: crudActionObjType) {
    //auth check
    const accessTableResults = await ensureCanAccessTable("packages", undefined, crudActionObj);
    handleEnsureCanAccessTableResults(accessTableResults, "both")

    //validation
    packageSchema.shape.id.parse(packageId)

    await db.delete(packages).where(eq(packages.id, packageId));
}

export async function deleteInvoiceOnPackage(packageId: packageType["id"], dbInvoiceType: dbInvoiceType[], crudActionObj: crudActionObjType) {
    //validation
    packageSchema.shape.id.parse(packageId)

    //auth check
    const accessTableResults = await ensureCanAccessTable("packages", undefined, crudActionObj);
    handleEnsureCanAccessTableResults(accessTableResults, "both")

    //delete from folder
    await deleteInvoices(dbInvoiceType.map(eachDbInvoiceType => eachDbInvoiceType.file.src))
}

export async function deleteImageeOnPackage(packageId: packageType["id"], dbImageType: dbImageType[], crudActionObj: crudActionObjType) {
    //validation
    packageSchema.shape.id.parse(packageId)

    //auth check
    const accessTableResults = await ensureCanAccessTable("packages", undefined, crudActionObj);
    handleEnsureCanAccessTableResults(accessTableResults, "both")

    //delete from folder
    await deleteImages(dbImageType.map(eachDbImage => eachDbImage.file.src))
}


export async function getSpecificPackage(packageId: packageType["id"], crudActionObj: crudActionObjType, runAuth = true): Promise<packageType | undefined> {
    if (runAuth) {
        //auth check
        const accessTableResults = await ensureCanAccessTable("packages", undefined, crudActionObj);

        handleEnsureCanAccessTableResults(accessTableResults, "both")
    }

    packageSchema.shape.id.parse(packageId)

    const result = await db.query.packages.findFirst({
        where: eq(packages.id, packageId),
    });

    return result
}

export async function getPackages(filter: tableFilterTypes<packageType>, crudActionObj: crudActionObjType, getWith?: { [key in keyof packageType]?: true }, limit = 50, offset = 0): Promise<packageType[]> {
    // Auth check
    const accessTableResults = await ensureCanAccessTable("packages", undefined, crudActionObj);
    handleEnsureCanAccessTableResults(accessTableResults, "both");

    //compile filters into proper where clauses
    const whereClauses: SQLWrapper[] = makeWhereClauses(packageSchema.partial(), filter, packages)

    const results = await db.query.packages.findMany({
        where: and(...whereClauses),
        limit,
        offset,
        orderBy: [desc(packages.dateCreated)],
        with: getWith === undefined ? undefined : {
            fromUser: getWith.fromUser,
        }
    });

    return results;
}