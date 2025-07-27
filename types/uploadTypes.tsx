import path from "path";

export const maxDocumentUploadSize = 5 * 1024 * 1024; // 5 MB limit
export const maxBodyToServerSize = 100 * 1024 * 1024  //100 MB limit
// export const uploadedUserImagesStarterUrl = `https://squaremaxtech.com/api/userImages/view?imageName=`

export const uploadedInvoicesDirectory = path.join(process.cwd(), "uploadedFiles", "invoices")
export const allowedInvoiceFileTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
export const invoiceFileInputAccept = '.pdf,.doc,.docx,.txt'

export const uploadedImagesDirectory = path.join(process.cwd(), "uploadedFiles", "images")
export const allowedImageFileTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/bmp', 'image/svg+xml', 'image/tiff'];
export const imageFileInputAccept = '.jpg,.jpeg,.png,.webp,.bmp,.svg,.tiff'
