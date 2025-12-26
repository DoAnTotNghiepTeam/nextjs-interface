// "use client";

// import { useState, useRef, useEffect } from "react";
// import ReactMarkdown from "react-markdown";
// import { Send, X } from "lucide-react";
// import { WechatOutlined } from '@ant-design/icons';
// import { AliwangwangOutlined } from '@ant-design/icons';


// export default function JobChatBot() {
//     const [input, setInput] = useState("");
//     const [loading, setLoading] = useState(false);
//     type Message = { type: "user" | "bot"; content: string; time: string };
//     const [messages, setMessages] = useState<Message[]>([]);
//     const [showTyping, setShowTyping] = useState(false);
//     const [isOpen, setIsOpen] = useState(false);
//     const chatEndRef = useRef<HTMLDivElement>(null);
//     const inputRef = useRef<HTMLInputElement>(null);

//     useEffect(() => {
//         if (typeof window !== "undefined") {
//             const saved = sessionStorage.getItem("jobchat-history");
//             if (saved) setMessages(JSON.parse(saved));
//         }
//     }, []);

//     useEffect(() => {
//         chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
//         if (typeof window !== "undefined") {
//             sessionStorage.setItem("jobchat-history", JSON.stringify(messages));
//         }
//         if (!loading && isOpen) inputRef.current?.focus();
//     }, [messages, showTyping, loading, isOpen]);

//     const getCurrentTime = () => {
//         const now = new Date();
//         return now.toLocaleTimeString("vi-VN", {
//             hour: "2-digit",
//             minute: "2-digit",
//         });
//     };

//     const sendMessage = async () => {
//         if (!input.trim() || loading) return;
//         const userMessage = input.trim();
//         const time = getCurrentTime();

//         setInput("");
//         setMessages((prev) => [...prev, { type: "user", content: userMessage, time }]);
//         setLoading(true);
//         setShowTyping(true);

//         try {
//             const history = [
//                 ...messages.map((msg) => ({
//                     role: msg.type === "user" ? "user" : "assistant",
//                     text: msg.content,
//                 })),
//                 { role: "user", text: userMessage },
//             ];

//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ai_chatbot`, {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ history }),
//             });

//             const data = await res.json();
//             setShowTyping(false);
//             setMessages((prev) => [
//                 ...prev,
//                 { type: "bot", content: data.reply, time: getCurrentTime() },
//             ]);
//         } catch (err) {
//             setShowTyping(false);
//             setMessages((prev) => [
//                 ...prev,
//                 {
//                     type: "bot",
//                     content: "⚠️ Không thể kết nối tới server.",
//                     time: getCurrentTime(),
//                 },
//             ]);
//         }
//         setLoading(false);
//     };

//     const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
//         if (e.key === "Enter" && !e.shiftKey) {
//             e.preventDefault();
//             sendMessage();
//         }
//     };

//     // Floating button style
//     const floatBtnStyle = {
//         position: "fixed" as const,
//         bottom: 84,
//         right: 23,
//         width: 64,
//         height: 64,
//         borderRadius: "50%",
//         background: "#87CEEB",
//         boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         zIndex: 9999,
//         cursor: "pointer",
//         border: "none"
//     };

//     // Modal style  khung chat bot 
//     const modalStyle = {
//         position: "fixed" as const,
//         bottom: 40, // thấp hơn cho thoáng
//         right: 40,
//         width: 480, // tăng chiều rộng
//         maxWidth: "98vw",
//         height: 600, // tăng chiều cao
//         background: "#fff",
//         borderRadius: 20,
//         boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
//         display: "flex",
//         flexDirection: "column" as const,
//         zIndex: 9999,
//         overflow: "hidden"
//     };

//     const headerStyle = {
//         background: "#00CCFF",
//         color: "#fff",
//         padding: "16px 20px 12px 20px",
//         display: "flex",
//         alignItems: "center",
//         gap: 12,
//         position: "relative" as const,
//         minHeight: 60
//     };
//     const closeBtnStyle = {
//         position: "absolute" as const,
//         right: 16,
//         top: 16,
//         background: "none",
//         border: "none",
//         color: "#fff",
//         fontSize: 22,
//         cursor: "pointer"
//     };
//     const iconStyle = {
//         width: 40,
//         height: 40,
//         borderRadius: "50%",
//         background: "#fff",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         fontSize: 24,
//         color: "#00CCFF"
//     };
//     const bodyStyle = {
//         flex: 1,
//         background: "#fff",
//         padding: "16px 12px 8px 12px",
//         overflowY: "auto" as const,
//         display: "flex",
//         flexDirection: "column" as const
//     };
//     const inputBarStyle = {
//         borderTop: "1px solid #eee",
//         padding: "12px 16px",
//         display: "flex",
//         gap: 8,
//         background: "#fff"
//     };
//     const inputStyle = {
//         flex: 1,
//         border: "1px solid #ddd",
//         borderRadius: 12,
//         padding: "8px 12px"
//     };
//     const sendBtnStyle = {
//         background: "#00CCFF",
//         color: "#fff",
//         border: "none",
//         borderRadius: 12,
//         padding: "0 16px",
//         cursor: "pointer"
//     };
//     const msgUserStyle = {
//         background: "#00c4cc",
//         color: "#fff",
//         borderRadius: "16px 16px 0 16px",
//         alignSelf: "flex-end" as const,
//         margin: "4px 0",
//         padding: "8px 16px",
//         maxWidth: "70%",
//         fontSize: 16,
//         fontWeight: 500,
//         wordBreak: "break-word" as const
//     };
//     const msgBotStyle = {
//         background: "#f5f5f5",
//         color: "#333",
//         borderRadius: "16px 16px 16px 0",
//         alignSelf: "flex-start" as const,
//         margin: "4px 0",
//         padding: "8px 16px",
//         maxWidth: "90%",
//         gap: 4,
//     };

//     return (
//         <>
//             {/* Floating button */}
//             {/* ...existing code... */}
//             <button style={floatBtnStyle} onClick={() => setIsOpen(true)} title="Chat hỗ trợ">
//                 <span
//                     style={{
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         width: "100%",
//                         height: "100%",
//                     }}
//                 >
//                     <WechatOutlined style={{ fontSize: 36, color: "#fff" }} />
//                 </span>
//             </button>
//             {/* ...existing code... */}

//             {/* Modal chat */}
//             {isOpen && (
//                 <div style={modalStyle}>
//                     {/* Header */}
//                     <div style={headerStyle}>
//                         <div style={iconStyle}>
//                             {/* Đổi sang icon AliwangwangOutlined thay cho ảnh jobhub-logo */}
//                             <AliwangwangOutlined style={{ fontSize: 40, color: "#00CCFF" }} />
//                         </div>
//                         <div>
//                             <div style={{ fontWeight: 600, fontSize: 16 }}>Hỗ trợ trực tuyến</div>
//                             <div style={{ fontSize: 13, marginTop: 2 }}>Huyle sẵn sàng trợ giúp. Hãy để lại yêu cầu hoăcc câu hỏi của bạn tại đây!</div>
//                         </div>
//                         <button style={closeBtnStyle} onClick={() => setIsOpen(false)} aria-label="Đóng">
//                             <X size={22} />
//                         </button>
//                     </div>
//                     {/* Chat body nội dùng dc reply lại by chat*/}
//                     <div style={bodyStyle}>
//                         {messages.length === 0 && (
//                             <div style={{
//                                 display: "flex",
//                                 flexDirection: "column",
//                                 alignItems: "center",
//                                 justifyContent: "center",
//                                 color: "#888",
//                                 marginTop: 24,
//                                 marginBottom: 12
//                             }}>
//                                 <span style={{
//                                     display: "flex",
//                                     alignItems: "center",
//                                     justifyContent: "center",
//                                     // width: 154,
//                                     // height: 154,
//                                     marginBottom: 10,
//                                     boxShadow: "0 2px 8px rgba(0,196,204,0.10)"
//                                 }}>
//                                     {/* Đổi sang icon AliwangwangOutlined thay cho ảnh jobhub-logo */}
//                                     <AliwangwangOutlined style={{ fontSize: 250, color: "#00CCFF" }} />
//                                 </span>
//                                 <span style={{ fontSize: 16, fontWeight: 500, textAlign: "center", lineHeight: 1.5 }}>
//                                     👋 Xin chào! Bạn có thể hỏi về việc làm, mức lương, kỹ năng hoặc quy trình ứng tuyển.
//                                 </span>
//                             </div>
//                         )}
//                         {messages.map((message, index) => (
//                             <div
//                                 key={index}
//                                 style={{
//                                     ...(message.type === "user" ? msgUserStyle : msgBotStyle),
//                                     marginBottom: 10,
//                                     whiteSpace: "pre-line"
//                                 }}
//                             >
//                                 <ReactMarkdown
//                                     components={{
//                                         p: ({ node, ...props }) => <p style={{ margin: "0 0 8px 0" }} {...props} />,
//                                         strong: ({ node, ...props }) => <strong style={{ color: "#00c4cc" }} {...props} />,
//                                         span: ({ node, ...props }) => {
//                                             const text = String(props.children);
//                                             if (/chúc bạn thành công|chúc bạn may mắn|chúc bạn ứng tuyển thành công|chúc bạn sớm tìm được việc/i.test(text)) {
//                                                 return (
//                                                     <span
//                                                         style={{
//                                                             color: "#fff",
//                                                             background: "#00c4cc",
//                                                             padding: "8px 18px",
//                                                             borderRadius: 12,
//                                                             fontWeight: 900,
//                                                             fontSize: 20,
//                                                             display: "inline-block",
//                                                             marginTop: 12,
//                                                             marginBottom: 8,
//                                                             boxShadow: "0 4px 16px rgba(0,196,204,0.18)",
//                                                             letterSpacing: 1,
//                                                             textShadow: "0 2px 8px rgba(0,0,0,0.12)"
//                                                         }}
//                                                     >
//                                                         {text}
//                                                     </span>
//                                                 );
//                                             }
//                                             return <span {...props} />;
//                                         },
//                                     }}
//                                 >
//                                     {message.content}
//                                 </ReactMarkdown>
//                             </div>
//                         ))}
//                         {showTyping && (
//                             <div style={msgBotStyle}>
//                                 <span className="spinner-grow spinner-grow-sm text-secondary"></span>
//                                 <span className="spinner-grow spinner-grow-sm text-secondary"></span>
//                                 <span className="spinner-grow spinner-grow-sm text-secondary"></span>
//                             </div>
//                         )}
//                         <div ref={chatEndRef} />
//                     </div>
//                     {/* Input bar */}
//                     <div style={inputBarStyle}>
//                         <input
//                             ref={inputRef}
//                             type="text"
//                             value={input}
//                             onChange={(e) => setInput(e.target.value)}
//                             onKeyDown={handleKeyDown}
//                             placeholder="Nhập tin nhắn..."
//                             style={inputStyle}
//                             disabled={loading}
//                         />
//                         <button
//                             onClick={sendMessage}
//                             disabled={loading || !input.trim()}
//                             style={sendBtnStyle}
//                         >
//                             {loading ? "..." : <Send size={18} />}
//                         </button>
//                     </div>
//                 </div>
//             )}
//         </>
//     );
// }



"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import ReactMarkdown from "react-markdown"
import { Send, X } from "lucide-react"
import type { Dispatch, SetStateAction } from "react"

interface JobChatBotProps {
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
}

export default function JobChatBot({ isOpen, setIsOpen }: JobChatBotProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  type Message = {
    type: "user" | "bot"
    content: string
    time: string
    imageUrl?: string
    fileUrl?: string
    fileName?: string
  }
  const [messages, setMessages] = useState<Message[]>([])
  const [showTyping, setShowTyping] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea
  const adjustTextareaHeight = () => {
    const textarea = inputRef.current
    if (textarea) {
      textarea.style.height = "20px" // Reset to minHeight first
      const scrollHeight = textarea.scrollHeight
      textarea.style.height = `${Math.min(scrollHeight, 150)}px`
    }
  }

  useEffect(() => {
    adjustTextareaHeight()
  }, [input])

  // paste ảnh từ clipboard
  useEffect(() => {
    if (!isOpen) return
    const handlePaste = (e: ClipboardEvent) => {
      if (e.clipboardData && e.clipboardData.files.length > 0) {
        const file = e.clipboardData.files[0]
        if (file.type.startsWith("image/")) {
          setSelectedFile(file)
        }
      }
    }
    window.addEventListener("paste", handlePaste)
    return () => {
      window.removeEventListener("paste", handlePaste)
    }
  }, [isOpen])

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = sessionStorage.getItem("jobchat-history")
      if (saved) setMessages(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
    if (typeof window !== "undefined") {
      sessionStorage.setItem("jobchat-history", JSON.stringify(messages))
    }
    if (!loading && isOpen) inputRef.current?.focus()
  }, [messages, showTyping, loading, isOpen])

  const getCurrentTime = () => {
    const now = new Date()
    return now.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // ... existing sendMessage function ...
  const sendMessage = async () => {
    if (loading) return
    const userMessage = input.trim()
    const time = getCurrentTime()

    setInput("") // Xóa input ngay khi bấm gửi
    setLoading(true)
    setShowTyping(true)

    // Nếu có file ảnh hoặc PDF
    if (selectedFile) {
      // Hiển thị tin nhắn user ngay lập tức
      let imageUrl: string | undefined
      let fileName: string | undefined
      if (selectedFile.type.startsWith("image/")) {
        imageUrl = URL.createObjectURL(selectedFile)
      } else {
        fileName = selectedFile.name
      }
      setMessages((prev) => [...prev, { type: "user", content: userMessage, time, imageUrl, fileName }])
      setSelectedFile(null) // Xóa file đã chọn ngay khi gửi

      try {
        const formData = new FormData()
        formData.append("file", selectedFile) // key phải là 'file' cho Flask
        // Gửi history và input kèm theo
        const history = [
          ...messages.map((msg) => ({
            role: msg.type === "user" ? "user" : "assistant",
            text: msg.content,
          })),
          userMessage ? { role: "user", text: userMessage } : null,
        ].filter(Boolean)
        formData.append("history", JSON.stringify(history))
        // Nếu muốn truyền job_position thì thêm formData.append("job_position", ...)

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ai_chatbot`, {
          method: "POST",
          body: formData,
        })
        if (!res.ok) {
          const errorText = await res.text()
          setMessages((prev) => [
            ...prev,
            { type: "bot", content: `⚠️ Upload thất bại (status: ${res.status}): ${errorText}`, time },
          ])
          setShowTyping(false)
          setLoading(false)
          return
        }
        const data = await res.json()
        setMessages((prev) => [...prev, { type: "bot", content: data.reply, time: getCurrentTime() }])
        setShowTyping(false)
        setLoading(false)
      } catch (err: any) {
        setMessages((prev) => [
          ...prev,
          { type: "bot", content: `⚠️ Upload file thất bại: ${err?.message || err}`, time },
        ])
        setShowTyping(false)
        setLoading(false)
      }
    } else if (userMessage) {
      setMessages((prev) => [...prev, { type: "user", content: userMessage, time }])
      try {
        const history = [
          ...messages.map((msg) => ({
            role: msg.type === "user" ? "user" : "assistant",
            text: msg.content,
          })),
          { role: "user", text: userMessage },
        ]
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ai_chatbot`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ history }),
        })
        const data = await res.json()
        setShowTyping(false)
        setLoading(false)
        setMessages((prev) => [...prev, { type: "bot", content: data.reply, time: getCurrentTime() }])
      } catch {
        setShowTyping(false)
        setLoading(false)
        setMessages((prev) => [
          ...prev,
          { type: "bot", content: "⚠️ Không thể kết nối tới server.", time: getCurrentTime() },
        ])
      }
    } else {
      setShowTyping(false)
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <>
      <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-8px); }
                }
                
                @keyframes pulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                }
                
                @keyframes bounce {
                    0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
                    40% { transform: translateY(-8px); }
                    60% { transform: translateY(-4px); }
                }
                
                @keyframes glow {
                    0%, 100% { box-shadow: 0 4px 16px rgba(67, 97, 238, 0.3); }
                    50% { box-shadow: 0 6px 24px rgba(67, 97, 238, 0.5); }
                }
                
                .chatbot-float-btn {
                    animation: float 3s ease-in-out infinite, glow 2s ease-in-out infinite;
                    transition: all 0.3s ease;
                }
                
                .chatbot-float-btn:hover {
                    animation: bounce 0.6s ease-in-out;
                    transform: scale(1.1);
                }
                
                .chatbot-icon {
                    animation: pulse 2s ease-in-out infinite;
                    transition: transform 0.3s ease;
                }
                
                .chatbot-icon:hover {
                    transform: rotate(10deg) scale(1.1);
                }
                
                .typing-indicator span {
                    display: inline-block;
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background: #4361ee;
                    margin: 0 2px;
                    animation: typing 1.4s infinite ease-in-out;
                }
                
                .typing-indicator span:nth-child(1) { animation-delay: 0s; }
                .typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
                .typing-indicator span:nth-child(3) { animation-delay: 0.4s; }
                
                @keyframes typing {
                    0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
                    30% { transform: translateY(-10px); opacity: 1; }
                }
                
                .chat-modal {
                    animation: slideUp 0.3s ease-out;
                }
                
                @keyframes slideUp {
                    from { 
                        opacity: 0; 
                        transform: translateY(20px) scale(0.95); 
                    }
                    to { 
                        opacity: 1; 
                        transform: translateY(0) scale(1); 
                    }
                }
            `}</style>

      {!isOpen && (
        <button
          className="chatbot-float-btn"
          style={{
            position: "fixed",
            bottom: 84,
            right: 23,
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: "#fff",
            border: "3px solid #e2e8f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            cursor: "pointer",
          }}
          onClick={() => setIsOpen(true)}
          title="Chat hỗ trợ việc làm"
        >
          {/* <img
            src="/assets/imgs/brands/chatbot.jpg"
            alt="JobBox Assistant"
            className="chatbot-icon"
            style={{
              width: 48,
              height: 48,
              filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
            }}
          /> */}
            <img
            src="/assets/imgs/brands/chatbot.jpg"
            alt="JobBox Assistant"
            className="chatbot-icon"
            style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "50%",
            }}
            />
        </button>
      )}

      {isOpen && (
        <div
          className="chat-modal"
          style={{
            position: "fixed",
            bottom: 40,
            right: 40,
            width: 350,
            maxWidth: "98vw",
            height: 500,
            background: "#fff",
            borderRadius: 20,
            boxShadow: "0 12px 48px rgba(67, 97, 238, 0.15)",
            display: "flex",
            flexDirection: "column",
            zIndex: 9999,
            overflow: "hidden",
            border: "1px solid rgba(67, 97, 238, 0.1)",
          }}
        >
          <div
            style={{
              background: "linear-gradient(135deg, #4361ee 0%, #3f37c9 100%)",
              color: "#fff",
              padding: "20px",
              display: "flex",
              alignItems: "center",
              gap: 16,
              position: "relative",
              minHeight: 80,
            }}
          >
            <div
              style={{
                width: 50,
                height: 50,
                borderRadius: "50%",
                background: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
            >
                    <img
                src="/assets/imgs/brands/chatbot.jpg"
                alt="JobBox Assistant"
                style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "50%",
                    animation: "pulse 2s ease-in-out infinite",
                }}
                />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 4 }}>JobBox Assistant</div>
              <div style={{ fontSize: 14, opacity: 0.9 }}>Tư vấn việc làm & hỗ trợ tuyển dụng 24/7</div>
            </div>
            <button
              style={{
                position: "absolute",
                right: 16,
                top: 16,
                background: "rgba(255,255,255,0.2)",
                border: "none",
                color: "#fff",
                fontSize: 20,
                cursor: "pointer",
                borderRadius: "50%",
                width: 32,
                height: 32,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s ease",
              }}
              onClick={() => setIsOpen(false)}
              aria-label="Đóng"
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.3)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.2)"
              }}
            >
              <X size={18} />
            </button>
          </div>

          <div
            style={{
              flex: 1,
              background: "#f8fafc",
              padding: "20px 16px 12px 16px",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {messages.length === 0 && (
              <div
                style={{
                  textAlign: "center",
                  padding: "40px 20px",
                  color: "#64748b",
                }}
              >
                <img
                  src="/assets/imgs/brands/chatbot.jpg"
                  alt="Welcome"
                  style={{
                    width: 64,
                    height: 64,
                    margin: "0 auto 16px",
                    opacity: 0.7,
                  }}
                />
                <h3
                  style={{
                    fontSize: 18,
                    fontWeight: 600,
                    margin: "0 0 8px 0",
                    color: "#4361ee",
                  }}
                >
                  Chào mừng đến với JobBox!
                </h3>
                <p
                  style={{
                    fontSize: 14,
                    margin: 0,
                    lineHeight: 1.5,
                  }}
                >
                  Tôi có thể giúp bạn tìm việc làm, tư vấn CV, hoặc trả lời các câu hỏi về tuyển dụng.
                </p>
              </div>
            )}

            {messages.map((message, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: message.type === "user" ? "flex-end" : "flex-start",
                  marginBottom: 16,
                  gap: 6,
                }}
              >
                {/* Ảnh */}
                {message.imageUrl && (
                  <img
                    src={message.imageUrl || "/placeholder.svg"}
                    alt="preview"
                    style={{
                      maxWidth: "240px",
                      maxHeight: "240px",
                      borderRadius: 12,
                      boxShadow: "0 4px 12px rgba(67, 97, 238, 0.1)",
                    }}
                  />
                )}
                {/* File PDF */}
                {message.fileName && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      background: "#e2e8f0",
                      borderRadius: 12,
                      padding: "8px 12px",
                      fontSize: 14,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                    }}
                  >
                    📄 {message.fileName}
                  </div>
                )}
                {/* Text */}
                {message.content && (
                  <div
                    style={
                      message.type === "user"
                        ? {
                            // background: "linear-gradient(135deg, #4361ee 0%, #3f37c9 100%)",
                            background: "linear-gradient(135deg, #99a8d6 0%, #e4e6f8 70%)",
                            color: "#fff",
                            borderRadius: "18px 18px 4px 18px",
                            alignSelf: "flex-end",
                            padding: "12px 16px",
                            maxWidth: "75%",
                            fontSize: 15,
                            fontWeight: 500,
                            wordBreak: "break-word",
                            boxShadow: "0 4px 12px rgba(67, 97, 238, 0.2)",
                          }
                        : {
                            background: "#fff",
                            color: "#1e293b",
                            borderRadius: "18px 18px 18px 4px",
                            alignSelf: "flex-start",
                            padding: "12px 16px",
                            maxWidth: "85%",
                            border: "1px solid #e2e8f0",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                          }
                    }
                  >
                    <ReactMarkdown
                      components={{
                        p: ({ node, ...props }) => {
                          const text = String(props.children)
                          if (
                            /^(Lập trình viên|Mobile Developer|Backend Developer|Kỹ sư DevOps|Data Engineer|Chuyên viên An ninh mạng|Fullstack Developer|AI Engineer|QA\/QC Engineer|Product Manager|Web Developer|IT Support|UI\/UX Designer|Data Entry|Mobile App Tester|Content Writer|full stack web)/i.test(
                              text,
                            )
                          ) {
                            return (
                              <p style={{ fontWeight: 700, fontSize: 16, color: "#4361ee", margin: "0 0 8px 0" }}>
                                {text}
                              </p>
                            )
                          }
                          return <p style={{ margin: "0 0 8px 0", lineHeight: 1.5,color: message.type === "user" ? "#fff" : "#1e293b",
          // Thêm !important để ghi đè CSS global
          ...(message.type === "user" ? { color: "#fff !important" } : {}), }} {...props} />
                        },
                        strong: ({ node, ...props }) => (
                          <strong style={{ color: "#4361ee", fontWeight: 700 }} {...props} />
                        ),
                        h1: ({ node, ...props }) => (
                          <h1 style={{ color: "#4361ee", fontWeight: 700, fontSize: 20, marginBottom: 8 }} {...props} />
                        ),
                        h2: ({ node, ...props }) => (
                          <h2 style={{ color: "#4361ee", fontWeight: 700, fontSize: 18, marginBottom: 8 }} {...props} />
                        ),
                        h3: ({ node, ...props }) => (
                          <h3 style={{ color: "#4361ee", fontWeight: 700, fontSize: 16, marginBottom: 8 }} {...props} />
                        ),
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
                  </div>
                )}
                <div
                  style={{
                    fontSize: 11,
                    color: "#94a3b8",
                    alignSelf: message.type === "user" ? "flex-end" : "flex-start",
                    marginTop: 2,
                  }}
                >
                  {message.time}
                </div>
              </div>
            ))}

            {showTyping && (
              <div
                style={{
                  background: "#fff",
                  color: "#64748b",
                  borderRadius: "18px 18px 18px 4px",
                  alignSelf: "flex-start",
                  padding: "16px 20px",
                  maxWidth: "85%",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                }}
              >
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div
            style={{
              width: "100%",
              background: "#fff",
              borderTop: "1px solid #e2e8f0",
              padding: "16px 20px",
              display: "flex",
              alignItems: "flex-end",
              gap: 12,
            }}
          >
            <label
              htmlFor="chatbot-file-upload"
              style={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 44,
                height: 44,
                borderRadius: "50%",
                background: "#f1f5f9",
                border: "2px solid #e2e8f0",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#e2e8f0"
                e.currentTarget.style.borderColor = "#4361ee"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#f1f5f9"
                e.currentTarget.style.borderColor = "#e2e8f0"
              }}
            >
              <input
                id="chatbot-file-upload"
                type="file"
                accept="image/*,application/pdf"
                style={{ display: "none" }}
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setSelectedFile(e.target.files[0])
                  }
                }}
              />
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2">
                <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66L9.64 16.2a2 2 0 0 1-2.83-2.83l8.49-8.49" />
              </svg>
            </label>

            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                border: "2px solid #e2e8f0",
                borderRadius: 16,
                padding: "12px 16px",
                gap: 8,
                background: "#fff",
                transition: "border-color 0.2s ease",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#4361ee"
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "#e2e8f0"
              }}
            >
              {selectedFile && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    background: "#f1f5f9",
                    borderRadius: 8,
                    padding: "6px 10px",
                    maxWidth: "100%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  <span style={{ fontSize: 13, marginRight: 8, color: "#64748b" }}>{selectedFile.name}</span>
                  <button
                    onClick={() => setSelectedFile(null)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#94a3b8",
                      fontSize: 16,
                      cursor: "pointer",
                      padding: 0,
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    ×
                  </button>
                </div>
              )}
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value)
                  setTimeout(() => adjustTextareaHeight(), 0)
                }}
                onKeyDown={handleKeyDown as any}
                placeholder="Nhập câu hỏi về việc làm..."
                style={{
                  flex: 1,
                  border: "none",
                  outline: "none",
                  fontSize: 11,
                  minWidth: 0,
                  resize: "none",
                  minHeight: 20,
                  maxHeight: 150,
                  lineHeight: 1.4,
                  padding: 0,
                  fontFamily: "inherit",
                  color: "#1e293b",
                  overflowY: "auto",
                  overflowX: "hidden",
                  wordBreak: "break-word",
                }}
                disabled={loading}
                rows={1}
              />
            </div>

            <button
              onClick={sendMessage}
              disabled={loading || (!input.trim() && !selectedFile)}
              style={{
                background:
                  loading || (!input.trim() && !selectedFile)
                    ? "#94a3b8"
                    : "linear-gradient(135deg, #4361ee 0%, #3f37c9 100%)",
                color: "#fff",
                border: "none",
                borderRadius: 12,
                padding: "12px 16px",
                cursor: loading || (!input.trim() && !selectedFile) ? "not-allowed" : "pointer",
                boxShadow: "0 4px 12px rgba(67, 97, 238, 0.2)",
                transition: "all 0.2s ease",
                width: 48,
                height: 48,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              onMouseEnter={(e) => {
                if (!loading && (input.trim() || selectedFile)) {
                  e.currentTarget.style.transform = "translateY(-1px)"
                  e.currentTarget.style.boxShadow = "0 6px 16px rgba(67, 97, 238, 0.3)"
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)"
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(67, 97, 238, 0.2)"
              }}
            >
              {loading ? (
                <div
                  style={{
                    width: 16,
                    height: 16,
                    border: "2px solid rgba(255,255,255,0.3)",
                    borderTop: "2px solid #fff",
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite",
                  }}
                />
              ) : (
                <Send size={18} />
              )}
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
    </>
  )
}
