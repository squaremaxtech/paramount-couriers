import path from "path";
import { uploadedImagesDirectory, uploadedInvoicesDirectory } from "@/types/uploadTypes";
import { downloadFile } from "@/utility/manageFiles";
import { dbFileTypeSchema } from "@/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  //get src
  const src = searchParams.get("src");
  if (src === null) throw new Error("src not sent");

  const dbFileType = searchParams.get("dbFileType");
  if (dbFileType === null) throw new Error("dbFileType not sent");

  const validatedDbFileType = dbFileTypeSchema.parse(dbFileType)

  const seenBase = validatedDbFileType === "image" ? uploadedImagesDirectory : validatedDbFileType === "invoice" ? uploadedInvoicesDirectory : null
  if (seenBase === null) throw new Error("dbFileType not supported")

  const filePath = path.join(seenBase, src);

  return downloadFile(filePath)
}