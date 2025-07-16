"use server"
import { userUploadedInvoicesDirectory as uploadedInvoicesDirectory } from "@/types/uploadTypes"
import path from "path";
import fs from "fs/promises";
import { dbInvoiceType } from "@/types";

export async function deleteInvoices(invoiceSrcs: dbInvoiceType["src"][]) {
    //remove file
    await Promise.all(
        invoiceSrcs.map(async eachSrc => {
            const baseFolderPath = path.join(uploadedInvoicesDirectory, eachSrc)

            await fs.rm(baseFolderPath, { force: true, recursive: true })
        })
    )
}