// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { useState } from "react";
// import { applicantService } from "../services/applicant.service";
// import { toast } from "react-toastify";
// import styles from "../../../styles/ApplyJob.module.css"; // css riêng cho component

// import { FileText, Upload, Pencil, X } from "lucide-react";
// import {  Applicant, JobPostingResponseDTO, Resume } from "@/types/applicant";

// import { AxiosProgressEvent } from "axios";
// import { ApiResponse } from "@/types/api";


// interface ApplyJobProps {
//   job: JobPostingResponseDTO;
//   resumes: Resume[];
//   onClose: () => void;
//   onSuccess: () => void;
// }

// export default function ApplyJob({
//   job,
//   resumes,
//   onClose,
//   onSuccess,
// }: ApplyJobProps) {
//   const [selectedResumeId, setSelectedResumeId] = useState<string>("");
//   const [message, setMessage] = useState("");
//   const [file, setFile] = useState<File | null>(null);
//   const [progress, setProgress] = useState(0);
//   const [submitting, setSubmitting] = useState(false);

//   const handleSubmit = async () => {
//     if (!selectedResumeId && !file) {
//       toast.error("Vui lòng chọn Resume hoặc upload file!");
//       return;
//     }

//     try {
//       setSubmitting(true);
//       setProgress(0);

//       const formData = new FormData();
//       if (selectedResumeId) formData.append("resumesId", selectedResumeId);
//       if (file) formData.append("resumeFile", file);
//       if (message) formData.append("coverLetter", message);

//         const res = await applicantService.applyJobWithFile(job.id, formData, {
//         onUploadProgress: (event: AxiosProgressEvent) => {
//           if (event.total) {
//             setProgress(Math.round((event.loaded * 100) / event.total));
//           }
//         },
//       });

//     const data = res.data as ApiResponse<Applicant>;
//       console.log("Apply job response:", data);

//       if (data?.data?.missingSkills?.length) {
//         toast.warning("Lack of skills: " + data.data.missingSkills.join(", "));
//       }
//       if (data?.data?.skillMatchMessage) {
//         toast.warning(data?.data?.skillMatchMessage || "");
//       }
//       if (data?.data?.minExperience) {
//         toast.info(data?.data?.minExperience || "");
//       }
//       onSuccess();
//       onClose();
//     } catch (err: unknown) {
//       const error = err as { response?: { data?: { message?: string } } };
//       const msg = error.response?.data?.message || "❌ Apply thất bại!";
//       toast.error(msg);
//     } finally {
//       setSubmitting(false);
//       setProgress(0);
//     }
//   };

//   return (
//     <div className="modal-overlay">
//       <div className="modal-box">
//         <button className="modal-close" onClick={onClose}>
//           ✕
//         </button>

//         {/* Title */}
//         <h2 className={styles["modal-title"]}>
//         <span className="job-title">{job.title}</span>
//         </h2>

//         {/* Select Resume */}
//         <div className="modal-field">
//           <div className="field-input">
//             <select
//               className={styles["custom-select"]}
//               value={selectedResumeId}
//               onChange={(e) => setSelectedResumeId(e.target.value)}
//             >
//               <option value="">-- Select Resume --</option>
//               {resumes.map((resume: Resume) => (
//                 <option key={resume.id} value={resume.id}>
//                   { `Resume #${resume.fullName}`}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>

//         {/* Upload file */}
//         <div className="modal-field">
//           <div className="field-input">
//             <label className={styles["upload-label"]}>
//               <Upload size={20} />
//               Upload Resume File
//             </label>

//             {!file ? (
//               <label className={styles["upload-box"]}>
//                 <input
//                   type="file"
//                   style={{ display: "none" }}
//                   onChange={(e) => {
//                     const selectedFile = e.target.files?.[0];
//                     if (selectedFile) setFile(selectedFile);
//                   }}
//                 />
//                 <Upload size={36} />
//                 <span>Click to upload or drag & drop</span>
//               </label>
//             ) : (
//               <div className={styles["upload-preview"]}>
//                 <FileText size={20} />
//                 <span>
//                   {file.name} ({(file.size / 1024).toFixed(1)} KB)
//                 </span>
//                 <button onClick={() => setFile(null)} type="button">
//                   <X size={14} />
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Cover letter */}
//         <div className="modal-field">
//           <div className="field-input">
//             <label className={styles["cover-label"]}>
//               <Pencil size={20} /> Cover Letter
//             </label>
//             <textarea
//               placeholder="Write a short cover letter..."
//               value={message}
//               onChange={(e) => setMessage(e.target.value)}
//               rows={4}
//             />
//           </div>
//         </div>

//         {/* Progress bar */}
//         {progress > 0 && (
//           <div className="progress-bar">
//             <div
//               className="progress-fill"
//               style={{ width: `${progress}%` }}
//             ></div>
//           </div>
//         )}

//         {/* Actions */}
//         <div className="modal-actions">
//           <button className="btn-cancel" onClick={onClose}>
//             Cancel
//           </button>
//           <button
//             className="btn-submit"
//             onClick={handleSubmit}
//             disabled={submitting}
//           >
//             {submitting ? "Applying..." : "Submit"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { applicantService } from "../services/applicant.service";
import { toast } from "react-toastify";
import styles from "../../../styles/ApplyJob.module.css";

import { FileText, Upload, Pencil, X } from "lucide-react";
import { Applicant, JobPostingResponseDTO, Resume } from "@/types/applicant";

import { AxiosProgressEvent } from "axios";
import { ApiResponse } from "@/types/api";

interface ApplyJobProps {
  job: JobPostingResponseDTO;
  resumes: Resume[];
  onClose: () => void;
  onSuccess: () => void;
}

export default function ApplyJob({
  job,
  resumes,
  onClose,
  onSuccess,
}: ApplyJobProps) {
  const [selectedResumeId, setSelectedResumeId] = useState<string>("");
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  // 👉 State preview %
  const [previewPercent, setPreviewPercent] = useState<number | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);

  // ✅ Hàm preview khi user chọn Resume hoặc File
  const handlePreview = async (resumeId?: string, resumeFile?: File | null) => {
    if (!resumeId && !resumeFile) {
      setPreviewPercent(null);
      return;
    }

    const formData = new FormData();
    if (resumeId) formData.append("resumesId", resumeId);
    if (resumeFile) formData.append("resumeFile", resumeFile);

    try {
      setPreviewLoading(true);
      const res = await applicantService.previewApplication(job.id, formData);
      console.log("Preview response raw:", res);        // log toàn bộ response
  console.log("Preview response data:", res.data);  // log data chính
      const percent = res.data.skillMatchPercent;

      console.log("Percent:", percent);
      setPreviewPercent(percent);
    } catch (err) {
      console.error("Preview CV error", err);
      toast.error("Không preview được CV");
      setPreviewPercent(null);
    } finally {
      setPreviewLoading(false);
    }
  };

  // Gọi preview mỗi khi chọn Resume hoặc File
  useEffect(() => {
    handlePreview(selectedResumeId, file);
  }, [selectedResumeId, file]);

  // ✅ Submit chính thức
  const handleSubmit = async () => {
    if (!selectedResumeId && !file) {
      toast.error("Vui lòng chọn Resume hoặc upload file!");
      return;
    }

    try {
      setSubmitting(true);
      setProgress(0);

      const formData = new FormData();
      if (selectedResumeId) formData.append("resumesId", selectedResumeId);
      if (file) formData.append("resumeFile", file);
      if (message) formData.append("coverLetter", message);

      const res = await applicantService.applyJobWithFile(job.id, formData, {
        onUploadProgress: (event: AxiosProgressEvent) => {
          if (event.total) {
            setProgress(Math.round((event.loaded * 100) / event.total));
          }
        },
      });

      const data = res.data as ApiResponse<Applicant>;
      console.log("Apply job response:", data);

      if (data?.data?.missingSkills?.length) {
        toast.warning("Lack of skills: " + data.data.missingSkills.join(", "));
      }
      if (data?.data?.skillMatchMessage) {
        toast.warning(data?.data?.skillMatchMessage || "");
      }
      if (data?.data?.minExperience) {
        toast.info(data?.data?.minExperience || "");
      }

      onSuccess();
      onClose();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      const msg = error.response?.data?.message || "❌ Apply thất bại!";
      toast.error(msg);
    } finally {
      setSubmitting(false);
      setProgress(0);
    }
  };

  const modalContent = (
    <div className="modal-overlay">
      <div className="modal-box">
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>

        {/* Title */}
        <h2 className={styles["modal-title"]}>
          <span className="job-title">{job.title}</span>
        </h2>

        {/* Select Resume */}
        <div className="modal-field">
          <div className="field-input">
            <select
              className={styles["custom-select"]}
              value={selectedResumeId}
              onChange={(e) => setSelectedResumeId(e.target.value)}
            >
              <option value="">-- Select Resume --</option>
              {resumes.map((resume: Resume) => (
                <option key={resume.id} value={resume.id}>
                  {`Resume #${resume.fullName}`}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Upload file */}
        <div className="modal-field">
          <div className="field-input">
            <label className={styles["upload-label"]}>
              <Upload size={20} />
              Upload Resume File
            </label>

            {!file ? (
              <label className={styles["upload-box"]}>
                <input
                  type="file"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    const selectedFile = e.target.files?.[0];
                    if (selectedFile) setFile(selectedFile);
                  }}
                />
                <Upload size={36} />
                <span>Click to upload or drag & drop</span>
              </label>
            ) : (
              <div className={styles["upload-preview"]}>
                <FileText size={20} />
                <span>
                  {file.name} ({(file.size / 1024).toFixed(1)} KB)
                </span>
                <button onClick={() => setFile(null)} type="button">
                  <X size={14} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Preview tỷ lệ pass CV */}
        {previewLoading ? (
          <p>Đang tính toán tỷ lệ match...</p>
        ) : previewPercent !== null ? (
          <div
  style={{
    marginTop: "12px",
    padding: "14px 16px",
    borderRadius: "12px",
    background: "#f9fafb",
    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
  }}
>
  {/* Header */}
  <div
    style={{
      display: "flex",
      alignItems: "center",
      marginBottom: "8px",
      fontSize: "14px",
      fontWeight: 500,
    }}
  >
    <span style={{ marginRight: "6px", fontSize: "16px" }}>🎯</span>
    <span style={{ color: "#374151", marginRight: "6px" }}>
      Resume-Job Match Rate:
    </span>
    <span
      style={{
        fontWeight: 600,
        fontSize: "15px",
        color: previewPercent >= 50 ? "#16a34a" : "#dc2626",
      }}
    >
      {previewPercent != null ? `${previewPercent.toFixed(1)}%` : "--"}
    </span>
  </div>

  {/* Progress bar */}
  <div
    style={{
      width: "100%",
      height: "10px",
      backgroundColor: "#e5e7eb",
      borderRadius: "999px",
      overflow: "hidden",
    }}
  >
    <div
      style={{
        width: `${previewPercent}%`,
        height: "100%",
        background: "linear-gradient(90deg, #3b82f6, #06b6d4)",
        borderRadius: "999px",
        transition: "width 0.4s ease-in-out",
      }}
    ></div>
  </div>
</div>

        ) : null}

        {/* Cover letter */}
        <div className="modal-field">
          <div className="field-input">
            <label className={styles["cover-label"]}>
              <Pencil size={20} /> Cover Letter
            </label>
            <textarea
              placeholder="Write a short cover letter..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
            />
          </div>
        </div>

        {/* Upload progress bar */}
        {progress > 0 && (
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}

        {/* Actions */}
        <div className="modal-actions">
          <button className="btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn-submit"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? "Applying..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
}

