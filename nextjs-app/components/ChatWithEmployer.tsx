import React, { useState, useEffect, useRef } from "react";
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, doc, setDoc, type Timestamp } from "firebase/firestore";
import { db } from "../lib/firebaseConfig";

interface ChatWithEmployerProps {
  employerId: string;
  applicantId: string;
  applicantName?: string;
  employerName?: string;
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
  employerName?: string;
};

const ChatWithEmployer: React.FC<ChatWithEmployerProps> = ({ employerId, applicantId, applicantName, employerName, embedded }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [showChat, setShowChat] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // if embedded, open immediately (Floating wrapper controls visibility)
  useEffect(() => {
    if (embedded) setShowChat(true);
  }, [embedded]);

  // Tạo chatId duy nhất giữa employer và applicant
  const chatId = `${employerId}_${applicantId}`;

  useEffect(() => {
    // Load messages when embedded or when chat is opened
    if (!embedded && !showChat) return;
    
    console.log("Loading messages for chatId:", chatId);
    const q = query(
      collection(db, "chats", chatId, "messages"),
      orderBy("timestamp", "asc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      console.log("📨 Messages snapshot received! Size:", snapshot.docs.length);
      const list: Message[] = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          senderId: data.senderId,
          text: data.text,
          timestamp: data.timestamp,
        };
      });
      console.log("📝 Updating messages state with:", list.length, "messages");
      setMessages(list);
    }, (error) => {
      console.error("Error loading messages:", error);
    });
    
    console.log("✅ Message listener setup complete");
    return () => {
      console.log("🔌 Cleaning up message listener");
      unsubscribe();
    };
  }, [chatId, showChat, embedded]);

  const sendMessage = async () => {
    console.log("🚀 sendMessage called! input:", input, "length:", input.length, "trimmed:", input.trim().length);
    
    if (!input.trim()) {
      console.log("⚠️ Empty message, skipping send");
      return;
    }
    
    // IMPORTANT: Convert applicantId to string for consistency across Firestore
    const applicantIdStr = String(applicantId);
    
    console.log("📤 Sending message. Input:", input.substring(0, 30), "chatId:", chatId);
    
    try {
      // Tạo document chat nếu chưa có
      await addDoc(collection(db, "chats", chatId, "messages"), {
        senderId: applicantIdStr,
        text: input,
        timestamp: serverTimestamp(),
      });
      console.log("✅ Message added to subcollection");
      
      // Tạo/ghi document chat chính với id = chatId (để employer thấy ứng viên ở sidebar)
      const summaryPayload: ChatSummary = {
        employerId,
        applicantId: applicantIdStr,  // Convert to string
        lastMessage: input,
        lastTimestamp: serverTimestamp(),
      };
      
      // Use the logged-in applicant's id as the applicantName so admin immediately sees an identifier.
      summaryPayload.applicantName = applicantName || applicantIdStr;
      if (employerName) {
        summaryPayload.employerName = employerName;
      }
      
      console.log("💾 Updating chat summary:", { 
        chatId, 
        lastMessage: input.substring(0, 30), 
        applicantId: applicantIdStr,
        employerId,
        employerName 
      });
      
      // mark unread for employer when applicant sends a message so employer UI can highlight it
      await setDoc(doc(db, "chats", chatId), { 
        ...summaryPayload, 
        unreadForEmployer: true,
        unreadForApplicant: false  // Mark as read for applicant since they just sent it
      }, { merge: true });
      
      console.log("✅ Message sent and chat summary updated!");
      setInput("");
    } catch (error) {
      console.error("❌ Error sending message:", error);
    }
  };

  return (
    <div>
      {!embedded && (
        <button 
          onClick={() => setShowChat(true)} 
          style={{ 
            margin: "16px 0", 
            padding: "12px 24px",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            fontSize: "15px",
            fontWeight: "600",
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)",
            transition: "all 0.3s ease"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 6px 20px rgba(102, 126, 234, 0.4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 4px 12px rgba(102, 126, 234, 0.3)";
          }}
        >
          💬 Liên hệ ngay với nhà tuyển dụng
        </button>
      )}
      {showChat && (
        <div style={{ 
          border: embedded ? "none" : "1px solid rgba(0, 0, 0, 0.08)", 
          borderRadius: embedded ? 0 : 12, 
          padding: 0, 
          background: embedded ? "transparent" : "#fff", 
          maxWidth: embedded ? "100%" : 400,
          boxShadow: embedded ? "none" : "0 4px 16px rgba(0, 0, 0, 0.1)",
          overflow: "hidden"
        }}>
          {!embedded && (
            <div style={{ 
              marginBottom: 0, 
              fontWeight: "600",
              fontSize: "16px",
              padding: "16px 20px",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}>
              <span>💬</span>
              <span>Chat với nhà tuyển dụng</span>
            </div>
          )}
          <div style={{ 
            maxHeight: 320, 
            overflowY: "auto", 
            padding: "16px",
            background: "#f8f9fa",
            minHeight: "200px"
          }}>
            {messages.length === 0 && (
              <div style={{ 
                textAlign: "center", 
                color: "#999", 
                padding: "40px 20px",
                fontSize: "14px"
              }}>
                <div style={{ fontSize: "48px", marginBottom: "12px" }}>💬</div>
                <div>Chưa có tin nhắn nào</div>
              </div>
            )}
            {messages.map(msg => {
              // Convert both to string for consistent comparison
              const isMyMessage = String(msg.senderId) === String(applicantId);
              console.log("💬 Message:", msg.text.substring(0, 20), "senderId:", msg.senderId, "(type:", typeof msg.senderId, ") vs applicantId:", applicantId, "(type:", typeof applicantId, ") => isMyMessage:", isMyMessage);
              
              return (
                <div key={msg.id} style={{ 
                  textAlign: isMyMessage ? "right" : "left", 
                  margin: "8px 0",
                  display: "flex",
                  justifyContent: isMyMessage ? "flex-end" : "flex-start"
                }}>
                  <span style={{ 
                    background: isMyMessage
                      ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" 
                      : "#fff", 
                    color: isMyMessage ? "#fff" : "#333",
                    padding: "10px 16px", 
                    borderRadius: isMyMessage ? "18px 18px 4px 18px" : "18px 18px 18px 4px", 
                    display: "inline-block",
                    maxWidth: "75%",
                    wordWrap: "break-word",
                    boxShadow: isMyMessage
                      ? "0 2px 8px rgba(102, 126, 234, 0.25)" 
                      : "0 2px 8px rgba(0, 0, 0, 0.08)",
                    fontSize: "14px",
                    lineHeight: "1.4"
                  }}>
                    {msg.text}
                  </span>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
          <div style={{ 
            display: "flex", 
            padding: "16px",
            background: "#fff",
            borderTop: "1px solid rgba(0, 0, 0, 0.08)",
            gap: "8px"
          }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && sendMessage()}
              style={{ 
                flex: 1, 
                padding: "10px 16px", 
                borderRadius: 24, 
                border: "1px solid #e0e0e0",
                fontSize: "14px",
                outline: "none",
                transition: "all 0.2s ease"
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = "#667eea"}
              onBlur={(e) => e.currentTarget.style.borderColor = "#e0e0e0"}
              placeholder="Nhập tin nhắn..."
            />
            <button 
              onClick={sendMessage} 
              style={{ 
                padding: "10px 20px",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "#fff",
                border: "none",
                borderRadius: 24,
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(102, 126, 234, 0.3)",
                transition: "all 0.2s ease",
                minWidth: "70px"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(102, 126, 234, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(102, 126, 234, 0.3)";
              }}
            >
              Gửi 📤
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWithEmployer;