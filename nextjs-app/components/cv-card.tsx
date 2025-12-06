"use client";
import type { ResumeData } from "./resume-builder";

import { Check, Eye } from "lucide-react";

import styles from "./cv-card.module.css";
import { ResumeCardItem } from "./resume-card-item";
import { useState } from "react";
import { exportResumeToPDF } from "./pdf-export";

interface CVCardProps {
  resume: ResumeData;
  onEdit: () => void;
  onDelete: () => void;
  onPreview: () => void;
}

export function CVCard({ resume, onEdit, onDelete, onPreview }: CVCardProps) {
  const [download, setDownload] = useState(false);
  console.log("Resume in CVCard:", resume);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  };

  // Đánh dấu hàm là async
  const handleDownload = async () => {
    try {
      await exportResumeToPDF(resume, (resume)?.template || "modern");
      setDownload(true);
      setTimeout(() => setDownload(false), 2000);
    } catch {
      setDownload(false); // Xử lý lỗi nếu có
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.previewContainer}>
        <div className={styles.previewWrapper}>
          <ResumeCardItem
            data={resume}
            template={(resume)?.template || "modern"}
            // isCompact
          />
        </div>
        <div className={styles.overlay}>
          <div className={styles.actions}>
            {/* xem cv  */}
            <button
              className={styles.editButton}
              onClick={onPreview}
              title="Xem"
            >
              <Eye size={20} />
            </button>
            {/* chỉnh sửa */}
            <button
              className={styles.editButton}
              onClick={onEdit}
              title="Chỉnh sửa"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </button>
            {/* xóa */}
            <button
              className={styles.deleteButton}
              onClick={onDelete}
              title="Xóa"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="3,6 5,6 21,6" />
                <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2" />
                <line x1="10" y1="11" x2="10" y2="17" />
                <line x1="14" y1="11" x2="14" y2="17" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className={styles.info}>
        <h3 className={styles.name} style={{ marginBottom: 6 }}>
          {resume?.personalInfo?.fullName || "CV không có tên"}
        </h3>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 8,
          }}
        >
          <p className={styles.date} style={{ margin: 0 }}>
            Cập nhật {formatDate(new Date())}
          </p>
          <button
            className={styles.downloadButton}
            title="Tải xuống CV"
            style={{
              background: "none",
              border: "none",
              padding: 0,
              cursor: "pointer",
            }}
            onClick={handleDownload}
            disabled={download}
          >
            {download ? (
              <Check size={20} color="#16a34a" />
            ) : (
              <svg
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
