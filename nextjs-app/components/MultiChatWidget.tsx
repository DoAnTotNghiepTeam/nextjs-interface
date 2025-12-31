import React, { useState, useEffect } from "react";
import { collection, query, where, onSnapshot, orderBy, limit, type Timestamp } from "firebase/firestore";
import { db } from "../lib/firebaseConfig";
import ChatWithEmployer from "./ChatWithEmployer";

interface MultiChatWidgetProps {
  applicantId: string | number;
  applicantName?: string;
  bottomOffset?: number;
}

interface ChatContact {
  employerId: string;
  employerName?: string;
  lastMessage: string;
  lastTimestamp: Timestamp | null;
  unreadForApplicant?: boolean;
}

const MultiChatWidget: React.FC<MultiChatWidgetProps> = ({ 
  applicantId, 
  applicantName, 
  bottomOffset = 100 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showChatList, setShowChatList] = useState(true);
  const [selectedEmployerId, setSelectedEmployerId] = useState<string | null>(null);
  const [selectedEmployerName, setSelectedEmployerName] = useState<string>("");
  const [chatContacts, setChatContacts] = useState<ChatContact[]>([]);
  const [totalUnread, setTotalUnread] = useState(0);

  // Load list of chat contacts
  useEffect(() => {
    console.log("🔄 [MultiChatWidget] Loading chats for applicantId:", applicantId, "(type:", typeof applicantId, ")");
    
    // Try BOTH string and number versions to find existing chats
    // (old chats might have number, new chats have string)
    const applicantIdStr = String(applicantId);
    const applicantIdNum = typeof applicantId === 'string' ? parseInt(applicantId, 10) : applicantId;
    
    const q1 = query(
      collection(db, "chats"),
      where("applicantId", "==", applicantIdStr)
    );
    
    const q2 = query(
      collection(db, "chats"),
      where("applicantId", "==", applicantIdNum)
    );

    // Combine results from both queries
    const allContacts = new Map<string, ChatContact>();
    let activeListeners = 2;
    
    const processSnapshot = (snapshot: any, queryType: string) => {
      console.log(`📂 [MultiChatWidget] Query with ${queryType} - Chat documents found:`, snapshot.docs.length);
      
      snapshot.docs.forEach((doc: any) => {
        const data = doc.data();
        const employerId = data.employerId;
        
        console.log(`📋 [MultiChatWidget] Processing chat doc:`, {
          docId: doc.id,
          employerId,
          lastMessage: data.lastMessage?.substring(0, 30) || '(empty)',
          lastTimestamp: data.lastTimestamp?.toDate() || '(undefined)',
          unread: data.unreadForApplicant
        });
        
        const contact: ChatContact = {
          employerId: data.employerId,
          employerName: data.employerName || "Nhà tuyển dụng",
          lastMessage: data.lastMessage || "",  // Empty string if undefined
          lastTimestamp: data.lastTimestamp || null,  // null if undefined
          unreadForApplicant: data.unreadForApplicant || false,
        };
        
        // ALWAYS update contact data (even if already exists) to get latest message
        console.log(`➕ [MultiChatWidget] ${allContacts.has(employerId) ? 'Updating' : 'Adding'} contact:`, {
          employerId,
          lastMessage: contact.lastMessage?.substring(0, 20)
        });
        allContacts.set(employerId, contact);
      });
      
      updateContactsList();
    };
    
    const updateContactsList = () => {
      const contacts = Array.from(allContacts.values())
        .sort((a, b) => {
          if (!a.lastTimestamp) return 1;
          if (!b.lastTimestamp) return -1;
          return b.lastTimestamp.toMillis() - a.lastTimestamp.toMillis();
        });
      
      console.log("✅ [MultiChatWidget] Total unique contacts:", contacts.length);
      setChatContacts(contacts);
      
      const unreadCount = contacts.filter(c => c.unreadForApplicant).length;
      console.log("🔔 [MultiChatWidget] Total unread count:", unreadCount);
      setTotalUnread(unreadCount);
    };

    const unsubscribe1 = onSnapshot(q1, (snapshot) => {
      processSnapshot(snapshot, 'string');
    }, (error) => {
      console.error("❌ [MultiChatWidget] Error with string query:", error);
      activeListeners--;
      if (activeListeners === 0) updateContactsList();
    });
    
    const unsubscribe2 = onSnapshot(q2, (snapshot) => {
      processSnapshot(snapshot, 'number');
    }, (error) => {
      console.error("❌ [MultiChatWidget] Error with number query:", error);
      activeListeners--;
      if (activeListeners === 0) updateContactsList();
    });

    return () => {
      console.log("🔌 [MultiChatWidget] Cleaning up chat contacts listeners");
      unsubscribe1();
      unsubscribe2();
    };
  }, [applicantId]);

  const handleSelectContact = (employerId: string, employerName: string) => {
    setSelectedEmployerId(employerId);
    setSelectedEmployerName(employerName);
    setShowChatList(false);
  };

  const handleBackToList = () => {
    setShowChatList(true);
    setSelectedEmployerId(null);
  };

  const formatTime = (timestamp: Timestamp | null) => {
    if (!timestamp) return "Chưa có tin nhắn";
    const date = timestamp.toDate();
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Vừa xong";
    if (minutes < 60) return `${minutes} phút`;
    if (hours < 24) return `${hours} giờ`;
    if (days < 7) return `${days} ngày`;
    return date.toLocaleDateString("vi-VN");
  };

  return (
    <>
      {/* Chat Bubble Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
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
          title="Tin nhắn"
        >
          💬
          {totalUnread > 0 && (
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
              {totalUnread > 9 ? "9+" : totalUnread}
            </span>
          )}
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
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
            height: 500,
            maxHeight: "80vh",
            padding: 0,
            overflow: "hidden",
            border: "1px solid rgba(0, 0, 0, 0.08)",
            display: "flex",
            flexDirection: "column"
          }}
        >
          {/* Header */}
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
              {!showChatList && (
                <button
                  onClick={handleBackToList}
                  style={{
                    background: "rgba(255, 255, 255, 0.2)",
                    border: "none",
                    color: "#fff",
                    fontSize: 20,
                    cursor: "pointer",
                    borderRadius: "50%",
                    width: 28,
                    height: 28,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: "4px",
                    transition: "all 0.2s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)";
                  }}
                  title="Quay lại"
                >
                  ←
                </button>
              )}
              <span style={{ fontSize: "20px" }}>💬</span>
              <span style={{ fontWeight: "600", fontSize: "16px" }}>
                {showChatList ? "Tin nhắn" : selectedEmployerName}
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
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
              title="Đóng"
            >
              ×
            </button>
          </div>

          {/* Content */}
          <div style={{ flex: 1, overflow: "hidden", background: "#f8f9fa" }}>
            {showChatList ? (
              // Chat List
              <div style={{ height: "100%", overflowY: "auto" }}>
                {chatContacts.length === 0 ? (
                  <div style={{ 
                    padding: "40px 20px", 
                    textAlign: "center", 
                    color: "#999" 
                  }}>
                    <div style={{ fontSize: "48px", marginBottom: "16px" }}>💬</div>
                    <div>Chưa có tin nhắn nào</div>
                  </div>
                ) : (
                  chatContacts.map((contact) => {
                    console.log("🎨 [MultiChatWidget] Rendering contact:", {
                      employerId: contact.employerId,
                      employerName: contact.employerName,
                      lastMessage: contact.lastMessage,
                      lastTimestamp: contact.lastTimestamp,
                      formattedTime: formatTime(contact.lastTimestamp),
                      unread: contact.unreadForApplicant
                    });
                    
                    return (
                      <div
                        key={contact.employerId}
                        onClick={() => handleSelectContact(contact.employerId, contact.employerName || "Nhà tuyển dụng")}
                        style={{
                          padding: "16px 20px",
                          borderBottom: "1px solid #e0e0e0",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                          background: contact.unreadForApplicant ? "#f0f4ff" : "#fff",
                          position: "relative"
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "#f5f5f5";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = contact.unreadForApplicant ? "#f0f4ff" : "#fff";
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                          <div style={{ 
                            fontWeight: contact.unreadForApplicant ? "700" : "600", 
                            fontSize: "15px",
                            color: "#333"
                          }}>
                            {contact.employerName}
                          </div>
                          <div style={{ fontSize: "12px", color: "#999" }}>
                            {formatTime(contact.lastTimestamp)}
                          </div>
                        </div>
                        <div style={{ 
                          fontSize: "14px", 
                          color: contact.unreadForApplicant ? "#667eea" : "#666",
                          fontWeight: contact.unreadForApplicant ? "600" : "400",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap"
                        }}>
                          {contact.lastMessage || "Chưa có tin nhắn"}
                        </div>
                        {contact.unreadForApplicant && (
                          <div style={{
                            position: "absolute",
                            right: 20,
                            top: "50%",
                            transform: "translateY(-50%)",
                            width: 10,
                            height: 10,
                            borderRadius: "50%",
                            background: "#667eea"
                          }} />
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            ) : (
              // Chat Content
              <div style={{ height: "100%" }}>
                {selectedEmployerId && (
                  <ChatWithEmployer
                    employerId={selectedEmployerId}
                    applicantId={applicantId}
                    applicantName={applicantName}
                    employerName={selectedEmployerName}
                    embedded={true}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
      `}</style>
    </>
  );
};

export default MultiChatWidget;
