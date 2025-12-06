"use client";
import Layout from "@/components/Layout/Layout";
import Link from "next/link";
import React, { useEffect, useState } from "react";


interface Job {
  id: number;
  employerId: number;
  title: string;
  category?: string;
  location?: string;
  salaryRange?: string;
  jobType?: string;
  status?: string;
  endAt?: string;
  requiredDegree?: string;
  // add other fields as needed
}

import { useSession } from "next-auth/react";

export default function MyJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { data: session } = useSession();
  const accessToken = session?.accessToken;
  // Không cần lấy employerId từ session nữa

  useEffect(() => {
    async function fetchJobs() {
      setLoading(true);
      setMessage("");
      try {
        console.log("session:", session);
        console.log("accessToken:", accessToken);
        if (!session) {
          setJobs([]);
          setLoading(false);
          return;
        }
        const res = await fetch("http://localhost:8080/api/job-postings/all", {
          headers: {
            ...(accessToken ? { "Authorization": `Bearer ${accessToken}` } : {}),
          },
        });
        if (res.ok) {
          const data = await res.json();
          console.log("jobs data:", data);
            // Lọc job theo employerId (luôn lọc thủ công phía FE)
            const employerId = session?.user?.id;
            console.log("employerId:", employerId);
            const jobsArray: Job[] = Array.isArray(data) ? data : (data.jobs || []);
            const filteredJobs = jobsArray.filter((job: Job) => String(job.employerId) === String(employerId));
            console.log("filteredJobs:", filteredJobs);
            setJobs(filteredJobs);
            setCurrentPage(1);
        } else {
          setMessage("Lỗi khi lấy danh sách job");
        }
      } catch {
        setMessage("Lỗi kết nối API!");
      } finally {
        setLoading(false);
      }
    }
    fetchJobs();
  }, [accessToken, session]);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Bạn có chắc muốn xoá job này?")) return;
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(`http://localhost:8080/api/job-postings/${id}`, { 
          method: "DELETE", 
          headers: { 
            ...(accessToken ? { "Authorization": `Bearer ${accessToken}` } : {}), 
          }, 
        });
      if (res.ok) { 
        const newJobs = jobs.filter((job: Job) => job.id !== id);
        setJobs(newJobs);
        // adjust current page if needed
        const perPage = 10;
        const newTotal = Math.max(1, Math.ceil(newJobs.length / perPage));
        if (currentPage > newTotal) setCurrentPage(newTotal);
        setMessage("Xoá job thành công!");
      } else {
        setMessage("Lỗi khi xoá job");
      }
    } catch {
      setMessage("Lỗi kết nối API!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container pt-100 pb-100">
        {!session ? (
          <div className="text-center mt-5">
            <h2>Bạn cần đăng nhập để xem danh sách việc làm đã đăng</h2>
            <Link href="/page-signin" className="btn btn-primary mt-3">Đăng nhập</Link>
          </div>
        ) : (
          <>
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h2 className="mb-0 fw-bold" style={{ color: '#2a3b6a', display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{fontSize:32}}>📋</span>
                <span style={{fontSize:22}}>My Posted Jobs</span>
              </h2>
              <div>
                <Link href="/job-create" className="btn btn-success fw-bold px-4 py-2" style={{boxShadow: '0 6px 18px rgba(42,59,106,0.08)'}}>
                  + Create New Job
                </Link>
              </div>
            </div>
            {message && <div className="mb-3 text-danger text-center">{message}</div>}
            {loading ? (
              <div className="text-center">Loading...</div>
            ) : jobs.length === 0 ? (
              <div className="alert alert-info text-center">No jobs found.</div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover table-striped align-middle shadow-sm border rounded-4 overflow-hidden mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Title</th>
                      <th>Category</th>
                      <th>Location</th>
                      <th>Salary</th>
                      <th>Job Type</th>
                      <th>Status</th>
                      <th>Expiration</th>
                      <th>Degree</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(() => {
                      const perPage = 10;
                      const totalPages = Math.max(1, Math.ceil(jobs.length / perPage));
                      const start = (currentPage - 1) * perPage;
                      const pageJobs = jobs.slice(start, start + perPage);
                      return pageJobs.map((job: Job) => (
                      <tr key={job.id}>
                        <td className="fw-semibold" style={{maxWidth:220, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}} title={job.title}>{job.title}</td>
                        <td>{job.category || <span className="text-muted">-</span>}</td>
                        <td>{job.location || <span className="text-muted">-</span>}</td>
                        <td>{job.salaryRange || <span className="text-muted">-</span>}</td>
                        <td>
                          <span className="badge bg-info text-dark text-capitalize">{job.jobType || '-'}</span>
                        </td>
                        <td>
                          {String(job.status).toLowerCase() === 'active' ? (
                            <span className="badge bg-success">Active</span>
                          ) : (
                            <span className="badge bg-secondary">Closed</span>
                          )}
                        </td>
                        <td>{job.endAt ? job.endAt.slice(0,10) : <span className="text-muted">-</span>}</td>
                        <td>{job.requiredDegree || <span className="text-muted">-</span>}</td>
                        <td>
                          <div className="d-flex flex-column flex-sm-row align-items-stretch align-items-sm-center gap-2">
                            <Link href={`/job-edit/${job.id}`} className="btn btn-sm btn-primary text-white px-3 fw-semibold" style={{minWidth:72}}>
                              Edit
                            </Link>
                            <button className="btn btn-sm btn-outline-danger px-3 fw-semibold" onClick={() => handleDelete(job.id)} style={{minWidth:72}}>
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                      ));
                    })()}
                  </tbody>
                </table>

                {/* Pagination controls */}
                <div className="d-flex justify-content-between align-items-center mt-3">
                  <div className="text-muted">Showing {(jobs.length === 0) ? 0 : ( (currentPage-1)*10 + 1)} - {Math.min(currentPage*10, jobs.length)} of {jobs.length}</div>
                  <nav>
                    <ul className="pagination mb-0">
                      <li className={`page-item ${currentPage <= 1 ? 'disabled' : ''}`}>
                        <a className="page-link" href="#" onClick={(e) => { e.preventDefault(); if (currentPage > 1) setCurrentPage(currentPage-1); }}>Prev</a>
                      </li>
                      {Array.from({ length: Math.max(1, Math.ceil(jobs.length / 10)) }).map((_, i) => {
                        const page = i + 1;
                        return (
                          <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                            <a className="page-link" href="#" onClick={(e) => { e.preventDefault(); setCurrentPage(page); }}>{page}</a>
                          </li>
                        );
                      })}
                      <li className={`page-item ${currentPage >= Math.max(1, Math.ceil(jobs.length / 10)) ? 'disabled' : ''}`}>
                        <a className="page-link" href="#" onClick={(e) => { e.preventDefault(); if (currentPage < Math.max(1, Math.ceil(jobs.length / 10))) setCurrentPage(currentPage+1); }}>Next</a>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
            )}
          </>
        )}
      </div>
	</Layout>
  );
}
