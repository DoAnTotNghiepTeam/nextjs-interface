import FirebaseStorageService from "../lib/firebase-storage";

// Hàm upload PDF và trả về link download
export async function handleUploadPDF(
  filePdf: File | Blob,
  userId: string,
  resumeId?: string
) {
  const path = FirebaseStorageService.generateResumePath(userId, resumeId);
  const pdfUrl = await FirebaseStorageService.uploadPDF(filePdf, path);
  // pdfUrl là link tải file PDF trên Firebase Storage
  // Gọi API lưu pdfUrl vào DB nếu cần
  return pdfUrl;
}
