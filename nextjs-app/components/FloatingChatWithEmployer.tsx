import React, { useImperativeHandle, useState, forwardRef, useEffect, useRef } from "react";
import { collection, query, orderBy, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebaseConfig";
import ChatWithEmployer from "./ChatWithEmployer";

interface FloatingChatWithEmployerProps {
  employerId: string;
  applicantId: string;
  applicantName?: string;
  /** optional employer display name to show in header */
  employerName?: string;
  /** vertical offset from bottom in px to avoid overlapping other UI (e.g. back-to-top button) */
  bottomOffset?: number;
  /** optional callback when chat is closed (collapsed to bubble) */
  onClose?: () => void;
}

export interface FloatingChatHandle {
  open: () => void;
  close: () => void;
  toggle: () => void;
}

const FloatingChatWithEmployer = forwardRef<FloatingChatHandle, FloatingChatWithEmployerProps>(
  ({ employerId, applicantId, applicantName, employerName, bottomOffset = 100, onClose }, ref) => {
    const [showChat, setShowChat] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    // Initialize to a very old date so all existing messages are counted as unread initially
    const lastReadTimestampRef = useRef<Date>(new Date(0));

    const chatId = `${employerId}_${applicantId}`;

    // Listen for new messages to update unread count
    useEffect(() => {
      console.log("🔔 Setting up message listener. chatId:", chatId, "showChat:", showChat);
      const q = query(
        collection(db, "chats", chatId, "messages"),
        orderBy("timestamp", "asc")
      );
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        console.log("📬 Snapshot received. Size:", snapshot.docs.length, "showChat:", showChat);
        
        if (showChat) {
          // When chat is open, don't count but update lastReadTimestamp to latest message
          // With ASC order, latest message is at the end
          const latestMessage = snapshot.docs[snapshot.docs.length - 1]?.data();
          if (latestMessage?.timestamp) {
            lastReadTimestampRef.current = latestMessage.timestamp.toDate();
            console.log("✅ Updated lastReadTimestamp:", lastReadTimestampRef.current);
          }
          setUnreadCount(0);
          return;
        }
        
        // When chat is closed, count unread messages from employer only
        let count = 0;
        console.log("🔍 Counting unread. employerId:", employerId, "applicantId:", applicantId, "lastRead:", lastReadTimestampRef.current);
        snapshot.docs.forEach((docSnap) => {
          const data = docSnap.data();
          console.log("  📨 Message from:", data.senderId, "at", data.timestamp?.toDate());
          // Count ONLY messages from employer (not from applicant) that are newer than last read
          if (data.senderId === employerId && data.timestamp) {
            const msgDate = data.timestamp.toDate();
            if (msgDate > lastReadTimestampRef.current) {
              count++;
              console.log("    ✓ Unread from employer!");
            }
          } else if (data.senderId === applicantId) {
            console.log("    ℹ️ Message from me (applicant) - not counted");
          }
        });
        console.log("📊 Total unread from employer:", count);
        setUnreadCount(count);
      });

      return () => {
        console.log("🔌 Cleaning up message listener");
        unsubscribe();
      };
    }, [chatId, employerId, showChat]);

    useImperativeHandle(ref, () => ({
      open: () => {
        setShowChat(true);
        // Mark as read in Firestore
        updateDoc(doc(db, "chats", chatId), { unreadForApplicant: false }).catch(() => {});
      },
      close: () => {
        setShowChat(false);
      },
      toggle: () => setShowChat((s) => !s),
    }));

    const handleClose = () => {
      setShowChat(false);
      if (onClose) onClose();
    };

    const handleOpen = () => {
      setShowChat(true);
      // Mark as read in Firestore
      updateDoc(doc(db, "chats", chatId), { unreadForApplicant: false }).catch(() => {});
    };

    return (
      <>
        {!showChat && (
          <button
            onClick={handleOpen}
            style={{
              position: "fixed",
              bottom: bottomOffset,
              right: 32,
              zIndex: 1000,
              borderRadius: "50%",
              width: 64,
              height: 64,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "#fff",
              fontWeight: "bold",
              fontSize: 28,
              boxShadow: "0 8px 24px rgba(102, 126, 234, 0.4), 0 4px 8px rgba(0, 0, 0, 0.1)",
              border: "none",
              cursor: "pointer",
              transition: "all 0.3s ease",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.1) rotate(5deg)";
              e.currentTarget.style.boxShadow = "0 12px 32px rgba(102, 126, 234, 0.6), 0 6px 12px rgba(0, 0, 0, 0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1) rotate(0deg)";
              e.currentTarget.style.boxShadow = "0 8px 24px rgba(102, 126, 234, 0.4), 0 4px 8px rgba(0, 0, 0, 0.1)";
            }}
            title="Liên hệ nhà tuyển dụng"
          >
            💬
            {unreadCount > 0 && (
              <span style={{
                position: "absolute",
                top: -4,
                right: -4,
                background: "#ff4444",
                color: "#fff",
                borderRadius: "50%",
                width: 24,
                height: 24,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
                fontWeight: "bold",
                boxShadow: "0 2px 8px rgba(255, 68, 68, 0.5)",
                border: "2px solid #fff",
                animation: "pulse 2s infinite"
              }}>
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>
        )}
        {showChat && (
          <div
            style={{
              position: "fixed",
              bottom: bottomOffset,
              right: 32,
              zIndex: 1001,
              background: "#fff",
              borderRadius: 16,
              boxShadow: "0 12px 40px rgba(0, 0, 0, 0.15), 0 4px 12px rgba(0, 0, 0, 0.1)",
              width: 380,
              maxWidth: "90vw",
              padding: 0,
              overflow: "hidden",
              border: "1px solid rgba(0, 0, 0, 0.08)"
            }}
          >
            <div style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center", 
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", 
              color: "#fff", 
              padding: "16px 20px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "20px" }}>💬</span>
                <span style={{ fontWeight: "600", fontSize: "16px" }}>
                  {employerName ? `Chat với ${employerName}` : "Chat với nhà tuyển dụng"}
                </span>
              </div>
              <button
                onClick={handleClose}
                style={{ 
                  background: "rgba(255, 255, 255, 0.2)", 
                  border: "none", 
                  color: "#fff", 
                  fontSize: 24, 
                  cursor: "pointer",
                  borderRadius: "50%",
                  width: 32,
                  height: 32,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s ease",
                  lineHeight: "1"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.3)";
                  e.currentTarget.style.transform = "rotate(90deg)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)";
                  e.currentTarget.style.transform = "rotate(0deg)";
                }}
                title="Đóng chat"
              >
                ×
              </button>
            </div>
            <div style={{ padding: 16, background: "#f8f9fa" }}>
              <ChatWithEmployer
                employerId={employerId}
                applicantId={applicantId}
                applicantName={applicantName}
                embedded={true}
              />
            </div>
          </div>
        )}
      </>
    );
  }
);

FloatingChatWithEmployer.displayName = "FloatingChatWithEmployer";

export default FloatingChatWithEmployer;

// Add CSS animation for pulse effect
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes pulse {
      0%, 100% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.1);
      }
    }
  `;
  if (!document.querySelector('style[data-chat-animation]')) {
    style.setAttribute('data-chat-animation', 'true');
    document.head.appendChild(style);
  }
}