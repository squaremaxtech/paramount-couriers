"use server"
import path from "path";
import fs from "fs/promises";
import { dbFileType } from "@/types";
import { imagesDirName, invoicesDirName, uploadedDataDir } from "@/lib/dirPaths";

export async function deleteInvoices(invoiceSrcs: dbFileType["src"][]) {
    //remove file
    await Promise.all(
        invoiceSrcs.map(async eachSrc => {
            const baseFolderPath = path.join(uploadedDataDir, invoicesDirName, eachSrc)

            await fs.rm(baseFolderPath, { force: true, recursive: true })
        })
    )
}

export async function deleteImages(imageSrcs: dbFileType["src"][]) {
    //remove file
    await Promise.all(
        imageSrcs.map(async eachSrc => {
            const baseFolderPath = path.join(uploadedDataDir, imagesDirName, eachSrc)

            await fs.rm(baseFolderPath, { force: true, recursive: true })
        })
    )
}