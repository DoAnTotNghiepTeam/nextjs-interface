import { storage } from "./firebaseConfig";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  UploadResult,
} from "firebase/storage";

export interface UploadProgress {
  bytesTransferred: number;
  totalBytes: number;
  percentage: number;
}

export class FirebaseStorageService {
  /**
   * Upload PDF file to Firebase Storage
   * @param file - PDF file to upload
   * @param path - Storage path (e.g., 'resumes/userId/resumeId.pdf')
   * @param onProgress - Optional progress callback
   * @returns Promise with download URL
   */
  static async uploadPDF(
    fileOrBlob: File | Blob,
    path: string,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<string> {
    try {
      // Validate type
      const type = (fileOrBlob as File).type || "application/pdf";
      if (type !== "application/pdf") {
        throw new Error("Chỉ chấp nhận file PDF");
      }

      // Validate size (max 10MB)
      const size = (fileOrBlob as File).size ?? fileOrBlob.size;
      const maxSize = 30 * 1024 * 1024; // 30MB
      if (size > maxSize) {
        throw new Error("File quá lớn. Kích thước tối đa là 30MB");
      }

      // Log thông tin file
      console.log("[FirebaseStorageService] Upload PDF:", { path, type, size });
      if (size === 0) {
        console.warn("[FirebaseStorageService] File PDF rỗng!");
      }

      // Create storage reference
      const storageRef = ref(storage, path);

      // Upload file or blob
      const uploadTask = uploadBytes(storageRef, fileOrBlob);

      // Get upload snapshot
      const snapshot = await uploadTask;
      console.log("[FirebaseStorageService] Upload snapshot:", snapshot);
      if (!snapshot || !snapshot.ref) {
        throw new Error("Upload không thành công, không có snapshot.ref");
      }

      // Get download URL
      const downloadURL = await getDownloadURL(snapshot.ref);
      console.log("[FirebaseStorageService] Download URL:", downloadURL);

      return downloadURL;
    } catch (error) {
      console.error("Error uploading PDF:", error);
      throw error;
    }
  }

  /**
   * Delete PDF file from Firebase Storage
   * @param path - Storage path of the file to delete
   */
  static async deletePDF(path: string): Promise<void> {
    try {
      const storageRef = ref(storage, path);
      await deleteObject(storageRef);
    } catch (error) {
      console.error("Error deleting PDF:", error);
      throw error;
    }
  }

  /**
   * Get download URL for a file
   * @param path - Storage path
   * @returns Promise with download URL
   */
  static async getDownloadURL(path: string): Promise<string> {
    try {
      const storageRef = ref(storage, path);
      return await getDownloadURL(storageRef);
    } catch (error) {
      console.error("Error getting download URL:", error);
      throw error;
    }
  }

  /**
   * Generate unique file path for resume PDF
   * @param userId - User ID
   * @param resumeId - Resume ID (optional)
   * @returns Generated path
   */
  static generateResumePath(userId: string, resumeId?: string): string {
    const timestamp = Date.now();
    const fileName = resumeId
      ? `resume_${resumeId}_${timestamp}.pdf`
      : `resume_${timestamp}.pdf`;
    return `resumes/${userId}/${fileName}`;
  }

  /**
   * Extract file path from Firebase Storage URL
   * @param url - Firebase Storage URL
   * @returns File path or null if invalid
   */
  static extractPathFromURL(url: string): string | null {
    try {
      const urlObj = new URL(url);
      const pathMatch = urlObj.pathname.match(/\/o\/(.+)\?/);
      return pathMatch ? decodeURIComponent(pathMatch[1]) : null;
    } catch {
      return null;
    }
  }
}

export default FirebaseStorageService;
