import path from "path";
import { uploadedInvoicesDirectory } from "@/types/uploadTypes";
import { downloadFile } from "@/utility/manageFiles";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  //get src
  const src = searchParams.get("src");
  if (!src) throw new Error("src not sent");

  const filePath = path.join(uploadedInvoicesDirectory, src);

  return downloadFile(filePath)
}