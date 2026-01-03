"use client";

import { useEffect, useRef, useCallback } from "react";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";

interface SSEData {
  id: number;
  jobTitle: string;
  companyName: string;
  applicationStatus: string;
}

export function useApplicationSSE(onUpdate?: (data: SSEData) => void) {
  const { data: session } = useSession();
  const eventSourceRef = useRef<EventSource | null>(null);

  const connect = useCallback(() => {
    if (!session?.accessToken) return;

    // Đóng connection cũ nếu có
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    // Tạo connection mới
    const eventSource = new EventSource(
      `http://localhost:8080/api/applicant/subscribe?token=${session.accessToken}`
    );

    eventSource.onopen = () => {
      console.log("✅ SSE Connected");
    };

    eventSource.addEventListener("statusUpdated", (event) => {
      try {
        const data: SSEData = JSON.parse(event.data);
        console.log("📬 Status updated:", data);

        // Hiển thị toast notification
        const statusText = getStatusText(data.applicationStatus);
        toast.info(
          `${data.companyName} - ${data.jobTitle}: ${statusText}`,
          {
            position: "top-right",
            autoClose: 5000,
            onClick: () => {
              window.location.href = `/applicants/${data.id}`;
            },
          }
        );

        // Callback để refresh data
        if (onUpdate) {
          onUpdate(data);
        }
      } catch (error) {
        console.error("Error parsing SSE data:", error);
      }
    });

    eventSource.onerror = (error) => {
      console.error("❌ SSE Error:", error);
      eventSource.close();
      
      // ✅ Chỉ reconnect nếu không phải lỗi 404
      // Nếu backend chưa implement SSE endpoint → không reconnect
      if (eventSourceRef.current?.readyState !== EventSource.CLOSED) {
        console.log("⏳ SSE will reconnect in 10 seconds...");
        setTimeout(() => {
          connect();
        }, 10000); // Tăng lên 10s để tránh spam
      } else {
        console.log("⚠️ SSE endpoint not available, stopped reconnecting");
      }
    };

    eventSourceRef.current = eventSource;
  }, [session, onUpdate]);

  useEffect(() => {
    if (session) {
      connect();
    }

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, [session, connect]);

  return { reconnect: connect };
}

function getStatusText(status: string) {
  switch (status) {
    case "HIRED":
      return "✅ Trúng tuyển";
    case "REJECTED":
      return "❌ Từ chối";
    case "INTERVIEW":
      return "📅 Mời phỏng vấn";
    case "CV_PASSED":
      return "✓ CV đạt yêu cầu";
    default:
      return status;
  }
}
