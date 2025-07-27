"use server"
import { db } from "@/db"
import { packages } from "@/db/schema"
import { dbImageType, dbInvoiceType, newPackageSchema, newPackageType, packageSchema, packageType, tableColumns, tableFilterTypes, wantedCrudObjType } from "@/types"
import { and, desc, eq, SQLWrapper } from "drizzle-orm"
import { deleteImages, deleteInvoices } from "./handleDocuments"
import { ensureCanAccessTable } from "./handleAuth"
import { handleEnsureCanAccessTableResults } from "@/utility/utility"
import { filterTableObjectByColumnAccess } from "@/useful/usefulFunctions"
import { initialNewPackageObj } from "@/lib/initialFormData"

export async function addPackage(newPackageObj: newPackageType) {
    const accessTableResults = await ensureCanAccessTable("packages", { crud: "c" }, Object.keys(newPackageObj) as tableColumns["packages"][])
    handleEnsureCanAccessTableResults(accessTableResults, "table")

    //validate on server as well - if no rights then it'll replace
    const filteredPackage = filterTableObjectByColumnAccess(accessTableResults.tableColumnAccess, newPackageObj, initialNewPackageObj)

    //validation
    const validatedPackage = newPackageSchema.parse(filteredPackage)

    //add new request
    await db.insert(packages).values({
        ...validatedPackage
    })
}

export async function updatePackage(packageId: packageType["id"], updatedPackageObj: Partial<packageType>, wantedCrudObj: wantedCrudObjType) {
    //validation
    packageSchema.partial().parse(updatedPackageObj)

    //auth
    const accessTableResults = await ensureCanAccessTable("packages", wantedCrudObj, Object.keys(updatedPackageObj) as tableColumns["packages"][])
    handleEnsureCanAccessTableResults(accessTableResults, "both")

    await db.update(packages)
        .set({
            ...updatedPackageObj
        })
        .where(eq(packages.id, packageId));
}

export async function deletePackage(packageId: packageType["id"], wantedCrudObj: wantedCrudObjType) {
    //auth check
    const accessTableResults = await ensureCanAccessTable("packages", wantedCrudObj)
    handleEnsureCanAccessTableResults(accessTableResults, "both")

    //validation
    packageSchema.shape.id.parse(packageId)

    await db.delete(packages).where(eq(packages.id, packageId));
}

export async function deleteInvoiceOnPackage(packageId: packageType["id"], dbInvoiceType: dbInvoiceType[], wantedCrudObj: wantedCrudObjType) {
    //validation
    packageSchema.shape.id.parse(packageId)

    //auth check
    const accessTableResults = await ensureCanAccessTable("packages", wantedCrudObj)
    handleEnsureCanAccessTableResults(accessTableResults, "both")

    //delete from folder
    await deleteInvoices(dbInvoiceType.map(eachDbInvoiceType => eachDbInvoiceType.file.src))
}

export async function deleteImageeOnPackage(packageId: packageType["id"], dbImageType: dbImageType[], wantedCrudObj: wantedCrudObjType) {
    //validation
    packageSchema.shape.id.parse(packageId)

    //auth check
    const accessTableResults = await ensureCanAccessTable("packages", wantedCrudObj)
    handleEnsureCanAccessTableResults(accessTableResults, "both")

    //delete from folder
    await deleteImages(dbImageType.map(eachDbImage => eachDbImage.file.src))
}

export async function getSpecificPackage(packageId: packageType["id"], wantedCrudObj: wantedCrudObjType, runAuth = true): Promise<packageType | undefined> {
    if (runAuth) {
        //auth check
        const accessTableResults = await ensureCanAccessTable("packages", wantedCrudObj)
        handleEnsureCanAccessTableResults(accessTableResults, "both")
    }

    packageSchema.shape.id.parse(packageId)

    const result = await db.query.packages.findFirst({
        where: eq(packages.id, packageId),
    });

    return result
}

export async function getPackages(filter: tableFilterTypes<packageType>, wantedCrudObj: wantedCrudObjType, limit = 50, offset = 0): Promise<packageType[]> {
    //auth check
    const accessTableResults = await ensureCanAccessTable("packages", wantedCrudObj)
    handleEnsureCanAccessTableResults(accessTableResults, "both")
    // Collect conditions dynamically
    const whereClauses: SQLWrapper[] = []

    //validate filter
    // packageSchema.partial().parse(filter)

    if (filter.id !== undefined) {
        whereClauses.push(eq(packages.id, filter.id))
    }

    if (filter.dateCreated !== undefined) {
        whereClauses.push(eq(packages.dateCreated, filter.dateCreated))
    }

    if (filter.userId !== undefined) {
        whereClauses.push(eq(packages.userId, filter.userId))
    }

    if (filter.location !== undefined) {
        whereClauses.push(eq(packages.location, filter.location))
    }

    if (filter.status !== undefined) {
        whereClauses.push(eq(packages.status, filter.status))
    }

    if (filter.trackingNumber !== undefined) {
        whereClauses.push(eq(packages.trackingNumber, filter.trackingNumber))
    }

    if (filter.weight !== undefined) {
        whereClauses.push(eq(packages.weight, filter.weight))
    }

    if (filter.payment !== undefined) {
        whereClauses.push(eq(packages.payment, filter.payment))
    }

    if (filter.store !== undefined) {
        whereClauses.push(eq(packages.store, filter.store))
    }

    if (filter.consignee !== undefined) {
        whereClauses.push(eq(packages.consignee, filter.consignee))
    }

    if (filter.price !== undefined) {
        whereClauses.push(eq(packages.price, filter.price))
    }

    const results = await db.query.packages.findMany({
        where: and(...whereClauses),
        limit: limit,
        offset: offset,
        orderBy: [desc(packages.dateCreated)],
    });

    return results
}