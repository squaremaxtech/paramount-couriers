import path from "path";
import { uploadedImagesDirectory } from "@/types/uploadTypes";
import { downloadFile } from "@/utility/manageFiles";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);

    //get src
    const src = searchParams.get("src");
    if (!src) throw new Error("src not sent");

    const imagePath = path.join(uploadedImagesDirectory, src)

    return downloadFile(imagePath)
}