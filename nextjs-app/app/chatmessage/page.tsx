
"use client";
import { useEffect, useState } from "react";
import { db } from "./libraries/firebase/initializaApp"; // Đường dẫn tới file firebase bạn đã khởi tạo
import {
    collection,
    addDoc,
    query,
    orderBy,
    onSnapshot,
    serverTimestamp,
    Timestamp
} from "firebase/firestore";

function Chat({ chatId, currentUserId }: { chatId: string; currentUserId: string }) {
    const [messages, setMessages] = useState<
        { text: string; sender: string; createdAt: Timestamp | null }[]
    >([]);
    const [input, setInput] = useState("");

    useEffect(() => {
        if (!chatId) return;
        const q = query(
            collection(db, "chats", chatId, "messages"),
            orderBy("createdAt")
        );
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setMessages(
                snapshot.docs.map((doc) => {
                    const data = doc.data();
                    return {
                        text: data.text ?? "",
                        sender: data.sender ?? "",
                        createdAt: data.createdAt ?? null,
                    };
                })
            );
        });
        return unsubscribe;
    }, [chatId]);

    const sendMessage = async () => {
        if (!input.trim()) return;
        await addDoc(collection(db, "chats", chatId, "messages"), {
            text: input,
            sender: currentUserId,
            createdAt: serverTimestamp(),
        });
        setInput("");
    };

    return (
        <div style={{ maxWidth: 400, margin: "0 auto" }}>
            <div
                style={{
                    height: 300,
                    overflowY: "auto",
                    border: "1px solid #eee",
                    padding: 8,
                    marginBottom: 8,
                    background: "#fafafa",
                }}
            >
                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        style={{
                            textAlign: msg.sender === currentUserId ? "right" : "left",
                            margin: "6px 0",
                        }}
                    >
                        <span
                            style={{
                                display: "inline-block",
                                background:
                                    msg.sender === currentUserId ? "#00c4cc" : "#eee",
                                color: msg.sender === currentUserId ? "#fff" : "#333",
                                borderRadius: 12,
                                padding: "6px 12px",
                                maxWidth: "70%",
                                wordBreak: "break-word",
                            }}
                        >
                            {msg.text}
                        </span>
                    </div>
                ))}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    style={{
                        flex: 1,
                        borderRadius: 8,
                        border: "1px solid #ccc",
                        padding: "8px",
                    }}
                    placeholder="Nhập tin nhắn..."
                    onKeyDown={(e) => {
                        if (e.key === "Enter") sendMessage();
                    }}
                />
                <button
                    onClick={sendMessage}
                    style={{
                        background: "#00c4cc",
                        color: "#fff",
                        border: "none",
                        borderRadius: 8,
                        padding: "0 16px",
                        cursor: "pointer",
                    }}
                >
                    Gửi
                </button>
            </div>
        </div>
    );
}

// Trang test: truyền giá trị mặc định cho chatId và currentUserId
export default function ChatTestPage() {
    // Đổi giá trị này để test nhiều user/chat khác nhau
    const chatId = "test_chat_1";
    const currentUserId = "user_1";
    return (
        <div>
            <h2>Test Chat Message</h2>
            <Chat chatId={chatId} currentUserId={currentUserId} />
        </div>
    );
}
