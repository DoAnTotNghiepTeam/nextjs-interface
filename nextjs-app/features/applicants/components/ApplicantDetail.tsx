
"use client";

import { useEffect, useState } from "react";
import {
  applicantService,
  ApplicantTimeline,
} from "../services/applicant.service";
import { Applicant } from "@/types/applicant";
import styles from "../../../styles/ApplicantDetail.module.css"; // css riêng cho component
import { Timeline } from "./Timeline";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type Props = { id: number };

export default function ApplicantDetail({ id }: Props) {

    const { data: session, status } = useSession();
  const router = useRouter();
  //  const searchParams = useSearchParams();

  // //  // Lấy ID ứng viên từ query param
  // // const idParam = searchParams.get("id");
  // // const id = idParam ? parseInt(idParam) : null;

  const [applicant, setApplicant] = useState<Applicant | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeline, setTimeline] = useState<ApplicantTimeline[]>([]);


    // ---------- Redirect nếu chưa login ----------
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/page-signin");
    }
  }, [status, router]);


  // Fetch applicant detail + timeline
  // Fetch detail + timeline
  const fetchData = async () => {
      if (!session || !id) return; // Chờ login + có ID
    try {
      setLoading(true);
      const res = await applicantService.getApplicantTracking(id);
      setApplicant(res.data.detail ?? null);
      console.log("Applicant detail:", res.data.detail);
      setTimeline(res.data.timeline?.map((stepOrder: ApplicantTimeline) => ({ ...stepOrder })) ?? []);
    } catch (err) {
      console.error("Error fetching applicant data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // const unsubscribe = applicantService.subscribeApplicant(id, (data) => {
    //   if (data.detail) setApplicant((prev) => ({ ...prev, ...data.detail }));
    //   if (data.timeline) setTimeline(data.timeline);
    // });

    // return () => unsubscribe();
  }, [session, id]);

  // useEffect(() => {
  //   const fetchDetail = async () => {
  //     try {
  //       const res = await applicantService.getApplicantDetail(id);
  //       setApplicant(res.data ?? null);

  //       console.log("Applicant detail:", res.data);
  //     } catch (err) {
  //       console.error("Error fetching applicant detail:", err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchDetail();
  // }, [id]);

  // const handleResume = async (filename: string) => {
  //   try {
  //     const res = await applicantService.getResumeLink(filename);
  //     const contentType =
  //       res.headers["content-type"] || "application/octet-stream";
  //     const blob = new Blob([res.data], { type: contentType });
  //     const url = window.URL.createObjectURL(blob);

  //     if (contentType === "application/pdf") {
  //       // PDF mở trực tiếp
  //       window.open(url, "_blank");
  //     } else {
  //       // Các file khác download
  //       const link = document.createElement("a");
  //       link.href = url;
  //       link.setAttribute("download", filename);
  //       document.body.appendChild(link);
  //       link.click();
  //       link.remove();
  //     }

  //     // Giải phóng memory
  //     window.URL.revokeObjectURL(url);
  //   } catch (err) {
  //     console.error("Error downloading resume:", err);
  //   }
  // };

  const handleResume = async (firebaseUrl: string) => {
    try {
      // Lấy tên file từ URL Firebase
      const getFilenameFromFirebaseUrl = (url: string) => {
        const decoded = decodeURIComponent(url);
        const parts = decoded.split("/");
        const lastPart = parts[parts.length - 1]; // ..._NguyenThanhHoan.pdf?alt=media
        return lastPart.split("?")[0]; // bỏ query params
      };

      const filename = getFilenameFromFirebaseUrl(firebaseUrl);

      // Gọi API backend để lấy blob
      const res = await applicantService.getResumeLink(firebaseUrl);

      // Tạo object URL từ blob
      const blob = new Blob([res.data], {
        type: res.data.type || "application/octet-stream",
      });
      const fileURL = window.URL.createObjectURL(blob);

      if (filename.endsWith(".pdf")) {
        // Mở PDF trực tiếp
        window.open(fileURL, "_blank");
      } else {
        // Download file khác
        const link = document.createElement("a");
        link.href = fileURL;
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
      }

      // Giải phóng memory
      window.URL.revokeObjectURL(fileURL);

      console.log(`Resume opened/downloaded: ${filename}`);
    } catch (error) {
      console.error("Error previewing resume:", error);
    }
  };

   // ---------- Fallback UI ----------
  if (status === "loading" || !session)
    return <p className="text-center py-20">Loading / Redirecting...</p>;

  if (!id) return <p>No applicant ID provided in URL.</p>;
  if (loading) return <p>Loading applicant data...</p>;
  if (!applicant) return <p>Applicant not found.</p>;
  return (
    <div className={styles.card}>
     {/* Cột trái - Chi tiết đơn */}
      <div className={styles.detailColumn}>
        <div className={styles.headerRow}>
          <h3 className={styles.title}>Application Detail</h3>
          {applicant.resumeLink && (
            <button className={styles.btn} onClick={() => handleResume(applicant.resumeLink!)}>
              View / Download Resume
            </button>
          )}
        </div>

       <div className={styles.infoGrid}>
  <div className={styles.infoItem}>
    <strong>Candidate Name</strong>
    <span>{applicant.fullName}</span>
  </div>
  <div className={styles.infoItem}>
    <strong>Job Title</strong>
    <span>{applicant.jobTitle}</span>
  </div>
  {applicant.companyName && (
    <div className={styles.infoItem}>
      <strong>Company</strong>
      <span>{applicant.companyName}</span>
    </div>
  )}
  {applicant.location_company && (
    <div className={styles.infoItem}>
      <strong>Location</strong>
      <span>{applicant.location_company}</span>
    </div>
  )}
  {applicant.salaryRange && (
    <div className={styles.infoItem}>
      <strong>Salary</strong>
      <span>{applicant.salaryRange}</span>
    </div>
  )}
</div>

{applicant.coverLetter && (
  <p className={styles.coverLetter}>
    <strong>Cover Letter:</strong> {applicant.coverLetter}
  </p>
)}

<div className={styles.infoGrid}>
  <div className={styles.infoItem}>
    <strong>Application Status</strong>
    <span>{applicant.applicationStatus}</span>
  </div>
  <div className={styles.infoItem}>
    <strong>Applied At</strong>
    <span>{applicant.appliedAt}</span>
  </div>
</div>

{applicant.skillMatchPercent !== undefined && (
  <div className={styles.infoGrid}>
    <div className={styles.infoItem}>
      <strong>Skill Match</strong>
      <span>{applicant.skillMatchPercent}%</span>
    </div>
    {applicant.missingSkills && applicant.missingSkills.length > 0 && (
      <div className={styles.infoItem}>
        <strong>Missing Skills</strong>
        <span>{applicant.missingSkills.join(", ")}</span>
      </div>
    )}
    {applicant.experienceYears !== null && (
      <div className={styles.infoItem}>
        <strong>Experience</strong>
        <span>
          {applicant.experienceYears} years (Min: {applicant.minExperience})
        </span>
      </div>
    )}
  </div>
)}

      </div>

      {/* Cột phải - Timeline + History */}
      <div className={styles.timelineColumn}>
        <h4 className={styles.subtitle}>Timeline</h4>
        <Timeline steps={timeline} />

        {/* {applicant.history && applicant.history.length > 0 && (
          <div className="mt-6">
            <h5 className={styles.subtitle}>History</h5>
            <ul className={styles.historyList}>
              {applicant.history.map((h, idx) => (
                <li key={idx} className={styles.historyItem}>
                  <strong>{h.status}</strong> - {h.note || "No note"}
                  <span className={styles.historyMeta}>
                    ({new Date(h.changedAt).toLocaleString()} by {h.changedBy})
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )} */}
      </div>
    </div>
  );
}
