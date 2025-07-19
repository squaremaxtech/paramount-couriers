"use server"
import { db } from "@/db"
import { packages } from "@/db/schema"
import { dbImageType, dbInvoiceType, newPackageSchema, newPackageType, packageSchema, packageType, tableFilterTypes, updatePackageSchema } from "@/types"
import { and, desc, eq, SQLWrapper } from "drizzle-orm"
import { deleteImages, deleteInvoices } from "./handleDocuments"

export async function addPackage(newPackageObj: newPackageType) {
    //security check 

    //validation
    newPackageSchema.parse(newPackageObj)

    //add new request
    await db.insert(packages).values({
        ...newPackageObj
    })
}

export async function updatePackage(packageId: packageType["id"], updatedPackageObj: Partial<packageType>) {
    //security check  

    updatePackageSchema.partial().parse(updatedPackageObj)

    await db.update(packages)
        .set({
            ...updatedPackageObj
        })
        .where(eq(packages.id, packageId));
}

export async function deletePackage(packageId: packageType["id"]) {
    //validation
    packageSchema.shape.id.parse(packageId)

    await db.delete(packages).where(eq(packages.id, packageId));
}

export async function deleteInvoiceOnPackage(packageId: packageType["id"], dbInvoiceType: dbInvoiceType[]) {
    //validation
    packageSchema.shape.id.parse(packageId)

    //validate that user can delete

    //delete from folder
    await deleteInvoices(dbInvoiceType.map(eachDbInvoiceType => eachDbInvoiceType.file.src))
}

export async function deleteImageOnPackage(packageId: packageType["id"], dbImage: dbImageType[]) {
    //validation
    packageSchema.shape.id.parse(packageId)

    //validate that user can delete

    //delete from folder
    await deleteImages(dbImage.map(eachDbImage => eachDbImage.file.src))
}

export async function getSpecificPackage(packageId: packageType["id"]): Promise<packageType | undefined> {
    //security check

    packageSchema.shape.id.parse(packageId)

    const result = await db.query.packages.findFirst({
        where: eq(packages.id, packageId),
    });

    return result
}

export async function getPackages(filter: tableFilterTypes<packageType>, limit = 50, offset = 0): Promise<packageType[]> {
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