import React, { useState, useEffect, useImperativeHandle, forwardRef } from "react";
import { collection, query, where, onSnapshot, orderBy, limit, type Timestamp, doc, updateDoc, setDoc, getDocs } from "firebase/firestore";
import { db } from "../lib/firebaseConfig";
import ChatWithEmployer from "./ChatWithEmployer";

interface MultiChatWidgetProps {
  applicantId: string | number;
  applicantName?: string;
  iconBottomOffset?: number;  // Vị trí icon (mặc định 160)
  popupBottomOffset?: number; // Vị trí popup (mặc định 40, giống chatbot)
  hideIcon?: boolean;         // Ẩn icon khi chatbot mở
}

interface ChatContact {
  employerId: string;
  employerName?: string;
  companyName?: string;
  lastMessage: string;
  lastTimestamp: Timestamp | null;
  unreadForApplicant?: boolean;
}

export interface MultiChatHandle {
  open: () => void;
  openChat: (employerId: string, employerName?: string, companyName?: string) => Promise<void>;
  close: () => void;
}

const MultiChatWidget = forwardRef<MultiChatHandle, MultiChatWidgetProps>(({ 
  applicantId, 
  applicantName, 
  iconBottomOffset = 160,
  popupBottomOffset = 40,
  hideIcon = false
}, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showChatList, setShowChatList] = useState(true);
  const [selectedEmployerId, setSelectedEmployerId] = useState<string | null>(null);
  const [selectedEmployerName, setSelectedEmployerName] = useState<string>("");
  const [selectedCompanyName, setSelectedCompanyName] = useState<string>("");
  const [chatContacts, setChatContacts] = useState<ChatContact[]>([]);
  const [totalUnread, setTotalUnread] = useState(0);

  // Load list of chat contacts
  useEffect(() => {
    console.log("🔄 [MultiChatWidget] Loading chats for applicantId:", applicantId, "(type:", typeof applicantId, ")");
    
    // Try BOTH string and number versions to find existing chats
    // (old chats might have number, new chats have string)
    const applicantIdStr = String(applicantId);
    const applicantIdNum = typeof applicantId === 'string' ? parseInt(applicantId, 10) : applicantId;
    
    console.log("🔍 [MultiChatWidget] Querying with applicantIdStr:", applicantIdStr, "and applicantIdNum:", applicantIdNum);
    
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
    
    const processSnapshot = async (snapshot: any, queryType: string) => {
      console.log(`📂 [MultiChatWidget] Query with ${queryType} - Chat documents found:`, snapshot.docs.length);
      
      const promises = snapshot.docs.map(async (chatDoc: any) => {
        const data = chatDoc.data();
        const employerId = data.employerId;
        
        // Fetch company name from API
        let companyName = data.companyName;
        if (!companyName && employerId) {
          try {
            const apiUrl = `http://localhost:8080/api/employers/${employerId}/company`;
            console.log(`🔍 [MultiChatWidget] Fetching company from:`, apiUrl);
            const response = await fetch(apiUrl);
            console.log(`📡 [MultiChatWidget] API response status:`, response.status);
            if (response.ok) {
              // API trả về plain text, không phải JSON
              const companyText = await response.text();
              console.log(`📦 [MultiChatWidget] Raw company text:`, companyText);
              // Loại bỏ dấu ngoặc kép nếu có
              companyName = companyText.replace(/^"|"$/g, '').trim();
              console.log(`🏢 [MultiChatWidget] Extracted company name for employer ${employerId}:`, companyName);
            } else {
              console.warn(`⚠️ [MultiChatWidget] API returned non-OK status ${response.status} for employer ${employerId}`);
            }
          } catch (error) {
            console.error(`❌ [MultiChatWidget] Failed to fetch company for employer ${employerId}:`, error);
          }
        }
        
        console.log(`📋 [MultiChatWidget] Processing chat doc:`, {
          docId: chatDoc.id,
          employerId,
          employerName: data.employerName,
          companyName: companyName,
          lastMessage: data.lastMessage?.substring(0, 30) || '(empty)',
          lastTimestamp: data.lastTimestamp?.toDate() || '(undefined)',
          unread: data.unreadForApplicant
        });
        
        const contact: ChatContact = {
          employerId: data.employerId,
          employerName: data.employerName || "Nhà tuyển dụng",
          companyName: companyName,
          lastMessage: data.lastMessage || "",  // Empty string if undefined
          lastTimestamp: data.lastTimestamp || null,  // null if undefined
          unreadForApplicant: data.unreadForApplicant || false,
        };
        
        // 🔄 Tự động sync lastMessage nếu thiếu hoặc rỗng
        if ((!data.lastMessage || data.lastMessage.trim() === '') && data.lastTimestamp) {
          console.log(`🔄 [MultiChatWidget] Contact has timestamp but no lastMessage, syncing from subcollection...`, {
            chatId: chatDoc.id,
            employerId
          });
          
          try {
            const chatId = chatDoc.id;
            const messagesQuery = query(
              collection(db, "chats", chatId, "messages"),
              orderBy("timestamp", "desc"),
              limit(1)
            );
            
            const messagesSnapshot = await getDocs(messagesQuery);
            if (!messagesSnapshot.empty) {
              const lastMsg = messagesSnapshot.docs[0].data();
              if (lastMsg.text && lastMsg.timestamp) {
                console.log(`✅ [MultiChatWidget] Found last message in subcollection:`, lastMsg.text.substring(0, 30));
                
                // Cập nhật vào Firestore
                await setDoc(doc(db, "chats", chatId), {
                  lastMessage: lastMsg.text,
                  lastTimestamp: lastMsg.timestamp
                }, { merge: true });
                
                // Cập nhật contact local
                contact.lastMessage = lastMsg.text;
                console.log(`✅ [MultiChatWidget] Synced lastMessage for chat ${chatId}`);
              }
            } else {
              console.log(`⚠️ [MultiChatWidget] No messages found in subcollection for chat ${chatDoc.id}`);
            }
          } catch (error) {
            console.error(`❌ [MultiChatWidget] Failed to sync lastMessage:`, error);
          }
        }
        
        // ALWAYS update contact data (even if already exists) to get latest message
        console.log(`➕ [MultiChatWidget] ${allContacts.has(employerId) ? 'Updating' : 'Adding'} contact:`, {
          employerId,
          companyName: contact.companyName,
          lastMessage: contact.lastMessage?.substring(0, 20)
        });
        allContacts.set(employerId, contact);
      });
      
      await Promise.all(promises);
      updateContactsList();
    };
    
    const updateContactsList = () => {
      const allContactsArray = Array.from(allContacts.values());
      console.log("📊 [MultiChatWidget] All contacts before filter:", allContactsArray.length, allContactsArray.map(c => ({
        employerId: c.employerId,
        hasLastMessage: !!c.lastMessage,
        hasLastTimestamp: !!c.lastTimestamp,
        lastMessage: c.lastMessage?.substring(0, 20),
        companyName: c.companyName
      })));
      
      const contacts = allContactsArray
        // Chỉ loại bỏ những contact thực sự không có lastTimestamp (chưa từng có tin nhắn)
        // Empty string lastMessage vẫn giữ lại vì có thể là tin nhắn trống hoặc chưa sync kịp
        .filter(contact => contact.lastTimestamp)
        .sort((a, b) => {
          if (!a.lastTimestamp) return 1;
          if (!b.lastTimestamp) return -1;
          return b.lastTimestamp.toMillis() - a.lastTimestamp.toMillis();
        });
      
      console.log("✅ [MultiChatWidget] Total unique contacts with messages:", contacts.length);
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

  // Expose methods to parent component via ref
  useImperativeHandle(ref, () => ({
    open: () => {
      setIsOpen(true);
    },
    openChat: async (employerId: string, employerName?: string, companyName?: string) => {
      setSelectedEmployerId(employerId);
      setSelectedEmployerName(employerName || "Nhà tuyển dụng");
      
      // Fetch company name if not provided
      if (!companyName && employerId) {
        try {
          const apiUrl = `http://localhost:8080/api/employers/${employerId}/company`;
          console.log(`🔍 [MultiChatWidget.openChat] Fetching company from:`, apiUrl);
          const response = await fetch(apiUrl);
          if (response.ok) {
            const companyText = await response.text();
            companyName = companyText.replace(/^"|"$/g, '').trim();
            console.log(`🏢 [MultiChatWidget.openChat] Fetched company name:`, companyName);
          }
        } catch (error) {
          console.error(`❌ [MultiChatWidget.openChat] Failed to fetch company:`, error);
        }
      }
      
      setSelectedCompanyName(companyName || "");
      setShowChatList(false);
      setIsOpen(true);
    },
    close: () => {
      setIsOpen(false);
      setShowChatList(true);
      setSelectedEmployerId(null);
    }
  }));

  const handleSelectContact = async (employerId: string, employerName: string, companyName?: string) => {
    setSelectedEmployerId(employerId);
    setSelectedEmployerName(employerName);
    setSelectedCompanyName(companyName || "");
    setShowChatList(false);
    
    // Mark as read when opening chat
    const chatId = `${employerId}_${applicantId}`;
    try {
      await updateDoc(doc(db, "chats", chatId), {
        unreadForApplicant: false
      });
      console.log(`✅ [MultiChatWidget] Marked chat ${chatId} as read`);
    } catch (error) {
      console.error(`❌ [MultiChatWidget] Failed to mark chat as read:`, error);
    }
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
      <style jsx>{`
        @keyframes float-chat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        
        @keyframes pulse-chat {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        @keyframes bounce-chat {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-8px); }
          60% { transform: translateY(-4px); }
        }
        
        @keyframes glow-chat {
          0%, 100% { box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3); }
          50% { box-shadow: 0 6px 24px rgba(102, 126, 234, 0.5); }
        }
        
        .chat-float-btn {
          animation: float-chat 3s ease-in-out infinite, glow-chat 2s ease-in-out infinite;
          transition: all 0.3s ease;
        }
        
        .chat-float-btn:hover {
          animation: bounce-chat 0.6s ease-in-out;
        }
        
        .chat-icon {
          animation: pulse-chat 2s ease-in-out infinite;
          transition: transform 0.3s ease;
          font-size: 32px;
        }
        
        .chat-icon:hover {
          transform: rotate(-10deg) scale(1.1);
        }
        
        @keyframes pulse-badge {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
      `}</style>
      
      {/* Chat Bubble Button */}
      {!isOpen && !hideIcon && (
        <button
          className="chat-float-btn"
          onClick={() => setIsOpen(true)}
          style={{
            position: "fixed",
            bottom: iconBottomOffset,
            right: 32,
            zIndex: 10000,
            borderRadius: "50%",
            width: 64,
            height: 64,
            background: "#fff",
            border: "3px solid #e2e8f0",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
          title="Tin nhắn với nhà tuyển dụng"
        >
          <span className="chat-icon">💬</span>
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
              animation: "pulse-badge 2s infinite"
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
            bottom: popupBottomOffset,
            right: 40,
            zIndex: 10001,
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
                {showChatList ? "Tin nhắn" : (selectedCompanyName ? `Tuyển dụng ${selectedCompanyName}` : selectedEmployerName)}
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
                      companyName: contact.companyName,
                      displayName: contact.companyName || contact.employerName,
                      lastMessage: contact.lastMessage,
                      lastTimestamp: contact.lastTimestamp,
                      formattedTime: formatTime(contact.lastTimestamp),
                      unread: contact.unreadForApplicant
                    });
                    
                    return (
                      <div
                        key={contact.employerId}
                        onClick={() => handleSelectContact(contact.employerId, contact.employerName || "Nhà tuyển dụng", contact.companyName)}
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
                            {contact.companyName ? `Tuyển dụng ${contact.companyName}` : contact.employerName}
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
                          {contact.lastMessage || "Nhấn để bắt đầu trò chuyện"}
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

    </>
  );
});

MultiChatWidget.displayName = "MultiChatWidget";

export default MultiChatWidget;
