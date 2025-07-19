import path from "path";
import fs from "fs/promises";
import { NextResponse } from "next/server";
import { ensureDirectoryExists } from "@/utility/manageFiles";
import { allowedInvoiceFileTypes, maxDocumentUploadSize, uploadedInvoicesDirectory } from "@/types/uploadTypes";
import { convertBtyes } from "@/useful/usefulFunctions";
import { sessionCheck } from "@/serverFunctions/handleAuth";

export async function POST(request: Request) {
    await sessionCheck()

    const formData = await request.formData();
    const body = Object.fromEntries(formData);

    const seenUploadType = body["type"]
    if (seenUploadType === undefined) throw new Error("not seeing upload type")

    if (seenUploadType === "invoices") {
        //ensure invoices directory exists
        await ensureDirectoryExists(uploadedInvoicesDirectory)

        const addedInvoiceNamesPre = await Promise.all(Object.entries(body).map(async eachEntry => {
            const eachEntryKey = eachEntry[0] //fileName
            const eachEntryValueFile = eachEntry[1]
            if (eachEntryKey === "type") return null //skip type declaration

            const file = eachEntryValueFile as File;
            const documentPath = path.join(uploadedInvoicesDirectory, eachEntryKey)

            // Check if file proper file type
            if (!allowedInvoiceFileTypes.includes(file.type)) {
                throw new Error("Invalid file type. Only PDF, DOC, DOCX, or TXT allowed.");
            }

            // Check the file size
            if (file.size > maxDocumentUploadSize) {
                throw new Error(`File is too large. Maximum size is ${convertBtyes(maxDocumentUploadSize, "mb")} MB`)
            }

            const buffer = Buffer.from(await file.arrayBuffer());

            await fs.writeFile(documentPath, buffer);

            return eachEntryKey
        })
        )
        const addedInvoiceNames = addedInvoiceNamesPre.filter(eachInvoiceName => eachInvoiceName !== null)

        return NextResponse.json({
            names: addedInvoiceNames,
        });

    } else if (seenUploadType === "images") {
        return NextResponse.json({
            names: [],
        });

    } else throw new Error("invalid upload type selected")
}