
import { useEffect, useState } from "react";
import { savedJobService } from "@/features/applicants/services/savedJobService";
import Link from "next/link";
import styles from "../../../styles/SavedJobsList.module.css";
import { SavedJobResponseDTO } from "@/types/applicant";

export default function SavedJobsList() {
  const [savedJobs, setSavedJobs] = useState<SavedJobResponseDTO[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [removingId, setRemovingId] = useState<number | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchSavedJobs = async (page = 0) => {
    setLoading(true);
    try {
      const res = await savedJobService.getMySavedJobs({ page, size: 10 });
      const paginated = res.data;

      setSavedJobs(paginated.data.content || []);
      setTotalPages(paginated.data.totalPages || 1);
      setCurrentPage(paginated.data.pageNumber || 0);
      console.log("Saved jobs:", paginated.content);
      console.log("Saved jobs1:", paginated);
    } catch (err: unknown) {
  console.error("Error fetching saved jobs", err);
  setMessage({ type: "error", text: "Failed to load saved jobs" });
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (savedJobId: number) => {
    try {
      setRemovingId(savedJobId);
      await savedJobService.removeSavedJob(savedJobId);

      setSavedJobs(savedJobs.filter((job) => job.savedJobId !== savedJobId));
      setMessage({ type: "success", text: "Deleted successfully!" });
      setTimeout(() => setMessage(null), 3000);
    } catch (err: unknown) {
      console.error("Error removing saved job:", err);
      setMessage({
        type: "error",
        text: "Xóa thất bại: " + (err instanceof Error ? err.message : "Unknown error"),
      });
      setTimeout(() => setMessage(null), 5000);
    } finally {
      setRemovingId(null);
    }
  };

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  if (loading) return <p>Loading...</p>;

  // Custom pagination UI
  const renderPagination = () => {
    const pages = [];
    for (let i = 0; i < totalPages; i++) {
      pages.push(
        <button
          key={i}
          className={`${styles.pageBtn} ${i === currentPage ? styles.activePage : ""}`}
          onClick={() => fetchSavedJobs(i)}
        >
          {i + 1}
        </button>
      );
    }

    return (
      <div className={styles.pagination}>
        <button
          className={styles.pageBtn}
          disabled={currentPage === 0}
          onClick={() => fetchSavedJobs(currentPage - 1)}
        >
          Prev
        </button>
        {pages}
        <button
          className={styles.pageBtn}
          disabled={currentPage === totalPages - 1}
          onClick={() => fetchSavedJobs(currentPage + 1)}
        >
          Next
        </button>
      </div>
    );
  };

  return (
    <>
      {message && (
        <div className={`${styles.message} ${message.type === "success" ? styles.success : styles.error}`}>
          {message.text}
        </div>
      )}

      <div className={styles.wrapper}>
        {savedJobs.map((job) => (
          <div key={job.savedJobId} className={styles.card}>
            <div className={styles.header}>
              {/* <div className={styles.logo}>
                <Image
                  src={job.jobPostingResponseDTO.requiredDegree || "/default-logo.png"}
                  alt={job.jobPostingResponseDTO.employerName || "Company logo"}
                  width={40}
                  height={40}
                />
              </div> */}
              <div
                  className="image-box"
                  style={{
                    width: 58,
                    height: 58,
                    borderRadius: 8,
                    objectFit: "cover",
                  }}
                >
                  <img
                    src={
                      job.jobPostingResponseDTO.requiredDegree ||
                      "/assets/imgs/brands/brand-1.png"
                    }    
                    style={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      borderRadius: 8,
                      objectFit: "contain",
                      display: "block",
                      margin: "auto",
                    }}
                  />
                </div>
              
              <div className={styles.info}>
                <span className={styles.company}>{job.jobPostingResponseDTO.employerName}</span>
                <span className={styles.location}>{job.jobPostingResponseDTO.location}</span>
              </div>
            </div>

            <div className={styles.body}>
              <h6>
                <Link href={`/job-details/${job.jobPostingResponseDTO.id}`}>
                  {job.jobPostingResponseDTO.title}
                </Link>
              </h6>
              <p className={styles.description}>{job.jobPostingResponseDTO.description}</p>
            </div>

            <div className={styles.footer}>
              <button
                className={`${styles.btn} ${styles.delete}`}
                onClick={() => handleRemove(job.savedJobId)}
                disabled={removingId === job.savedJobId}
              >
                {removingId === job.savedJobId ? "Deleting..." : "Delete"}
              </button>
              <button className={`${styles.btn} ${styles.apply}`}> <Link href={`/job-details-2/${job.jobPostingResponseDTO.id}`}>
                                              View
                                              </Link></button>
            </div>
          </div>
        ))}
      </div>

      {/* Custom Pagination */}
      {renderPagination()}
    </>
  );
}
