"use client";

import { useEffect, useState, useRef } from "react";
import { Bell } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import styles from "./NotificationBell.module.css";

// ✅ Interface mới theo backend NotificationResponseDto (Updated với notificationType)
interface Notification {
  id: number;
  notificationType: string; // "APPLY_SUCCESS" | "STATUS_UPDATE_PASSED" | "STATUS_UPDATE_INTERVIEW" | "STATUS_UPDATE_HIRED" | "STATUS_UPDATE_REJECTED" | "NEW_APPLICANT"
  title: string;
  message: string;
  status: string; // "PENDING" | "CV_PASSED" | "INTERVIEW" | "HIRED" | "REJECTED"
  isRead: boolean;
  createdAt: string; // ISO datetime
  applicantId: number | null;
  jobTitle: string;
  companyName: string;
}

export default function NotificationBell() {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // ✅ Fetch notifications từ API mới (lấy TẤT CẢ thông báo, không chỉ unread)
  const fetchNotifications = async () => {
    if (!session) return;
    
    setLoading(true);
    try {
      // ✅ Backend đã có pagination cho /unread, nhưng ta vẫn dùng /api/notifications để lấy TẤT CẢ
      // Lý do: Để hiển thị cả đã đọc và chưa đọc trong dropdown
      const res = await fetch("http://localhost:8080/api/notifications?page=0&size=20", {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      });
      
      if (!res.ok) throw new Error("Failed to fetch notifications");
      
      const data = await res.json();
      
      console.log("🔔 Total notifications:", data.notifications?.length || 0);
      console.log("🔔 Sample notification:", data.notifications?.[0]);
      
      // ✅ Backend trả về: { notifications: [...], currentPage, totalPages, ... }
      const allNotifications = data.notifications || [];
      setNotifications(allNotifications);
      
      // ✅ Tính số thông báo chưa đọc từ data
      const unread = allNotifications.filter((n: Notification) => !n.isRead).length;
      setUnreadCount(unread);
      
      console.log("🔔 Unread count:", unread);
    } catch (error) {
      console.error("❌ Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      fetchNotifications();
      
      // ✅ Refresh mỗi 10 giây (giảm từ 30s) để cập nhật thông báo nhanh hơn
      const interval = setInterval(fetchNotifications, 10000);
      return () => clearInterval(interval);
    }
  }, [session]);

  // ✅ Expose function để các component khác có thể trigger refresh thủ công
  useEffect(() => {
    // Listen for custom event để refresh notification
    const handleRefreshNotifications = () => {
      console.log("🔄 Manual refresh notifications triggered");
      fetchNotifications();
    };

    window.addEventListener("refreshNotifications", handleRefreshNotifications);
    return () => window.removeEventListener("refreshNotifications", handleRefreshNotifications);
  }, [session]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // ✅ Đánh dấu thông báo đã đọc khi click
  const handleMarkAsRead = async (notificationId: number) => {
    if (!session) return;
    
    // ✅ Kiểm tra xem notification đã read chưa trước khi gọi API
    const notification = notifications.find(n => n.id === notificationId);
    if (!notification || notification.isRead) return;
    
    try {
      const res = await fetch(`http://localhost:8080/api/notifications/${notificationId}/read`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      });
      
      if (res.ok) {
        // ✅ Cập nhật UI local
        setNotifications(prev => 
          prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
        
        console.log("✅ Marked notification as read:", notificationId);
      }
    } catch (error) {
      console.error("❌ Error marking notification as read:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "HIRED":
        return "#10b981"; // green
      case "REJECTED":
        return "#ef4444"; // red
      case "INTERVIEW":
        return "#8b5cf6"; // purple
      case "CV_PASSED":
        return "#3b82f6"; // blue
      case "PENDING":
        return "#f59e0b"; // amber
      default:
        return "#6b7280"; // gray
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "HIRED":
        return "🎉 Trúng tuyển";
      case "REJECTED":
        return "❌ Từ chối";
      case "INTERVIEW":
        return "📅 Mời phỏng vấn";
      case "CV_PASSED":
        return "✅ CV đạt yêu cầu";
      case "PENDING":
        return "⏳ Đang xét duyệt";
      default:
        return status;
    }
  };

  // ✅ Format thời gian hiển thị
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Vừa xong";
    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    if (diffDays < 7) return `${diffDays} ngày trước`;
    return date.toLocaleDateString("vi-VN");
  };

  // ✅ Không hiển thị nếu chưa login
  if (!session) return null;

  return (
    <div className={styles.notificationWrapper} ref={dropdownRef}>
      <button
        className={styles.bellButton}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notifications"
      >
        <Bell size={22} />
        {unreadCount > 0 && (
          <span className={styles.badge}>{unreadCount > 99 ? "99+" : unreadCount}</span>
        )}
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          <div className={styles.header}>
            <h3>Thông báo</h3>
            {unreadCount > 0 && (
              <span className={styles.unreadText}>
                {unreadCount} chưa đọc
              </span>
            )}
          </div>

          <div className={styles.notificationList}>
            {loading ? (
              <div className={styles.loading}>Đang tải...</div>
            ) : notifications.length === 0 ? (
              <div className={styles.empty}>
                <Bell size={40} color="#ccc" />
                <p>Chưa có thông báo nào</p>
              </div>
            ) : (
              notifications.slice(0, 15).map((notif) => (
                <div
                  key={notif.id}
                  className={`${styles.notificationItem} ${!notif.isRead ? styles.unread : ""}`}
                  onClick={() => {
                    handleMarkAsRead(notif.id);
                    // ✅ Đợi một chút rồi mới chuyển trang để animation mark as read chạy
                    setTimeout(() => {
                      if (notif.applicantId) {
                        window.location.href = `/applicants/${notif.applicantId}`;
                      }
                    }, 200);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <div className={styles.notifContent}>
                    <div className={styles.notifTitle}>
                      <span className={styles.notifTitleText}>{notif.title}</span>
                      {!notif.isRead && <span className={styles.newDot}>●</span>}
                    </div>
                    
                    {notif.companyName && (
                      <div className={styles.companyName}>
                        📍 {notif.companyName}
                      </div>
                    )}
                    
                    {notif.jobTitle && (
                      <div className={styles.notifJob}>
                        💼 {notif.jobTitle}
                      </div>
                    )}
                    
                    {notif.message && (
                      <div className={styles.notifMessage}>
                        {notif.message}
                      </div>
                    )}
                    
                    <div className={styles.notifFooter}>
                      {notif.status && (
                        <span 
                          className={styles.notifStatus}
                          style={{ color: getStatusColor(notif.status) }}
                        >
                          {getStatusText(notif.status)}
                        </span>
                      )}
                      <span className={styles.notifTime}>
                        {formatTime(notif.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <Link
            href="/candidate-profile?tab=apply&page=1"
            className={styles.viewAll}
            onClick={() => setIsOpen(false)}
          >
            Xem tất cả đơn ứng tuyển →
          </Link>
        </div>
      )}
    </div>
  );
}
