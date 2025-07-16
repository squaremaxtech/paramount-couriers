import path from "path";
import fs from "fs/promises";
import { v4 as uuidV4 } from "uuid"
import { NextResponse } from "next/server";
import { ensureDirectoryExists } from "@/utility/manageFiles";
import { allowedInvoiceFileTypes, maxDocumentUploadSize, userUploadedInvoicesDirectory } from "@/types/uploadTypes";
import { convertBtyes } from "@/useful/usefulFunctions";
import { sessionCheck } from "@/serverFunctions/handleAuth";

export async function POST(request: Request) {
    await sessionCheck()

    const formData = await request.formData();
    const body = Object.fromEntries(formData);

    const bodyEntries = Object.entries(body)

    //ensure it exists
    await ensureDirectoryExists(userUploadedInvoicesDirectory)

    const addedInvoiceNames = await Promise.all(bodyEntries.map(async eachEntry => {
        const eachEntryValueFile = eachEntry[1]

        const file = eachEntryValueFile as File;
        const id = uuidV4()
        const documentType = file.type.split('/')[1]
        const fileName = `${id}.${documentType}`
        const documentPath = path.join(userUploadedInvoicesDirectory, fileName)

        // Check if file is an image (this will be redundant because of the 'accept' attribute, but can be good for double-checking)

        if (!allowedInvoiceFileTypes.includes(file.type)) {
            throw new Error("Invalid file type. Only PDF, DOC, DOCX, or TXT allowed.");
        }

        // Check the file size
        if (file.size > maxDocumentUploadSize) {
            throw new Error(`File is too large. Maximum size is ${convertBtyes(maxDocumentUploadSize, "mb")} MB`)
        }

        const buffer = Buffer.from(await file.arrayBuffer());

        await fs.writeFile(documentPath, buffer);

        return fileName
    })
    )

    return NextResponse.json({
        names: addedInvoiceNames,
    });
}