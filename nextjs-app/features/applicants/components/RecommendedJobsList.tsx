"use client";
import { useEffect, useState } from "react";
import { fetchRecommendedJobs } from "@/lib/recommentJob/api";
import { useSession } from "next-auth/react";
import Link from "next/link";
import "./RecommendedJobsLists.css";

interface Job {
    jobPostingId: string;
    jobTitle: string;
    salary_range: string;
    location: string;
    logoUrl: string;
    description: string;
    companyName: string;
    major?: string;
}

const RecommendedJobsList = () => {
    const { data: session } = useSession();
    const candidateId = session?.user?.id ? Number(session.user.id) : 0;
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const jobsPerPage = 4;
    const totalPages = Math.ceil(jobs.length / jobsPerPage);

    useEffect(() => {
        if (candidateId) {
            setLoading(true);
            fetchRecommendedJobs(candidateId, 8, 30).then((data) => {
                if (data && data.recommendations) {
                    setJobs(data.recommendations);
                }
                setLoading(false);
            });
        }
    }, [candidateId]);

    const handleViewAll = () => {
        if (jobs[0]?.major) {
            window.location.href = `/jobs-grid?keyword=${encodeURIComponent(jobs[0].major)}`;
        } else {
            window.location.href = "/jobs-grid";
        }
    };

    // Lấy danh sách job cho trang hiện tại
    const pagedJobs = jobs.slice((page - 1) * jobsPerPage, page * jobsPerPage);

    return (
        <div className="recommended-jobs-list">
            <div className="recommended-jobs-header">
                <h3>
                    Jobs in <span>{jobs[0]?.major || ""}</span> that match your CV
                </h3>
                <button onClick={handleViewAll} className="btn-see-all">
                    <span>View All</span>
                </button>
            </div>
            <div className="recommended-job-list">
                {loading ? (
                    <p>Đang tải...</p>
                ) : jobs.length > 0 ? (
                    pagedJobs.map((job) => (
                        <div key={job.jobPostingId} className="recommended-job-card">
                            <div className="recommended-job-header">
                                <div className="recommended-job-logo-title">
                                    <div className="recommended-job-logo">
                                        {job.logoUrl ? (
                                            <img src={job.logoUrl} alt={job.companyName} />
                                        ) : (
                                            <span>{job.companyName?.[0]}</span>
                                        )}
                                    </div>
                                    <h4 className="recommended-job-title">
                                        <Link href={`/job-details-2/${job.jobPostingId}`}>
                                            <span>{job.jobTitle || "No title"}</span>
                                        </Link>
                                    </h4>
                                </div>
                            </div>
                            <p className="recommended-job-company">
                                {job.description?.length > 150
                                    ? job.description.substring(0, 150) + "..."
                                    : job.description}
                            </p>
                            <div className="recommended-job-tags">
                                <span>{job.salary_range}</span>
                                <span>{job.location}</span>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>Không tìm thấy việc làm phù hợp</p>
                )}
            </div>
            {/* Pagination */}
            {totalPages > 1 && (
                <div style={{ display: "flex", justifyContent: "center", marginTop: 20, gap: 8 }}>
                    <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        style={{ padding: "4px 12px", borderRadius: 6, border: "1px solid #2563eb", background: page === 1 ? "#e5e7eb" : "#fff", color: "#2563eb", cursor: page === 1 ? "not-allowed" : "pointer" }}
                    >
                        Prev
                    </button>
                    {Array.from({ length: totalPages }).map((_, idx) => (
                        <button
                            key={idx + 1}
                            onClick={() => setPage(idx + 1)}
                            style={{
                                padding: "4px 10px",
                                borderRadius: 6,
                                border: page === idx + 1 ? "2px solid #2563eb" : "1px solid #d1d5db",
                                background: page === idx + 1 ? "#2563eb" : "#fff",
                                color: page === idx + 1 ? "#fff" : "#2563eb",
                                fontWeight: page === idx + 1 ? 600 : 400,
                                cursor: "pointer",
                            }}
                        >
                            {idx + 1}
                        </button>
                    ))}
                    <button
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        style={{ padding: "4px 12px", borderRadius: 6, border: "1px solid #2563eb", background: page === totalPages ? "#e5e7eb" : "#fff", color: "#2563eb", cursor: page === totalPages ? "not-allowed" : "pointer" }}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default RecommendedJobsList;