import React, { useImperativeHandle, useState, forwardRef } from "react";
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

    useImperativeHandle(ref, () => ({
      open: () => setShowChat(true),
      close: () => setShowChat(false),
      toggle: () => setShowChat((s) => !s),
    }));

    const handleClose = () => {
      setShowChat(false);
      if (onClose) onClose();
    };

    return (
      <>
        {!showChat && (
          <button
            onClick={() => setShowChat(true)}
            style={{
              position: "fixed",
              bottom: bottomOffset,
              right: 32,
              zIndex: 1000,
              borderRadius: "50%",
              width: 56,
              height: 56,
              background: "#1976d2",
              color: "#fff",
              fontWeight: "bold",
              fontSize: 22,
              boxShadow: "0 2px 8px #aaa",
              border: "none",
              cursor: "pointer"
            }}
            title="Liên hệ nhà tuyển dụng"
          >
            💬
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
              borderRadius: 12,
              boxShadow: "0 2px 16px #aaa",
              width: 350,
              maxWidth: "90vw",
              padding: 0,
              overflow: "hidden"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#1976d2", color: "#fff", padding: "8px 16px" }}>
              <span>{employerName ? `Chat với ${employerName}` : "Chat với nhà tuyển dụng"}</span>
              <button
                onClick={handleClose}
                style={{ background: "none", border: "none", color: "#fff", fontSize: 20, cursor: "pointer" }}
                title="Đóng chat"
              >
                ×
              </button>
            </div>
            <div style={{ padding: 12 }}>
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