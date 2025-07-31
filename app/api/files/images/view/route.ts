import path from "path";
import fs from "fs/promises";
import { uploadedImagesDirectory } from "@/types/uploadTypes";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);

    //get src
    const src = searchParams.get("src");
    if (!src) throw new Error("src not sent");

    const imagePath = path.join(uploadedImagesDirectory, src)

    // Read the image file
    const imageBuffer = await fs.readFile(imagePath);

    // Set the appropriate Content-Type header based on file extension
    const ext = path.extname(imagePath).toLowerCase();
    let contentType = 'application/octet-stream'; // Default content type

    if (ext === '.jpg' || ext === '.jpeg') {
        contentType = 'image/jpeg';
    } else if (ext === '.png') {
        contentType = 'image/png';
    } else if (ext === '.gif') {
        contentType = 'image/gif';
    }

    // Return the image file in the response
    return new Response(imageBuffer, {
        status: 200,
        headers: {
            'Content-Type': contentType,
            'Content-Length': imageBuffer.length.toString(),
        },
    });
}