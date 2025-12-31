import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebaseConfig";

/**
 * Initialize a chat conversation between applicant and employer
 * This creates the chat document in Firestore so it appears in the chat list
 */
export async function initializeChatConversation(
  employerId: string,
  applicantId: string,
  employerName?: string,
  applicantName?: string
): Promise<void> {
  const chatId = `${employerId}_${applicantId}`;
  
  try {
    await setDoc(
      doc(db, "chats", chatId),
      {
        employerId,
        applicantId,
        employerName: employerName || "Nhà tuyển dụng",
        applicantName: applicantName || String(applicantId),
        lastMessage: "",
        lastTimestamp: serverTimestamp(),
        unreadForApplicant: false,
        unreadForEmployer: false,
      },
      { merge: true } // Only update if doesn't exist, preserve existing data
    );
  } catch (error) {
    console.error("Error initializing chat conversation:", error);
    throw error;
  }
}
