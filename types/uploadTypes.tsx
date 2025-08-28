export const maxDocumentUploadSize = 5 * 1024 * 1024; // 5 MB limit
export const maxBodyToServerSize = 100 * 1024 * 1024  //100 MB limit

export const allowedImageFileTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/bmp', 'image/svg+xml', 'image/tiff'];
export const imageFileInputAccept = '.jpg,.jpeg,.png,.webp,.bmp,.svg,.tiff'

export const allowedInvoiceFileTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain', ...allowedImageFileTypes];
export const invoiceFileInputAccept = `.pdf,.doc,.docx,.txt,${imageFileInputAccept}` //plus everything in images