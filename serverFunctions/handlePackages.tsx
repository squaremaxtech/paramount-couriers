"use server"
import { db } from "@/db"
import { packages } from "@/db/schema"
import { dbImageType, dbInvoiceType, newPackageSchema, newPackageType, packageSchema, packageType, tableColumns, tableFilterTypes, wantedCrudObjType } from "@/types"
import { and, desc, eq, SQLWrapper } from "drizzle-orm"
import { deleteImages, deleteInvoices } from "./handleDocuments"
import { ensureCanAccessTable, sessionCheck } from "./handleAuth"
import { handleEnsureCanAccessTableResults, makeWhereClauses } from "@/utility/utility"
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

export async function updatePackage(packageId: packageType["id"], updatedPackageObj: Partial<packageType>, wantedCrudObj: wantedCrudObjType): Promise<packageType> {
    //validation
    packageSchema.partial().parse(updatedPackageObj)

    //auth
    const accessTableResults = await ensureCanAccessTable("packages", wantedCrudObj, Object.keys(updatedPackageObj) as tableColumns["packages"][])
    handleEnsureCanAccessTableResults(accessTableResults, "both")

    const [result] = await db.update(packages)
        .set({
            ...updatedPackageObj
        })
        .where(eq(packages.id, packageId)).returning()

    return result
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

export async function getPackages(filter: tableFilterTypes<packageType>, wantedCrudObj: wantedCrudObjType, getWith?: { [key in keyof packageType]?: true }, limit = 50, offset = 0,): Promise<packageType[]> {
    // Auth check
    //madatory restriction for users that dont have r permissions for multipleSearch
    if (wantedCrudObj.crud === "ro") {
        wantedCrudObj.skipResourceIdCheck = true

        const session = await sessionCheck()
        filter.userId = session.user.id
    }

    const accessTableResults = await ensureCanAccessTable("packages", wantedCrudObj);
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