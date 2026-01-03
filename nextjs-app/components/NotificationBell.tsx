"use client";

import { useEffect, useState, useRef } from "react";
import { Bell } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import styles from "./NotificationBell.module.css";

interface Notification {
  id: number;
  jobTitle: string;
  companyName: string;
  applicationStatus: string;
  appliedAt: string;
  isRead: boolean;
}

export default function NotificationBell() {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch notifications từ API
  const fetchNotifications = async () => {
    if (!session) return;
    
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/api/applicant?page=0&size=50&sortBy=appliedAt&sortDir=desc", {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      });
      const data = await res.json();
      
      // Lọc các application chưa đọc
      const apps = data.data || [];
      const unreadApps = apps.filter((app: Notification) => !app.isRead);
      
      console.log("🔔 Total applications:", apps.length);
      console.log("🔔 Unread applications:", unreadApps.length);
      console.log("🔔 Sample app:", apps[0]);
      
      setNotifications(apps);
      setUnreadCount(unreadApps.length);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      fetchNotifications();
      
      // Refresh mỗi 30 giây
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
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
      default:
        return "#6b7280"; // gray
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "HIRED":
        return "✅ Trúng tuyển";
      case "REJECTED":
        return "❌ Từ chối";
      case "INTERVIEW":
        return "📅 Mời phỏng vấn";
      case "CV_PASSED":
        return "✓ CV đạt yêu cầu";
      case "PENDING":
        return "⏳ Đang xét duyệt";
      default:
        return status;
    }
  };

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
            <h3>Thông báo ứng tuyển</h3>
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
              notifications.slice(0, 10).map((notif) => (
                <Link
                  key={notif.id}
                  href={`/applicants/${notif.id}`}
                  className={`${styles.notificationItem} ${!notif.isRead ? styles.unread : ""}`}
                  onClick={() => setIsOpen(false)}
                >
                  <div className={styles.notifContent}>
                    <div className={styles.notifTitle}>
                      <span className={styles.companyName}>{notif.companyName}</span>
                      {!notif.isRead && <span className={styles.newDot}>●</span>}
                    </div>
                    <div className={styles.notifJob}>{notif.jobTitle}</div>
                    <div className={styles.notifStatus}>
                      <span style={{ color: getStatusColor(notif.applicationStatus) }}>
                        {getStatusText(notif.applicationStatus)}
                      </span>
                      <span className={styles.notifTime}>
                        {new Date(notif.appliedAt).toLocaleDateString("vi-VN")}
                      </span>
                    </div>
                  </div>
                </Link>
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
