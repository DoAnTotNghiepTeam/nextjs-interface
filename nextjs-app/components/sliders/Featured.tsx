"use client";
/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useSession } from "next-auth/react";
import React, {useEffect, useState, useRef } from "react";

// Minimal Job shape for this slider (keeps changes small and safe)
interface Job {
  id: string;
  employerId?: string | null;
  title?: string;
  createdAt?: string | number | Date;
  companyLogo?: string;
  companyName?: string;
  location?: string;
  type?: string;
  description?: string;
  skills?: string[];
  salary?: string;
  salaryRange?: string;
}

const FeaturedSlider = () => {
  // active state not used in this presentational slider; remove to avoid lint noise
  // preserve auth side-effects but we don't use session value here
  useSession();
      // Hook lấy dữ liệu job từ API
  const [jobs, setJobs] = useState<Job[]>([]);
      const [jobsLoading, setJobsLoading] = useState(false);
      const [jobsError, setJobsError] = useState("");
  
    useEffect(() => {
      const fetchJobs = async () => {
        setJobsLoading(true);
        setJobsError("");
        try {
          const res = await fetch("http://localhost:8080/api/job-postings/all");
          if (!res.ok) throw new Error("Không thể lấy danh sách công việc");
          const data = await res.json();
          setJobs(data);
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : String(err);
          setJobsError(message || "Lỗi không xác định");
        } finally {
          setJobsLoading(false);
        }
      };
      fetchJobs();
    }, []);

    // Drag-to-scroll refs and handlers
    const containerRef = useRef<HTMLDivElement | null>(null);
    const isDown = useRef(false);
    const startX = useRef(0);
    const scrollLeft = useRef(0);

    const onMouseDown = (e: React.MouseEvent) => {
      const container = containerRef.current;
      if (!container) return;
      isDown.current = true;
      container.classList.add('dragging');
      startX.current = e.pageX - container.offsetLeft;
      scrollLeft.current = container.scrollLeft;
    };

    const onMouseLeave = () => {
      const container = containerRef.current;
      if (!container) return;
      isDown.current = false;
      container.classList.remove('dragging');
    };

    const onMouseUp = () => {
      const container = containerRef.current;
      if (!container) return;
      isDown.current = false;
      container.classList.remove('dragging');
    };

    const onMouseMove = (e: React.MouseEvent) => {
      const container = containerRef.current;
      if (!container || !isDown.current) return;
      e.preventDefault();
      const x = e.pageX - container.offsetLeft;
      const walk = (x - startX.current) * 1; // scroll-fast multiplier
      container.scrollLeft = scrollLeft.current - walk;
    };

    // Touch support
    const onTouchStart = (e: React.TouchEvent) => {
      const container = containerRef.current;
      if (!container) return;
      isDown.current = true;
      startX.current = e.touches[0].pageX - container.offsetLeft;
      scrollLeft.current = container.scrollLeft;
    };

    const onTouchMove = (e: React.TouchEvent) => {
      const container = containerRef.current;
      if (!container || !isDown.current) return;
      const x = e.touches[0].pageX - container.offsetLeft;
      const walk = (x - startX.current) * 1;
      container.scrollLeft = scrollLeft.current - walk;
    };

    const onTouchEnd = () => {
      isDown.current = false;
      const container = containerRef.current;
      if (container) container.classList.remove('dragging');
    };

    // Helper: parse minimum salary in millions (triệu). Returns number in millions or null if cannot parse.
    const parseSalaryMin = (raw?: string | null) : number | null => {
      if (!raw || typeof raw !== 'string') return null;
      const s = raw.toLowerCase().replace(/\s+/g, ' ').trim();
      // find range like 25–35 or 25-35 or 25 to 35
      const rangeRe = /([\d.,]+)\s*(?:–|-|to)\s*([\d.,]+)/;
      const singleRe = /([\d.,]+)/;

      let numStr: string | null = null;
      const rangeMatch = s.match(rangeRe);
      if (rangeMatch) {
        numStr = rangeMatch[1]; // take lower bound
      } else {
        const m = s.match(singleRe);
        if (m) numStr = m[1];
      }
      if (!numStr) return null;
      const normalized = numStr.replace(/,/g, '.');
      const val = parseFloat(normalized);
      if (isNaN(val)) return null;

      // Determine unit
      if (s.includes('tri') || s.includes('tr') || s.includes('triệu')) {
        return val; // already in millions
      }
      if (s.includes('k') && !s.includes('tr')) {
        // thousands, convert to millions
        return val / 1000;
      }
      // if value is large (>1000) assume it's VND (e.g., 30000000) -> convert to millions
      if (val > 1000) return val / 1_000_000;

      // default assume millions
      return val;
    };

  return (
    <>
      <div
        ref={containerRef}
        style={{ overflowX: 'auto', padding: 0, boxSizing: 'border-box' }}
        className="featured-scroll w-100"
        onMouseDown={onMouseDown}
        onMouseLeave={onMouseLeave}
        onMouseUp={onMouseUp}
        onMouseMove={onMouseMove}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
  <div className="d-flex flex-row flex-nowrap justify-content-start align-items-stretch" style={{ gap: "24px", paddingLeft: '24px' }}>
        {jobsLoading && <div className="text-center w-100">Đang tải dữ liệu...</div>}
        {jobsError && <div className="text-center text-danger w-100">{jobsError}</div>}
        {!jobsLoading && !jobsError && jobs.length === 0 && <div className="text-center w-100">Không có công việc nào</div>}
        {!jobsLoading && !jobsError && jobs.length > 0 &&
          jobs
            .slice()
            .filter((job: Job) => {
              const salaryStr = (job.salaryRange && job.salaryRange.toString()) || (job.salary && job.salary.toString()) || '';
              const min = parseSalaryMin(salaryStr);
              return min !== null && min >= 30;
            })
            .sort((a, b) => (Date.parse(String(b.createdAt || '0')) || 0) - (Date.parse(String(a.createdAt || '0')) || 0))
            .slice(0, 7)
            .map((job: Job) => (
              <div key={job.id} style={{ minWidth: 320, maxWidth: 340, flex: "0 0 auto" }}>
                <div className="card-grid-2 hover-up h-100">
                  <div className="card-grid-2-image-left">
                    <span className="flash" />
                    <div className="image-box">
                      <img src={job.companyLogo || "/assets/imgs/brands/brand-1.png"} alt={job.companyName || "Company"} style={{ width: 48, height: 48, borderRadius: 8, objectFit: 'cover' }} />
                    </div>
                    <div className="right-info">
                      <span className="fw-bold" style={{ fontSize: '1.08rem', color: '#222' }}>{job.companyName || 'Company'}</span>
                      <div className="d-flex align-items-center font-xs color-text-paragraph mt-1">
                        <i className="fi-rr-marker mr-5" />
                        {job.location || 'Unknown'}
                      </div>
                    </div>
                  </div>
                  <div className="card-block-info">
                    <h6>
                      <Link href={`/job-details-2/${job.id}`}>
                        <span>{job.title || "No title"}</span>
                      </Link>
                    </h6>
                    <div className="mt-5">
                      <span className="card-briefcase">{job.type || "Fulltime"}</span>
                      <span className="card-time">{job.createdAt ? new Date(job.createdAt).toLocaleDateString() : ""}</span>
                    </div>
                    <p
                      className="font-sm color-text-paragraph mt-15"
                      style={{
                        maxWidth: '100%',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        marginBottom: 0
                      }}
                      title={job.description || "Không có mô tả"}
                    >
                      {job.description || "Không có mô tả"}
                    </p>
                    <div className="mt-30">
                      {Array.isArray(job.skills) && job.skills.map((skill: string, idx: number) => (
                        <span key={idx} className="btn btn-grey-small mr-5">{skill}</span>
                      ))}
                    </div>
                    <div className="card-2-bottom mt-30">
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-baseline" style={{ gap: 6 }}>
                          <span className="card-text-price" style={{ fontSize: '1rem', color: '#2A6DF5', fontWeight: 700, letterSpacing: '0.5px', lineHeight: 1 }}>
                            {job.salaryRange && job.salaryRange.trim() !== "" ? job.salaryRange : (job.salary && job.salary.trim() !== "" ? job.salary : "N/A")}
                          </span>
                          <span className="text-muted" style={{ fontSize: '0.85rem' }}>/Tháng</span>
                        </div>
                        <button className="btn btn-apply-now">Apply</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
      <style jsx>{`
        .featured-scroll {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }
        .featured-scroll::-webkit-scrollbar { display: none; } /* Chrome, Safari */
        .featured-scroll .dragging { cursor: grabbing; }
        .featured-scroll.dragging { cursor: grabbing; }
        .featured-scroll { cursor: grab; }
      `}</style>
    </>
  );
};

export default FeaturedSlider;