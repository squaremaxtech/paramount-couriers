import path from "path";
import { downloadFile } from "@/utility/manageFiles";
import { dbFileSchema } from "@/types";
import { imagesDirName, invoicesDirName, uploadedDataDir } from "@/lib/dirPaths";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  //get src
  const src = searchParams.get("src");
  if (src === null) throw new Error("src not sent");

  const dbFileType = searchParams.get("dbFileType");
  if (dbFileType === null) throw new Error("dbFileType not sent");

  const validatedDbFileType = dbFileSchema.shape.type.parse(dbFileType)

  const chosenFileDir = validatedDbFileType === "invoice" ? invoicesDirName : validatedDbFileType === "image" ? imagesDirName : null
  if (chosenFileDir === null) throw new Error("chosenFileDir null")

  const mainDirectory = path.join(uploadedDataDir, chosenFileDir)

  const filePath = path.join(mainDirectory, src);

  return downloadFile(filePath)
}