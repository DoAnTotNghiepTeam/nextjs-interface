import React, { useState, useEffect } from "react";
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, doc, setDoc, type Timestamp } from "firebase/firestore";
import { db } from "../lib/firebaseConfig";

interface ChatWithEmployerProps {
  employerId: string;
  applicantId: string;
  applicantName?: string;
  /** when true, the component is embedded inside a floating wrapper and should not render its own open button */
  embedded?: boolean;
}

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp?: Timestamp | null;
}

type ChatSummary = {
  employerId: string;
  applicantId: string;
  lastMessage: string;
  lastTimestamp: Timestamp | unknown;
  applicantName?: string;
};

const ChatWithEmployer: React.FC<ChatWithEmployerProps> = ({ employerId, applicantId, applicantName, embedded }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [showChat, setShowChat] = useState(false);

  // if embedded, open immediately (Floating wrapper controls visibility)
  useEffect(() => {
    if (embedded) setShowChat(true);
  }, [embedded]);

  // Tạo chatId duy nhất giữa employer và applicant
  const chatId = `${employerId}_${applicantId}`;

  useEffect(() => {
    if (!showChat) return;
    const q = query(
      collection(db, "chats", chatId, "messages"),
      orderBy("timestamp")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list: Message[] = snapshot.docs.map(doc => ({
        id: doc.id,
        senderId: doc.data().senderId,
        text: doc.data().text,
        timestamp: doc.data().timestamp,
      }));
      setMessages(list);
    });
    return () => unsubscribe();
  }, [chatId, showChat]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    // Tạo document chat nếu chưa có
    await addDoc(collection(db, "chats", chatId, "messages"), {
      senderId: applicantId,
      text: input,
      timestamp: serverTimestamp(),
    });
    // Tạo/ghi document chat chính với id = chatId (để employer thấy ứng viên ở sidebar)
    // Only include applicantName when we actually have one (avoid writing placeholder defaults)
    const summaryPayload: ChatSummary = {
      employerId,
      applicantId,
      lastMessage: input,
      lastTimestamp: serverTimestamp(),
    };
  // Use the logged-in applicant's id as the applicantName so admin immediately sees an identifier.
  // applicantId is passed from the session (session.user.id) when the chat is created.
  summaryPayload.applicantName = applicantName || String(applicantId);
    // mark unread for employer when applicant sends a message so employer UI can highlight it
    await setDoc(doc(db, "chats", chatId), { ...summaryPayload, unreadForEmployer: true }, { merge: true });
    setInput("");
  };

  return (
    <div>
      {!embedded && (
        <button onClick={() => setShowChat(true)} style={{ margin: "16px 0", padding: "8px 16px" }}>
          Liên hệ ngay với nhà tuyển dụng
        </button>
      )}
      {showChat && (
        <div style={{ border: "1px solid #eee", borderRadius: 8, padding: 16, background: "#fff", maxWidth: 400 }}>
          <div style={{ marginBottom: 8, fontWeight: "bold" }}>
            Chat với nhà tuyển dụng
          </div>
          <div style={{ maxHeight: 200, overflowY: "auto", marginBottom: 8 }}>
            {messages.map(msg => (
              <div key={msg.id} style={{ textAlign: msg.senderId === applicantId ? "right" : "left", margin: "4px 0" }}>
                <span style={{ background: msg.senderId === applicantId ? "#e0f7fa" : "#fff", padding: "6px 12px", borderRadius: 8, display: "inline-block" }}>
                  {msg.text}
                </span>
              </div>
            ))}
          </div>
          <div style={{ display: "flex" }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              style={{ flex: 1, padding: 8, borderRadius: 4, border: "1px solid #ccc" }}
              placeholder="Nhập tin nhắn..."
            />
            <button onClick={sendMessage} style={{ marginLeft: 8, padding: "8px 16px" }}>
              Gửi
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWithEmployer;