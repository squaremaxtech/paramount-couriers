import path from "path";
import fs from "fs/promises";
import { NextResponse } from "next/server";
import { ensureDirectoryExists } from "@/utility/manageFiles";
import { allowedImageFileTypes, allowedInvoiceFileTypes, maxDocumentUploadSize, uploadedImagesDirectory, uploadedInvoicesDirectory } from "@/types/uploadTypes";
import { convertBtyes } from "@/useful/usefulFunctions";
import { sessionCheck } from "@/serverFunctions/handleAuth";
import { dbFileSchema } from "@/types";

export async function POST(request: Request) {
    await sessionCheck()

    const formData = await request.formData();
    const body = Object.fromEntries(formData);

    const seenUploadType = dbFileSchema.shape.type.parse(body["type"])
    if (seenUploadType === undefined) throw new Error("not seeing upload type")

    const addedFileNamesPre = await Promise.all(
        Object.entries(body).map(async eachEntry => {
            const eachEntryKey = eachEntry[0] //file id
            const eachEntryValue = eachEntry[1]
            if (eachEntryKey === "type") return null //skip type declaration

            const file = eachEntryValue as File;

            const mainDirectory = seenUploadType === "invoice" ? uploadedInvoicesDirectory : seenUploadType === "image" ? uploadedImagesDirectory : null
            if (mainDirectory === null) throw new Error("mainDirectory null")

            //ensure directory exists
            await ensureDirectoryExists(mainDirectory)

            const documentPath = path.join(mainDirectory, eachEntryKey)

            // Check if file proper file type
            const allowedFileTypes = seenUploadType === "invoice" ? allowedInvoiceFileTypes : seenUploadType === "image" ? allowedImageFileTypes : null
            if (allowedFileTypes === null) throw new Error("allowedFileTypes null")
            if (!allowedFileTypes.includes(file.type)) throw new Error("Invalid file type");

            // Check the file size
            if (file.size > maxDocumentUploadSize) {
                throw new Error(`File is too large. Maximum size is ${convertBtyes(maxDocumentUploadSize, "mb")} MB`)
            }

            const buffer = Buffer.from(await file.arrayBuffer());

            await fs.writeFile(documentPath, buffer);

            return eachEntryKey
        })
    )
    const addedFileNames = addedFileNamesPre.filter(eachInvoiceName => eachInvoiceName !== null)

    return NextResponse.json({
        names: addedFileNames,
    });
}