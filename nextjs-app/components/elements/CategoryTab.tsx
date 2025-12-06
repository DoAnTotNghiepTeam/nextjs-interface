"use client";
/* eslint-disable @next/next/no-img-element */
import React, {useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { getCompanyByEmployerId } from "@/lib/company/api";

import { useRouter } from "next/navigation";
import { savedJobService } from "@/features/applicants/services/savedJobService";
import {
  // Resume,
  SavedJobResponseDTO,
} from "@/types/applicant";
import { toast } from "react-toastify";
import { Bookmark } from "lucide-react";
import axios from "axios";
// import { applicantService } from "@/features/applicants/services/applicant.service";
// import ApplyJob from "@/features/applicants/components/ApplyJob";

// Minimal typed shapes used in this component to avoid `any` and keep logic unchanged
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

interface Company {
  logoUrl?: string;
  companyName?: string;
  location?: string;
}

const CategoryTab = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [companyInfoMap, setCompanyInfoMap] = useState<Record<string, Company | null>>({});
  useEffect(() => {
    const fetchCompanies = async () => {
      const jobsToShow = jobs
        .slice()
  .sort((a, b) => (Date.parse(String(b.createdAt || '0')) || 0) - (Date.parse(String(a.createdAt || '0')) || 0))
        .slice(0, 6);
      const employerIds = Array.from(
        new Set(jobsToShow.map((job: Job) => job.employerId).filter(Boolean) as string[])
      );
      const companyPromises = employerIds.map(async (employerId: string) => {
        try {
          const company = await getCompanyByEmployerId(employerId);
          return { employerId, company };
        } catch {
          return { employerId, company: null };
        }
      });
      const companyResults = await Promise.all(companyPromises);
      const companyMap: Record<string, Company | null> = {};
      companyResults.forEach(({ employerId, company }: { employerId: string; company: Company | null }) => {
        companyMap[employerId] = company;
      });
      setCompanyInfoMap(companyMap);
    };
    if (jobs && jobs.length > 0) fetchCompanies();
  }, [jobs]);
  const [active] = useState(1);
  // call useSession to preserve any auth-related side-effects; session value not used here
  useSession();
    // Hook lấy dữ liệu job từ API
   
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


     // Lấy dữ liệu Applyjob từ API  save job
      const { data: session } = useSession();
      // const [modalJob, setModalJob] = useState<Job | null>(null);
      // const [resumes, setResumes] = useState<Resume[]>([]);
      const router = useRouter();
      const [savingJobId, setSavingJobId] = useState<number | null>(null);
      // savedJobs: lưu cả jobId và savedJobId
      const [savedJobs, setSavedJobs] = useState<
        { jobId: number; savedJobId: number }[]
      >([]);


       // Xử lý mở  apply job
        const toggleSaveJob = async (jobId: number) => {
          if (!session) {
            toast.error("You need to login to saved job!");
            router.push("/page-signin"); // 👈 redirect sang trang login của bạn
            return;
          }
          const existing = savedJobs.find((j) => j.jobId === jobId);
          setSavingJobId(jobId);
          try {
            if (existing) {
              // Unsave dùng savedJobId
              await savedJobService.removeSavedJob(existing.savedJobId);
              setSavedJobs((prev) => prev.filter((j) => j.jobId !== jobId));
              toast.success("Removed successfully");
              console.log("Removed job:", existing);
              console.log("Removed job:", existing.savedJobId);
            } else {
              const res = await savedJobService.saveJob(jobId);
              setSavedJobs((prev) => [
                ...prev,
                { jobId, savedJobId: res.data.savedJobId },
              ]);
              toast.success("Saved successfully");
              console.log("Saved job:", res.data);
              console.log("Saved jobss:", res.data.savedJobId);
            }
          } catch (err) {
            if (err instanceof Error) {
              console.error("Error saving job", err.message);
            }
      
            // Nếu là lỗi từ Axios
            if (axios.isAxiosError(err)) {
              if (err.response?.status === 404 && existing) {
                setSavedJobs((prev) => prev.filter((j) => j.jobId !== jobId));
                toast.error("This job was not saved or already removed");
              } else {
                toast.error("Something went wrong");
              }
            }
          } finally {
            setSavingJobId(null);
          }
        };
      
        // const handleOpenApply = (job: Job) => {
        //   if (!session) {
        //     toast.error("You need to login to apply!");
        //     router.push("/page-signin"); // 👈 redirect sang trang login của bạn
        //     return;
        //   }
        //   setModalJob(job);
        // };
        // useEffect(() => {
        //   const fetchResumes = async () => {
        //     try {
        //       const res = await applicantService.getMyResumes();
        //       setResumes(res.data || []);
        //     } catch (err) {
        //       console.error("Error fetching resumes:", err);
        //     }
        //   };
        //   fetchResumes();
        // }, []);
        // Lấy danh sách saved jobs của user
        useEffect(() => {
          const fetchSavedJobs = async () => {
            if (!session) return;
            try {
              const res = await savedJobService.getMySavedJobs();
              const savedJobsMap =
                res.data.data.content?.map((job: SavedJobResponseDTO) => ({
                  jobId: job.jobPostingResponseDTO?.id, // 👈 lấy id từ DTO
                  savedJobId: job.savedJobId,
                })) || [];
              setSavedJobs(savedJobsMap);
            } catch (err) {
              console.error("Error fetching saved jobs", err);
            }
          };
          fetchSavedJobs();
        }, [session]);
        useEffect(() => {
          console.log(
            "Jobs:",
            jobs.map((j) => j.id)
          );
          console.log("SavedJobs:", savedJobs);
        }, [jobs, savedJobs]);
      
    
  return (
    <>
      <div className="mt-40 text-center">
        <span className="text-lg font-semibold text-gray-700">Some of the most recently posted jobs</span>
      </div>
      <div className="tab-content mt-70" id="myTabContent-1">
        <div className={`tab-pane fade ${active == 1 && "show active"}`}>
          <div className="row">

            {jobsLoading && <div className="col-12 text-center">Đang tải dữ liệu...</div>}
            {jobsError && <div className="col-12 text-center text-danger">{jobsError}</div>}
            {!jobsLoading && !jobsError && jobs.length === 0 && <div className="col-12 text-center">Không có công việc nào</div>}
            {!jobsLoading && !jobsError && jobs.length > 0 &&
              jobs
                .slice()
                .sort((a, b) => (Date.parse(String(b.createdAt || '0')) || 0) - (Date.parse(String(a.createdAt || '0')) || 0))
                .slice(0, 6)
                .map((job: Job) => {
                    const isSaved = savedJobs.some(
                            (j) => j.jobId === Number(job.id)
                          );
                  const company = job.employerId ? companyInfoMap[String(job.employerId)] : null;
                  return (
                    <div key={job.id} className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
                      <div className="card-grid-2 hover-up">
                        <div className="card-grid-2-image-left">
                            <span
                                    className="flash"
                                    style={{ marginRight: "20px" }}
                                  >
                                    <button
                                      onClick={() => toggleSaveJob(Number(job.id))}
                                      disabled={savingJobId === Number(job.id)}
                                      className="saved-job-button"
                                      style={{
                                        background: "transparent",
                                        border: "none",
                                        cursor: "pointer",
                                        padding: 0,
                                      }}
                                    >
                                      {savingJobId === Number(job.id) ? (
                                        <span className="loading-dots">
                                          ...
                                        </span>
                                      ) : (
                                        <Bookmark
                                          size={22}
                                          color={isSaved ? "red" : "gray"}
                                          fill={isSaved ? "red" : "none"}
                                        />
                                      )}
                                    </button>
                                  </span>
                          <div className="image-box" style={{ width: 48, height: 48 }}>
                                  <img
                                    src={company?.logoUrl || job.companyLogo || "/assets/imgs/brands/brand-1.png"}
                                    alt={company?.companyName || job.companyName || "Company"}
                                    style={{
                                      maxWidth: "100%",
                                      maxHeight: "100%",
                                      borderRadius: 8,
                                      objectFit: "contain", // hoặc "scale-down" để scale xuống khi quá lớn
                                      display: "block",
                                      margin: "auto"
                                    }}
                                  />
                                </div>
                          <div className="right-info">            
                            <span className="fw-bold" style={{ fontSize: '1.08rem', color: '#222', display: 'block', marginTop: 8 }}>
                              {company?.companyName || job.companyName || 'Company'}
                            </span>
                            <div className="d-flex align-items-center font-xs color-text-paragraph mt-1">
                              <i className="fi-rr-marker mr-5" />
                              {company?.location || job.location || 'Unknown'}
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
                            <div className="row">
                              <div className="col-lg-7 col-7">
                                <span className="card-text-price" style={{ fontSize: '1rem', color: '#2A6DF5', fontWeight: 700, letterSpacing: '0.5px', lineHeight: 1 }}>
                                  {job.salaryRange && job.salaryRange.trim() !== "" ? job.salaryRange : (job.salary && job.salary.trim() !== "" ? job.salary : "N/A")}
                                </span>
                                <span className="text-muted" style={{ fontSize: '0.85rem', marginLeft: 2 }}>/Tháng</span>
                              </div>
                              <div className="col-lg-5 col-5 text-end">
                                 <button
                                          // onClick={() => handleOpenApply(job)}
                                          className="btn btn-apply-now"
                                        >
                                          Apply
                                        </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

          </div>
               {/* Modal ApplyJob */}
                              {/* {modalJob && (
                                <ApplyJob
                                  job={modalJob}
                                  resumes={resumes}
                                  onClose={() => setModalJob(null)}
                                  onSuccess={() => toast.success("Applied successfully!")}
                                />
                              )} */}
        </div>
        <div className={`tab-pane fade ${active == 2 && "show active"}`}>
          <div className="row">
            <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12">
              <div className="card-grid-2 hover-up">
                <div className="card-grid-2-image-left">
                  <span className="flash" />
                  <div className="image-box">
                    <img src="assets/imgs/brands/brand-7.png" alt="jobBox" />
                  </div>
                  <div className="right-info">
                    <Link href="company-details">
                      <span className="name-job">Nintendo</span>
                    </Link>
                    <span className="location-small">New York, US</span>
                  </div>
                </div>
                <div className="card-block-info">
                  <h6>
                    <Link href="/job-details">
                      <span>Products Manager</span>
                    </Link>
                  </h6>
                  <div className="mt-5">
                    <span className="card-briefcase">Full time</span>
                    <span className="card-time">
                      6<span> minutes ago</span>
                    </span>
                  </div>
                  <p className="font-sm color-text-paragraph mt-15">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae architecto eveniet, dolor quo repellendus pariatur.</p>
                  <div className="mt-30">
                    <Link href="/job-details">
                      <span className="btn btn-grey-small mr-5">ASP .Net</span>
                    </Link>

                    <Link href="/job-details">
                      <span className="btn btn-grey-small mr-5">Figma</span>
                    </Link>
                  </div>
                  <div className="card-2-bottom mt-30">
                    <div className="row">
                      <div className="col-lg-7 col-7">
                        <span className="card-text-price">$250</span>
                        <span className="text-muted">/Hour</span>
                      </div>
                      <div className="col-lg-5 col-5 text-end">
                        <div className="btn btn-apply-now" data-bs-toggle="modal" data-bs-target="#ModalApplyJobForm">
                          Apply now
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12">
              <div className="card-grid-2 hover-up">
                <div className="card-grid-2-image-left">
                  <span className="flash" />
                  <div className="image-box">
                    <img src="assets/imgs/brands/brand-4.png" alt="jobBox" />
                  </div>
                  <div className="right-info">
                    <Link href="company-details">
                      <span className="name-job">Dailymotion</span>
                    </Link>
                    <span className="location-small">New York, US</span>
                  </div>
                </div>
                <div className="card-block-info">
                  <h6>
                    <Link href="/job-details">
                      <span>Frontend Developer</span>
                    </Link>
                  </h6>
                  <div className="mt-5">
                    <span className="card-briefcase">Full time</span>
                    <span className="card-time">
                      6<span> minutes ago</span>
                    </span>
                  </div>
                  <p className="font-sm color-text-paragraph mt-15">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae architecto eveniet, dolor quo repellendus pariatur.</p>
                  <div className="mt-30">
                    <Link href="/jobs-grid">
                      <span className="btn btn-grey-small mr-5">Typescript</span>
                    </Link>

                    <Link href="/jobs-grid">
                      <span className="btn btn-grey-small mr-5">Java</span>
                    </Link>
                  </div>
                  <div className="card-2-bottom mt-30">
                    <div className="row">
                      <div className="col-lg-7 col-7">
                        <span className="card-text-price">$250</span>
                        <span className="text-muted">/Hour</span>
                      </div>
                      <div className="col-lg-5 col-5 text-end">
                        <div className="btn btn-apply-now" data-bs-toggle="modal" data-bs-target="#ModalApplyJobForm">
                          Apply now
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12">
              <div className="card-grid-2 hover-up">
                <div className="card-grid-2-image-left">
                  <span className="flash" />
                  <div className="image-box">
                    <img src="assets/imgs/brands/brand-5.png" alt="jobBox" />
                  </div>
                  <div className="right-info">
                    <Link href="company-details">
                      <span className="name-job">Linkedin</span>
                    </Link>
                    <span className="location-small">New York, US</span>
                  </div>
                </div>
                <div className="card-block-info">
                  <h6>
                    <Link href="/job-details">
                      <span>React Native Web Developer</span>
                    </Link>
                  </h6>
                  <div className="mt-5">
                    <span className="card-briefcase">Fulltime</span>
                    <span className="card-time">
                      4<span> minutes ago</span>
                    </span>
                  </div>
                  <p className="font-sm color-text-paragraph mt-15">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae architecto eveniet, dolor quo repellendus pariatur</p>
                  <div className="mt-30">
                    <Link href="/jobs-grid">
                      <span className="btn btn-grey-small mr-5">Angular</span>
                    </Link>
                  </div>
                  <div className="card-2-bottom mt-30">
                    <div className="row">
                      <div className="col-lg-7 col-7">
                        <span className="card-text-price">$500</span>
                        <span className="text-muted">/Hour</span>
                      </div>
                      <div className="col-lg-5 col-5 text-end">
                        <div className="btn btn-apply-now" data-bs-toggle="modal" data-bs-target="#ModalApplyJobForm">
                          Apply now
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12">
              <div className="card-grid-2 hover-up">
                <div className="card-grid-2-image-left">
                  <span className="flash" />
                  <div className="image-box">
                    <img src="assets/imgs/brands/brand-8.png" alt="jobBox" />
                  </div>
                  <div className="right-info">
                    <Link href="company-details">
                      <span className="name-job">Periscope</span>
                    </Link>
                    <span className="location-small">New York, US</span>
                  </div>
                </div>
                <div className="card-block-info">
                  <h6>
                    <Link href="/job-details">
                      <span>Lead Quality Control QA</span>
                    </Link>
                  </h6>
                  <div className="mt-5">
                    <span className="card-briefcase">Full time</span>
                    <span className="card-time">
                      6<span> minutes ago</span>
                    </span>
                  </div>
                  <p className="font-sm color-text-paragraph mt-15">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae architecto eveniet, dolor quo repellendus pariatur.</p>
                  <div className="mt-30">
                    <Link href="/job-details">
                      <span className="btn btn-grey-small mr-5">iOS</span>
                    </Link>

                    <Link href="/job-details">
                      <span className="btn btn-grey-small mr-5">Laravel</span>
                    </Link>

                    <Link href="/job-details">
                      <span className="btn btn-grey-small mr-5">Golang</span>
                    </Link>
                  </div>
                  <div className="card-2-bottom mt-30">
                    <div className="row">
                      <div className="col-lg-7 col-7">
                        <span className="card-text-price">$250</span>
                        <span className="text-muted">/Hour</span>
                      </div>
                      <div className="col-lg-5 col-5 text-end">
                        <div className="btn btn-apply-now" data-bs-toggle="modal" data-bs-target="#ModalApplyJobForm">
                          Apply now
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12">
              <div className="card-grid-2 hover-up">
                <div className="card-grid-2-image-left">
                  <span className="flash" />
                  <div className="image-box">
                    <img src="assets/imgs/brands/brand-1.png" alt="jobBox" />
                  </div>
                  <div className="right-info">
                    <Link href="company-details">
                      <span className="name-job">LinkedIn</span>
                    </Link>
                    <span className="location-small">New York, US</span>
                  </div>
                </div>
                <div className="card-block-info">
                  <h6>
                    <Link href="/job-details">
                      <span>UI / UX Designer fulltime</span>
                    </Link>
                  </h6>
                  <div className="mt-5">
                    <span className="card-briefcase">Fulltime</span>
                    <span className="card-time">
                      4<span> minutes ago</span>
                    </span>
                  </div>
                  <p className="font-sm color-text-paragraph mt-15">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae architecto eveniet, dolor quo repellendus pariatur</p>
                  <div className="mt-30">
                    <Link href="/jobs-grid">
                      <span className="btn btn-grey-small mr-5">Adobe XD</span>
                    </Link>

                    <Link href="/jobs-grid">
                      <span className="btn btn-grey-small mr-5">Figma</span>
                    </Link>

                    <Link href="/jobs-grid">
                      <span className="btn btn-grey-small mr-5">Photoshop</span>
                    </Link>
                  </div>
                  <div className="card-2-bottom mt-30">
                    <div className="row">
                      <div className="col-lg-7 col-7">
                        <span className="card-text-price">$500</span>
                        <span className="text-muted">/Hour</span>
                      </div>
                      <div className="col-lg-5 col-5 text-end">
                        <div className="btn btn-apply-now" data-bs-toggle="modal" data-bs-target="#ModalApplyJobForm">
                          Apply now
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12">
              <div className="card-grid-2 hover-up">
                <div className="card-grid-2-image-left">
                  <span className="flash" />
                  <div className="image-box">
                    <img src="assets/imgs/brands/brand-2.png" alt="jobBox" />
                  </div>
                  <div className="right-info">
                    <Link href="company-details">
                      <span className="name-job">Adobe Ilustrator</span>
                    </Link>
                    <span className="location-small">New York, US</span>
                  </div>
                </div>
                <div className="card-block-info">
                  <h6>
                    <Link href="/job-details">
                      <span>Full Stack Engineer</span>
                    </Link>
                  </h6>
                  <div className="mt-5">
                    <span className="card-briefcase">Part time</span>
                    <span className="card-time">
                      5<span> minutes ago</span>
                    </span>
                  </div>
                  <p className="font-sm color-text-paragraph mt-15">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae architecto eveniet, dolor quo repellendus pariatur.</p>
                  <div className="mt-30">
                    <Link href="/jobs-grid">
                      <span className="btn btn-grey-small mr-5">React</span>
                    </Link>

                    <Link href="/jobs-grid">
                      <span className="btn btn-grey-small mr-5">NodeJS</span>
                    </Link>
                  </div>
                  <div className="card-2-bottom mt-30">
                    <div className="row">
                      <div className="col-lg-7 col-7">
                        <span className="card-text-price">$800</span>
                        <span className="text-muted">/Hour</span>
                      </div>
                      <div className="col-lg-5 col-5 text-end">
                        <div className="btn btn-apply-now" data-bs-toggle="modal" data-bs-target="#ModalApplyJobForm">
                          Apply now
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12">
              <div className="card-grid-2 hover-up">
                <div className="card-grid-2-image-left">
                  <span className="flash" />
                  <div className="image-box">
                    <img src="assets/imgs/brands/brand-3.png" alt="jobBox" />
                  </div>
                  <div className="right-info">
                    <Link href="company-details">
                      <span className="name-job">Bing Search</span>
                    </Link>
                    <span className="location-small">New York, US</span>
                  </div>
                </div>
                <div className="card-block-info">
                  <h6>
                    <Link href="/job-details">
                      <span>Java Software Engineer</span>
                    </Link>
                  </h6>
                  <div className="mt-5">
                    <span className="card-briefcase">Full time</span>
                    <span className="card-time">
                      6<span> minutes ago</span>
                    </span>
                  </div>
                  <p className="font-sm color-text-paragraph mt-15">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae architecto eveniet, dolor quo repellendus pariatur.</p>
                  <div className="mt-30">
                    <Link href="/jobs-grid">
                      <span className="btn btn-grey-small mr-5">Python</span>
                    </Link>

                    <Link href="/jobs-grid">
                      <span className="btn btn-grey-small mr-5">AWS</span>
                    </Link>

                    <Link href="/jobs-grid">
                      <span className="btn btn-grey-small mr-5">Photoshop</span>
                    </Link>
                  </div>
                  <div className="card-2-bottom mt-30">
                    <div className="row">
                      <div className="col-lg-7 col-7">
                        <span className="card-text-price">$250</span>
                        <span className="text-muted">/Hour</span>
                      </div>
                      <div className="col-lg-5 col-5 text-end">
                        <div className="btn btn-apply-now" data-bs-toggle="modal" data-bs-target="#ModalApplyJobForm">
                          Apply now
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12">
              <div className="card-grid-2 hover-up">
                <div className="card-grid-2-image-left">
                  <span className="flash" />
                  <div className="image-box">
                    <img src="assets/imgs/brands/brand-6.png" alt="jobBox" />
                  </div>
                  <div className="right-info">
                    <Link href="company-details">
                      <span className="name-job">Quora JSC</span>
                    </Link>
                    <span className="location-small">New York, US</span>
                  </div>
                </div>
                <div className="card-block-info">
                  <h6>
                    <Link href="/job-details">
                      <span>Senior System Engineer</span>
                    </Link>
                  </h6>
                  <div className="mt-5">
                    <span className="card-briefcase">Part time</span>
                    <span className="card-time">
                      5<span> minutes ago</span>
                    </span>
                  </div>
                  <p className="font-sm color-text-paragraph mt-15">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae architecto eveniet, dolor quo repellendus pariatur.</p>
                  <div className="mt-30">
                    <Link href="/job-details">
                      <span className="btn btn-grey-small mr-5">PHP</span>
                    </Link>

                    <Link href="/job-details">
                      <span className="btn btn-grey-small mr-5">Android</span>
                    </Link>
                  </div>
                  <div className="card-2-bottom mt-30">
                    <div className="row">
                      <div className="col-lg-7 col-7">
                        <span className="card-text-price">$800</span>
                        <span className="text-muted">/Hour</span>
                      </div>
                      <div className="col-lg-5 col-5 text-end">
                        <div className="btn btn-apply-now" data-bs-toggle="modal" data-bs-target="#ModalApplyJobForm">
                          Apply now
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={`tab-pane fade ${active == 3 && "show active"}`}>
          <div className="row">
            <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12">
              <div className="card-grid-2 hover-up">
                <div className="card-grid-2-image-left">
                  <span className="flash" />
                  <div className="image-box">
                    <img src="assets/imgs/brands/brand-4.png" alt="jobBox" />
                  </div>
                  <div className="right-info">
                    <Link href="company-details">
                      <span className="name-job">Dailymotion</span>
                    </Link>
                    <span className="location-small">New York, US</span>
                  </div>
                </div>
                <div className="card-block-info">
                  <h6>
                    <Link href="/job-details">
                      <span>Frontend Developer</span>
                    </Link>
                  </h6>
                  <div className="mt-5">
                    <span className="card-briefcase">Full time</span>
                    <span className="card-time">
                      6<span> minutes ago</span>
                    </span>
                  </div>
                  <p className="font-sm color-text-paragraph mt-15">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae architecto eveniet, dolor quo repellendus pariatur.</p>
                  <div className="mt-30">
                    <Link href="/jobs-grid">
                      <span className="btn btn-grey-small mr-5">Typescript</span>
                    </Link>

                    <Link href="/jobs-grid">
                      <span className="btn btn-grey-small mr-5">Java</span>
                    </Link>
                  </div>
                  <div className="card-2-bottom mt-30">
                    <div className="row">
                      <div className="col-lg-7 col-7">
                        <span className="card-text-price">$250</span>
                        <span className="text-muted">/Hour</span>
                      </div>
                      <div className="col-lg-5 col-5 text-end">
                        <div className="btn btn-apply-now" data-bs-toggle="modal" data-bs-target="#ModalApplyJobForm">
                          Apply now
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12">
              <div className="card-grid-2 hover-up">
                <div className="card-grid-2-image-left">
                  <span className="flash" />
                  <div className="image-box">
                    <img src="assets/imgs/brands/brand-5.png" alt="jobBox" />
                  </div>
                  <div className="right-info">
                    <Link href="company-details">
                      <span className="name-job">Linkedin</span>
                    </Link>
                    <span className="location-small">New York, US</span>
                  </div>
                </div>
                <div className="card-block-info">
                  <h6>
                    <Link href="/job-details">
                      <span>React Native Web Developer</span>
                    </Link>
                  </h6>
                  <div className="mt-5">
                    <span className="card-briefcase">Fulltime</span>
                    <span className="card-time">
                      4<span> minutes ago</span>
                    </span>
                  </div>
                  <p className="font-sm color-text-paragraph mt-15">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae architecto eveniet, dolor quo repellendus pariatur</p>
                  <div className="mt-30">
                    <Link href="/jobs-grid">
                      <span className="btn btn-grey-small mr-5">Angular</span>
                    </Link>
                  </div>
                  <div className="card-2-bottom mt-30">
                    <div className="row">
                      <div className="col-lg-7 col-7">
                        <span className="card-text-price">$500</span>
                        <span className="text-muted">/Hour</span>
                      </div>
                      <div className="col-lg-5 col-5 text-end">
                        <div className="btn btn-apply-now" data-bs-toggle="modal" data-bs-target="#ModalApplyJobForm">
                          Apply now
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12">
              <div className="card-grid-2 hover-up">
                <div className="card-grid-2-image-left">
                  <span className="flash" />
                  <div className="image-box">
                    <img src="assets/imgs/brands/brand-6.png" alt="jobBox" />
                  </div>
                  <div className="right-info">
                    <Link href="company-details">
                      <span className="name-job">Quora JSC</span>
                    </Link>
                    <span className="location-small">New York, US</span>
                  </div>
                </div>
                <div className="card-block-info">
                  <h6>
                    <Link href="/job-details">
                      <span>Senior System Engineer</span>
                    </Link>
                  </h6>
                  <div className="mt-5">
                    <span className="card-briefcase">Part time</span>
                    <span className="card-time">
                      5<span> minutes ago</span>
                    </span>
                  </div>
                  <p className="font-sm color-text-paragraph mt-15">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae architecto eveniet, dolor quo repellendus pariatur.</p>
                  <div className="mt-30">
                    <Link href="/job-details">
                      <span className="btn btn-grey-small mr-5">PHP</span>
                    </Link>

                    <Link href="/job-details">
                      <span className="btn btn-grey-small mr-5">Android</span>
                    </Link>
                  </div>
                  <div className="card-2-bottom mt-30">
                    <div className="row">
                      <div className="col-lg-7 col-7">
                        <span className="card-text-price">$800</span>
                        <span className="text-muted">/Hour</span>
                      </div>
                      <div className="col-lg-5 col-5 text-end">
                        <div className="btn btn-apply-now" data-bs-toggle="modal" data-bs-target="#ModalApplyJobForm">
                          Apply now
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12">
              <div className="card-grid-2 hover-up">
                <div className="card-grid-2-image-left">
                  <span className="flash" />
                  <div className="image-box">
                    <img src="assets/imgs/brands/brand-7.png" alt="jobBox" />
                  </div>
                  <div className="right-info">
                    <Link href="company-details">
                      <span className="name-job">Nintendo</span>
                    </Link>
                    <span className="location-small">New York, US</span>
                  </div>
                </div>
                <div className="card-block-info">
                  <h6>
                    <Link href="/job-details">
                      <span>Products Manager</span>
                    </Link>
                  </h6>
                  <div className="mt-5">
                    <span className="card-briefcase">Full time</span>
                    <span className="card-time">
                      6<span> minutes ago</span>
                    </span>
                  </div>
                  <p className="font-sm color-text-paragraph mt-15">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae architecto eveniet, dolor quo repellendus pariatur.</p>
                  <div className="mt-30">
                    <Link href="/job-details">
                      <span className="btn btn-grey-small mr-5">ASP .Net</span>
                    </Link>

                    <Link href="/job-details">
                      <span className="btn btn-grey-small mr-5">Figma</span>
                    </Link>
                  </div>
                  <div className="card-2-bottom mt-30">
                    <div className="row">
                      <div className="col-lg-7 col-7">
                        <span className="card-text-price">$250</span>
                        <span className="text-muted">/Hour</span>
                      </div>
                      <div className="col-lg-5 col-5 text-end">
                        <div className="btn btn-apply-now" data-bs-toggle="modal" data-bs-target="#ModalApplyJobForm">
                          Apply now
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12">
              <div className="card-grid-2 hover-up">
                <div className="card-grid-2-image-left">
                  <span className="flash" />
                  <div className="image-box">
                    <img src="assets/imgs/brands/brand-8.png" alt="jobBox" />
                  </div>
                  <div className="right-info">
                    <Link href="company-details">
                      <span className="name-job">Periscope</span>
                    </Link>
                    <span className="location-small">New York, US</span>
                  </div>
                </div>
                <div className="card-block-info">
                  <h6>
                    <Link href="/job-details">
                      <span>Lead Quality Control QA</span>
                    </Link>
                  </h6>
                  <div className="mt-5">
                    <span className="card-briefcase">Full time</span>
                    <span className="card-time">
                      6<span> minutes ago</span>
                    </span>
                  </div>
                  <p className="font-sm color-text-paragraph mt-15">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae architecto eveniet, dolor quo repellendus pariatur.</p>
                  <div className="mt-30">
                    <Link href="/job-details">
                      <span className="btn btn-grey-small mr-5">iOS</span>
                    </Link>

                    <Link href="/job-details">
                      <span className="btn btn-grey-small mr-5">Laravel</span>
                    </Link>

                    <Link href="/job-details">
                      <span className="btn btn-grey-small mr-5">Golang</span>
                    </Link>
                  </div>
                  <div className="card-2-bottom mt-30">
                    <div className="row">
                      <div className="col-lg-7 col-7">
                        <span className="card-text-price">$250</span>
                        <span className="text-muted">/Hour</span>
                      </div>
                      <div className="col-lg-5 col-5 text-end">
                        <div className="btn btn-apply-now" data-bs-toggle="modal" data-bs-target="#ModalApplyJobForm">
                          Apply now
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12">
              <div className="card-grid-2 hover-up">
                <div className="card-grid-2-image-left">
                  <span className="flash" />
                  <div className="image-box">
                    <img src="assets/imgs/brands/brand-1.png" alt="jobBox" />
                  </div>
                  <div className="right-info">
                    <Link href="company-details">
                      <span className="name-job">LinkedIn</span>
                    </Link>
                    <span className="location-small">New York, US</span>
                  </div>
                </div>
                <div className="card-block-info">
                  <h6>
                    <Link href="/job-details">
                      <span>UI / UX Designer fulltime</span>
                    </Link>
                  </h6>
                  <div className="mt-5">
                    <span className="card-briefcase">Fulltime</span>
                    <span className="card-time">
                      4<span> minutes ago</span>
                    </span>
                  </div>
                  <p className="font-sm color-text-paragraph mt-15">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae architecto eveniet, dolor quo repellendus pariatur</p>
                  <div className="mt-30">
                    <Link href="/jobs-grid">
                      <span className="btn btn-grey-small mr-5">Adobe XD</span>
                    </Link>

                    <Link href="/jobs-grid">
                      <span className="btn btn-grey-small mr-5">Figma</span>
                    </Link>

                    <Link href="/jobs-grid">
                      <span className="btn btn-grey-small mr-5">Photoshop</span>
                    </Link>
                  </div>
                  <div className="card-2-bottom mt-30">
                    <div className="row">
                      <div className="col-lg-7 col-7">
                        <span className="card-text-price">$500</span>
                        <span className="text-muted">/Hour</span>
                      </div>
                      <div className="col-lg-5 col-5 text-end">
                        <div className="btn btn-apply-now" data-bs-toggle="modal" data-bs-target="#ModalApplyJobForm">
                          Apply now
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12">
              <div className="card-grid-2 hover-up">
                <div className="card-grid-2-image-left">
                  <span className="flash" />
                  <div className="image-box">
                    <img src="assets/imgs/brands/brand-2.png" alt="jobBox" />
                  </div>
                  <div className="right-info">
                    <Link href="company-details">
                      <span className="name-job">Adobe Ilustrator</span>
                    </Link>
                    <span className="location-small">New York, US</span>
                  </div>
                </div>
                <div className="card-block-info">
                  <h6>
                    <Link href="/job-details">
                      <span>Full Stack Engineer</span>
                    </Link>
                  </h6>
                  <div className="mt-5">
                    <span className="card-briefcase">Part time</span>
                    <span className="card-time">
                      5<span> minutes ago</span>
                    </span>
                  </div>
                  <p className="font-sm color-text-paragraph mt-15">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae architecto eveniet, dolor quo repellendus pariatur.</p>
                  <div className="mt-30">
                    <Link href="/jobs-grid">
                      <span className="btn btn-grey-small mr-5">React</span>
                    </Link>

                    <Link href="/jobs-grid">
                      <span className="btn btn-grey-small mr-5">NodeJS</span>
                    </Link>
                  </div>
                  <div className="card-2-bottom mt-30">
                    <div className="row">
                      <div className="col-lg-7 col-7">
                        <span className="card-text-price">$800</span>
                        <span className="text-muted">/Hour</span>
                      </div>
                      <div className="col-lg-5 col-5 text-end">
                        <div className="btn btn-apply-now" data-bs-toggle="modal" data-bs-target="#ModalApplyJobForm">
                          Apply now
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12">
              <div className="card-grid-2 hover-up">
                <div className="card-grid-2-image-left">
                  <span className="flash" />
                  <div className="image-box">
                    <img src="assets/imgs/brands/brand-3.png" alt="jobBox" />
                  </div>
                  <div className="right-info">
                    <Link href="company-details">
                      <span className="name-job">Bing Search</span>
                    </Link>
                    <span className="location-small">New York, US</span>
                  </div>
                </div>
                <div className="card-block-info">
                  <h6>
                    <Link href="/job-details">
                      <span>Java Software Engineer</span>
                    </Link>
                  </h6>
                  <div className="mt-5">
                    <span className="card-briefcase">Full time</span>
                    <span className="card-time">
                      6<span> minutes ago</span>
                    </span>
                  </div>
                  <p className="font-sm color-text-paragraph mt-15">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae architecto eveniet, dolor quo repellendus pariatur.</p>
                  <div className="mt-30">
                    <Link href="/jobs-grid">
                      <span className="btn btn-grey-small mr-5">Python</span>
                    </Link>

                    <Link href="/jobs-grid">
                      <span className="btn btn-grey-small mr-5">AWS</span>
                    </Link>

                    <Link href="/jobs-grid">
                      <span className="btn btn-grey-small mr-5">Photoshop</span>
                    </Link>
                  </div>
                  <div className="card-2-bottom mt-30">
                    <div className="row">
                      <div className="col-lg-7 col-7">
                        <span className="card-text-price">$250</span>
                        <span className="text-muted">/Hour</span>
                      </div>
                      <div className="col-lg-5 col-5 text-end">
                        <div className="btn btn-apply-now" data-bs-toggle="modal" data-bs-target="#ModalApplyJobForm">
                          Apply now
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={`tab-pane fade ${active == 4 && "show active"}`}>
          <div className="row">
            <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12">
              <div className="card-grid-2 hover-up">
                <div className="card-grid-2-image-left">
                  <span className="flash" />
                  <div className="image-box">
                    <img src="assets/imgs/brands/brand-7.png" alt="jobBox" />
                  </div>
                  <div className="right-info">
                    <Link href="company-details">
                      <span className="name-job">Nintendo</span>
                    </Link>
                    <span className="location-small">New York, US</span>
                  </div>
                </div>
                <div className="card-block-info">
                  <h6>
                    <Link href="/job-details">
                      <span>Products Manager</span>
                    </Link>
                  </h6>
                  <div className="mt-5">
                    <span className="card-briefcase">Full time</span>
                    <span className="card-time">
                      6<span> minutes ago</span>
                    </span>
                  </div>
                  <p className="font-sm color-text-paragraph mt-15">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae architecto eveniet, dolor quo repellendus pariatur.</p>
                  <div className="mt-30">
                    <Link href="/job-details">
                      <span className="btn btn-grey-small mr-5">ASP .Net</span>
                    </Link>

                    <Link href="/job-details">
                      <span className="btn btn-grey-small mr-5">Figma</span>
                    </Link>
                  </div>
                  <div className="card-2-bottom mt-30">
                    <div className="row">
                      <div className="col-lg-7 col-7">
                        <span className="card-text-price">$250</span>
                        <span className="text-muted">/Hour</span>
                      </div>
                      <div className="col-lg-5 col-5 text-end">
                        <div className="btn btn-apply-now" data-bs-toggle="modal" data-bs-target="#ModalApplyJobForm">
                          Apply now
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12">
              <div className="card-grid-2 hover-up">
                <div className="card-grid-2-image-left">
                  <span className="flash" />
                  <div className="image-box">
                    <img src="assets/imgs/brands/brand-8.png" alt="jobBox" />
                  </div>
                  <div className="right-info">
                    <Link href="company-details">
                      <span className="name-job">Periscope</span>
                    </Link>
                    <span className="location-small">New York, US</span>
                  </div>
                </div>
                <div className="card-block-info">
                  <h6>
                    <Link href="/job-details">
                      <span>Lead Quality Control QA</span>
                    </Link>
                  </h6>
                  <div className="mt-5">
                    <span className="card-briefcase">Full time</span>
                    <span className="card-time">
                      6<span> minutes ago</span>
                    </span>
                  </div>
                  <p className="font-sm color-text-paragraph mt-15">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae architecto eveniet, dolor quo repellendus pariatur.</p>
                  <div className="mt-30">
                    <Link href="/job-details">
                      <span className="btn btn-grey-small mr-5">iOS</span>
                    </Link>

                    <Link href="/job-details">
                      <span className="btn btn-grey-small mr-5">Laravel</span>
                    </Link>

                    <Link href="/job-details">
                      <span className="btn btn-grey-small mr-5">Golang</span>
                    </Link>
                  </div>
                  <div className="card-2-bottom mt-30">
                    <div className="row">
                      <div className="col-lg-7 col-7">
                        <span className="card-text-price">$250</span>
                        <span className="text-muted">/Hour</span>
                      </div>
                      <div className="col-lg-5 col-5 text-end">
                        <div className="btn btn-apply-now" data-bs-toggle="modal" data-bs-target="#ModalApplyJobForm">
                          Apply now
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12">
              <div className="card-grid-2 hover-up">
                <div className="card-grid-2-image-left">
                  <span className="flash" />
                  <div className="image-box">
                    <img src="assets/imgs/brands/brand-4.png" alt="jobBox" />
                  </div>
                  <div className="right-info">
                    <Link href="company-details">
                      <span className="name-job">Dailymotion</span>
                    </Link>
                    <span className="location-small">New York, US</span>
                  </div>
                </div>
                <div className="card-block-info">
                  <h6>
                    <Link href="/job-details">
                      <span>Frontend Developer</span>
                    </Link>
                  </h6>
                  <div className="mt-5">
                    <span className="card-briefcase">Full time</span>
                    <span className="card-time">
                      6<span> minutes ago</span>
                    </span>
                  </div>
                  <p className="font-sm color-text-paragraph mt-15">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae architecto eveniet, dolor quo repellendus pariatur.</p>
                  <div className="mt-30">
                    <Link href="/jobs-grid">
                      <span className="btn btn-grey-small mr-5">Typescript</span>
                    </Link>

                    <Link href="/jobs-grid">
                      <span className="btn btn-grey-small mr-5">Java</span>
                    </Link>
                  </div>
                  <div className="card-2-bottom mt-30">
                    <div className="row">
                      <div className="col-lg-7 col-7">
                        <span className="card-text-price">$250</span>
                        <span className="text-muted">/Hour</span>
                      </div>
                      <div className="col-lg-5 col-5 text-end">
                        <div className="btn btn-apply-now" data-bs-toggle="modal" data-bs-target="#ModalApplyJobForm">
                          Apply now
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12">
              <div className="card-grid-2 hover-up">
                <div className="card-grid-2-image-left">
                  <span className="flash" />
                  <div className="image-box">
                    <img src="assets/imgs/brands/brand-5.png" alt="jobBox" />
                  </div>
                  <div className="right-info">
                    <Link href="company-details">
                      <span className="name-job">Linkedin</span>
                    </Link>
                    <span className="location-small">New York, US</span>
                  </div>
                </div>
                <div className="card-block-info">
                  <h6>
                    <Link href="/job-details">
                      <span>React Native Web Developer</span>
                    </Link>
                  </h6>
                  <div className="mt-5">
                    <span className="card-briefcase">Fulltime</span>
                    <span className="card-time">
                      4<span> minutes ago</span>
                    </span>
                  </div>
                  <p className="font-sm color-text-paragraph mt-15">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae architecto eveniet, dolor quo repellendus pariatur</p>
                  <div className="mt-30">
                    <Link href="/jobs-grid">
                      <span className="btn btn-grey-small mr-5">Angular</span>
                    </Link>
                  </div>
                  <div className="card-2-bottom mt-30">
                    <div className="row">
                      <div className="col-lg-7 col-7">
                        <span className="card-text-price">$500</span>
                        <span className="text-muted">/Hour</span>
                      </div>
                      <div className="col-lg-5 col-5 text-end">
                        <div className="btn btn-apply-now" data-bs-toggle="modal" data-bs-target="#ModalApplyJobForm">
                          Apply now
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12">
              <div className="card-grid-2 hover-up">
                <div className="card-grid-2-image-left">
                  <span className="flash" />
                  <div className="image-box">
                    <img src="assets/imgs/brands/brand-6.png" alt="jobBox" />
                  </div>
                  <div className="right-info">
                    <Link href="company-details">
                      <span className="name-job">Quora JSC</span>
                    </Link>
                    <span className="location-small">New York, US</span>
                  </div>
                </div>
                <div className="card-block-info">
                  <h6>
                    <Link href="/job-details">
                      <span>Senior System Engineer</span>
                    </Link>
                  </h6>
                  <div className="mt-5">
                    <span className="card-briefcase">Part time</span>
                    <span className="card-time">
                      5<span> minutes ago</span>
                    </span>
                  </div>
                  <p className="font-sm color-text-paragraph mt-15">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae architecto eveniet, dolor quo repellendus pariatur.</p>
                  <div className="mt-30">
                    <Link href="/job-details">
                      <span className="btn btn-grey-small mr-5">PHP</span>
                    </Link>

                    <Link href="/job-details">
                      <span className="btn btn-grey-small mr-5">Android</span>
                    </Link>
                  </div>
                  <div className="card-2-bottom mt-30">
                    <div className="row">
                      <div className="col-lg-7 col-7">
                        <span className="card-text-price">$800</span>
                        <span className="text-muted">/Hour</span>
                      </div>
                      <div className="col-lg-5 col-5 text-end">
                        <div className="btn btn-apply-now" data-bs-toggle="modal" data-bs-target="#ModalApplyJobForm">
                          Apply now
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12">
              <div className="card-grid-2 hover-up">
                <div className="card-grid-2-image-left">
                  <span className="flash" />
                  <div className="image-box">
                    <img src="assets/imgs/brands/brand-1.png" alt="jobBox" />
                  </div>
                  <div className="right-info">
                    <Link href="company-details">
                      <span className="name-job">LinkedIn</span>
                    </Link>
                    <span className="location-small">New York, US</span>
                  </div>
                </div>
                <div className="card-block-info">
                  <h6>
                    <Link href="/job-details">
                      <span>UI / UX Designer fulltime</span>
                    </Link>
                  </h6>
                  <div className="mt-5">
                    <span className="card-briefcase">Fulltime</span>
                    <span className="card-time">
                      4<span> minutes ago</span>
                    </span>
                  </div>
                  <p className="font-sm color-text-paragraph mt-15">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae architecto eveniet, dolor quo repellendus pariatur</p>
                  <div className="mt-30">
                    <Link href="/jobs-grid">
                      <span className="btn btn-grey-small mr-5">Adobe XD</span>
                    </Link>

                    <Link href="/jobs-grid">
                      <span className="btn btn-grey-small mr-5">Figma</span>
                    </Link>

                    <Link href="/jobs-grid">
                      <span className="btn btn-grey-small mr-5">Photoshop</span>
                    </Link>
                  </div>
                  <div className="card-2-bottom mt-30">
                    <div className="row">
                      <div className="col-lg-7 col-7">
                        <span className="card-text-price">$500</span>
                        <span className="text-muted">/Hour</span>
                      </div>
                      <div className="col-lg-5 col-5 text-end">
                        <div className="btn btn-apply-now" data-bs-toggle="modal" data-bs-target="#ModalApplyJobForm">
                          Apply now
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12">
              <div className="card-grid-2 hover-up">
                <div className="card-grid-2-image-left">
                  <span className="flash" />
                  <div className="image-box">
                    <img src="assets/imgs/brands/brand-2.png" alt="jobBox" />
                  </div>
                  <div className="right-info">
                    <Link href="company-details">
                      <span className="name-job">Adobe Ilustrator</span>
                    </Link>
                    <span className="location-small">New York, US</span>
                  </div>
                </div>
                <div className="card-block-info">
                  <h6>
                    <Link href="/job-details">
                      <span>Full Stack Engineer</span>
                    </Link>
                  </h6>
                  <div className="mt-5">
                    <span className="card-briefcase">Part time</span>
                    <span className="card-time">
                      5<span> minutes ago</span>
                    </span>
                  </div>
                  <p className="font-sm color-text-paragraph mt-15">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae architecto eveniet, dolor quo repellendus pariatur.</p>
                  <div className="mt-30">
                    <Link href="/jobs-grid">
                      <span className="btn btn-grey-small mr-5">React</span>
                    </Link>

                    <Link href="/jobs-grid">
                      <span className="btn btn-grey-small mr-5">NodeJS</span>
                    </Link>
                  </div>
                  <div className="card-2-bottom mt-30">
                    <div className="row">
                      <div className="col-lg-7 col-7">
                        <span className="card-text-price">$800</span>
                        <span className="text-muted">/Hour</span>
                      </div>
                      <div className="col-lg-5 col-5 text-end">
                        <div className="btn btn-apply-now" data-bs-toggle="modal" data-bs-target="#ModalApplyJobForm">
                          Apply now
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12">
              <div className="card-grid-2 hover-up">
                <div className="card-grid-2-image-left">
                  <span className="flash" />
                  <div className="image-box">
                    <img src="assets/imgs/brands/brand-3.png" alt="jobBox" />
                  </div>
                  <div className="right-info">
                    <Link href="company-details">
                      <span className="name-job">Bing Search</span>
                    </Link>
                    <span className="location-small">New York, US</span>
                  </div>
                </div>
                <div className="card-block-info">
                  <h6>
                    <Link href="/job-details">
                      <span>Java Software Engineer</span>
                    </Link>
                  </h6>
                  <div className="mt-5">
                    <span className="card-briefcase">Full time</span>
                    <span className="card-time">
                      6<span> minutes ago</span>
                    </span>
                  </div>
                  <p className="font-sm color-text-paragraph mt-15">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae architecto eveniet, dolor quo repellendus pariatur.</p>
                  <div className="mt-30">
                    <Link href="/jobs-grid">
                      <span className="btn btn-grey-small mr-5">Python</span>
                    </Link>

                    <Link href="/jobs-grid">
                      <span className="btn btn-grey-small mr-5">AWS</span>
                    </Link>

                    <Link href="/jobs-grid">
                      <span className="btn btn-grey-small mr-5">Photoshop</span>
                    </Link>
                  </div>
                  <div className="card-2-bottom mt-30">
                    <div className="row">
                      <div className="col-lg-7 col-7">
                        <span className="card-text-price">$250</span>
                        <span className="text-muted">/Hour</span>
                      </div>
                      <div className="col-lg-5 col-5 text-end">
                        <div className="btn btn-apply-now" data-bs-toggle="modal" data-bs-target="#ModalApplyJobForm">
                          Apply now
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={`tab-pane fade ${active == 5 && "show active"}`}>
          <div className="row">
            <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12">
              <div className="card-grid-2 hover-up">
                <div className="card-grid-2-image-left">
                  <span className="flash" />
                  <div className="image-box">
                    <img src="assets/imgs/brands/brand-8.png" alt="jobBox" />
                  </div>
                  <div className="right-info">
                    <Link href="company-details">
                      <span className="name-job">Periscope</span>
                    </Link>
                    <span className="location-small">New York, US</span>
                  </div>
                </div>
                <div className="card-block-info">
                  <h6>
                    <Link href="/job-details">
                      <span>Lead Quality Control QA</span>
                    </Link>
                  </h6>
                  <div className="mt-5">
                    <span className="card-briefcase">Full time</span>
                    <span className="card-time">
                      6<span> minutes ago</span>
                    </span>
                  </div>
                  <p className="font-sm color-text-paragraph mt-15">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae architecto eveniet, dolor quo repellendus pariatur.</p>
                  <div className="mt-30">
                    <Link href="/job-details">
                      <span className="btn btn-grey-small mr-5">iOS</span>
                    </Link>

                    <Link href="/job-details">
                      <span className="btn btn-grey-small mr-5">Laravel</span>
                    </Link>

                    <Link href="/job-details">
                      <span className="btn btn-grey-small mr-5">Golang</span>
                    </Link>
                  </div>
                  <div className="card-2-bottom mt-30">
                    <div className="row">
                      <div className="col-lg-7 col-7">
                        <span className="card-text-price">$250</span>
                        <span className="text-muted">/Hour</span>
                      </div>
                      <div className="col-lg-5 col-5 text-end">
                        <div className="btn btn-apply-now" data-bs-toggle="modal" data-bs-target="#ModalApplyJobForm">
                          Apply now
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12">
              <div className="card-grid-2 hover-up">
                <div className="card-grid-2-image-left">
                  <span className="flash" />
                  <div className="image-box">
                    <img src="assets/imgs/brands/brand-1.png" alt="jobBox" />
                  </div>
                  <div className="right-info">
                    <Link href="company-details">
                      <span className="name-job">LinkedIn</span>
                    </Link>
                    <span className="location-small">New York, US</span>
                  </div>
                </div>
                <div className="card-block-info">
                  <h6>
                    <Link href="/job-details">
                      <span>UI / UX Designer fulltime</span>
                    </Link>
                  </h6>
                  <div className="mt-5">
                    <span className="card-briefcase">Fulltime</span>
                    <span className="card-time">
                      4<span> minutes ago</span>
                    </span>
                  </div>
                  <p className="font-sm color-text-paragraph mt-15">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae architecto eveniet, dolor quo repellendus pariatur</p>
                  <div className="mt-30">
                    <Link href="/jobs-grid">
                      <span className="btn btn-grey-small mr-5">Adobe XD</span>
                    </Link>

                    <Link href="/jobs-grid">
                      <span className="btn btn-grey-small mr-5">Figma</span>
                    </Link>

                    <Link href="/jobs-grid">
                      <span className="btn btn-grey-small mr-5">Photoshop</span>
                    </Link>
                  </div>
                  <div className="card-2-bottom mt-30">
                    <div className="row">
                      <div className="col-lg-7 col-7">
                        <span className="card-text-price">$500</span>
                        <span className="text-muted">/Hour</span>
                      </div>
                      <div className="col-lg-5 col-5 text-end">
                        <div className="btn btn-apply-now" data-bs-toggle="modal" data-bs-target="#ModalApplyJobForm">
                          Apply now
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12">
              <div className="card-grid-2 hover-up">
                <div className="card-grid-2-image-left">
                  <span className="flash" />
                  <div className="image-box">
                    <img src="assets/imgs/brands/brand-4.png" alt="jobBox" />
                  </div>
                  <div className="right-info">
                    <Link href="company-details">
                      <span className="name-job">Dailymotion</span>
                    </Link>
                    <span className="location-small">New York, US</span>
                  </div>
                </div>
                <div className="card-block-info">
                  <h6>
                    <Link href="/job-details">
                      <span>Frontend Developer</span>
                    </Link>
                  </h6>
                  <div className="mt-5">
                    <span className="card-briefcase">Full time</span>
                    <span className="card-time">
                      6<span> minutes ago</span>
                    </span>
                  </div>
                  <p className="font-sm color-text-paragraph mt-15">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae architecto eveniet, dolor quo repellendus pariatur.</p>
                  <div className="mt-30">
                    <Link href="/jobs-grid">
                      <span className="btn btn-grey-small mr-5">Typescript</span>
                    </Link>

                    <Link href="/jobs-grid">
                      <span className="btn btn-grey-small mr-5">Java</span>
                    </Link>
                  </div>
                  <div className="card-2-bottom mt-30">
                    <div className="row">
                      <div className="col-lg-7 col-7">
                        <span className="card-text-price">$250</span>
                        <span className="text-muted">/Hour</span>
                      </div>
                      <div className="col-lg-5 col-5 text-end">
                        <div className="btn btn-apply-now" data-bs-toggle="modal" data-bs-target="#ModalApplyJobForm">
                          Apply now
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12">
              <div className="card-grid-2 hover-up">
                <div className="card-grid-2-image-left">
                  <span className="flash" />
                  <div className="image-box">
                    <img src="assets/imgs/brands/brand-5.png" alt="jobBox" />
                  </div>
                  <div className="right-info">
                    <Link href="company-details">
                      <span className="name-job">Linkedin</span>
                    </Link>
                    <span className="location-small">New York, US</span>
                  </div>
                </div>
                <div className="card-block-info">
                  <h6>
                    <Link href="/job-details">
                      <span>React Native Web Developer</span>
                    </Link>
                  </h6>
                  <div className="mt-5">
                    <span className="card-briefcase">Fulltime</span>
                    <span className="card-time">
                      4<span> minutes ago</span>
                    </span>
                  </div>
                  <p className="font-sm color-text-paragraph mt-15">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae architecto eveniet, dolor quo repellendus pariatur</p>
                  <div className="mt-30">
                    <Link href="/jobs-grid">
                      <span className="btn btn-grey-small mr-5">Angular</span>
                    </Link>
                  </div>
                  <div className="card-2-bottom mt-30">
                    <div className="row">
                      <div className="col-lg-7 col-7">
                        <span className="card-text-price">$500</span>
                        <span className="text-muted">/Hour</span>
                      </div>
                      <div className="col-lg-5 col-5 text-end">
                        <div className="btn btn-apply-now" data-bs-toggle="modal" data-bs-target="#ModalApplyJobForm">
                          Apply now
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12">
              <div className="card-grid-2 hover-up">
                <div className="card-grid-2-image-left">
                  <span className="flash" />
                  <div className="image-box">
                    <img src="assets/imgs/brands/brand-6.png" alt="jobBox" />
                  </div>
                  <div className="right-info">
                    <Link href="company-details">
                      <span className="name-job">Quora JSC</span>
                    </Link>
                    <span className="location-small">New York, US</span>
                  </div>
                </div>
                <div className="card-block-info">
                  <h6>
                    <Link href="/job-details">
                      <span>Senior System Engineer</span>
                    </Link>
                  </h6>
                  <div className="mt-5">
                    <span className="card-briefcase">Part time</span>
                    <span className="card-time">
                      5<span> minutes ago</span>
                    </span>
                  </div>
                  <p className="font-sm color-text-paragraph mt-15">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae architecto eveniet, dolor quo repellendus pariatur.</p>
                  <div className="mt-30">
                    <Link href="/job-details">
                      <span className="btn btn-grey-small mr-5">PHP</span>
                    </Link>

                    <Link href="/job-details">
                      <span className="btn btn-grey-small mr-5">Android</span>
                    </Link>
                  </div>
                  <div className="card-2-bottom mt-30">
                    <div className="row">
                      <div className="col-lg-7 col-7">
                        <span className="card-text-price">$800</span>
                        <span className="text-muted">/Hour</span>
                      </div>
                      <div className="col-lg-5 col-5 text-end">
                        <div className="btn btn-apply-now" data-bs-toggle="modal" data-bs-target="#ModalApplyJobForm">
                          Apply now
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12">
              <div className="card-grid-2 hover-up">
                <div className="card-grid-2-image-left">
                  <span className="flash" />
                  <div className="image-box">
                    <img src="assets/imgs/brands/brand-7.png" alt="jobBox" />
                  </div>
                  <div className="right-info">
                    <Link href="company-details">
                      <span className="name-job">Nintendo</span>
                    </Link>
                    <span className="location-small">New York, US</span>
                  </div>
                </div>
                <div className="card-block-info">
                  <h6>
                    <Link href="/job-details">
                      <span>Products Manager</span>
                    </Link>
                  </h6>
                  <div className="mt-5">
                    <span className="card-briefcase">Full time</span>
                    <span className="card-time">
                      6<span> minutes ago</span>
                    </span>
                  </div>
                  <p className="font-sm color-text-paragraph mt-15">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae architecto eveniet, dolor quo repellendus pariatur.</p>
                  <div className="mt-30">
                    <Link href="/job-details">
                      <span className="btn btn-grey-small mr-5">ASP .Net</span>
                    </Link>

                    <Link href="/job-details">
                      <span className="btn btn-grey-small mr-5">Figma</span>
                    </Link>
                  </div>
                  <div className="card-2-bottom mt-30">
                    <div className="row">
                      <div className="col-lg-7 col-7">
                        <span className="card-text-price">$250</span>
                        <span className="text-muted">/Hour</span>
                      </div>
                      <div className="col-lg-5 col-5 text-end">
                        <div className="btn btn-apply-now" data-bs-toggle="modal" data-bs-target="#ModalApplyJobForm">
                          Apply now
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12">
              <div className="card-grid-2 hover-up">
                <div className="card-grid-2-image-left">
                  <span className="flash" />
                  <div className="image-box">
                    <img src="assets/imgs/brands/brand-2.png" alt="jobBox" />
                  </div>
                  <div className="right-info">
                    <Link href="company-details">
                      <span className="name-job">Adobe Ilustrator</span>
                    </Link>
                    <span className="location-small">New York, US</span>
                  </div>
                </div>
                <div className="card-block-info">
                  <h6>
                    <Link href="/job-details">
                      <span>Full Stack Engineer</span>
                    </Link>
                  </h6>
                  <div className="mt-5">
                    <span className="card-briefcase">Part time</span>
                    <span className="card-time">
                      5<span> minutes ago</span>
                    </span>
                  </div>
                  <p className="font-sm color-text-paragraph mt-15">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae architecto eveniet, dolor quo repellendus pariatur.</p>
                  <div className="mt-30">
                    <Link href="/jobs-grid">
                      <span className="btn btn-grey-small mr-5">React</span>
                    </Link>

                    <Link href="/jobs-grid">
                      <span className="btn btn-grey-small mr-5">NodeJS</span>
                    </Link>
                  </div>
                  <div className="card-2-bottom mt-30">
                    <div className="row">
                      <div className="col-lg-7 col-7">
                        <span className="card-text-price">$800</span>
                        <span className="text-muted">/Hour</span>
                      </div>
                      <div className="col-lg-5 col-5 text-end">
                        <div className="btn btn-apply-now" data-bs-toggle="modal" data-bs-target="#ModalApplyJobForm">
                          Apply now
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12">
              <div className="card-grid-2 hover-up">
                <div className="card-grid-2-image-left">
                  <span className="flash" />
                  <div className="image-box">
                    <img src="assets/imgs/brands/brand-3.png" alt="jobBox" />
                  </div>
                  <div className="right-info">
                    <Link href="company-details">
                      <span className="name-job">Bing Search</span>
                    </Link>
                    <span className="location-small">New York, US</span>
                  </div>
                </div>
                <div className="card-block-info">
                  <h6>
                    <Link href="/job-details">
                      <span>Java Software Engineer</span>
                    </Link>
                  </h6>
                  <div className="mt-5">
                    <span className="card-briefcase">Full time</span>
                    <span className="card-time">
                      6<span> minutes ago</span>
                    </span>
                  </div>
                  <p className="font-sm color-text-paragraph mt-15">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae architecto eveniet, dolor quo repellendus pariatur.</p>
                  <div className="mt-30">
                    <Link href="/jobs-grid">
                      <span className="btn btn-grey-small mr-5">Python</span>
                    </Link>

                    <Link href="/jobs-grid">
                      <span className="btn btn-grey-small mr-5">AWS</span>
                    </Link>

                    <Link href="/jobs-grid">
                      <span className="btn btn-grey-small mr-5">Photoshop</span>
                    </Link>
                  </div>
                  <div className="card-2-bottom mt-30">
                    <div className="row">
                      <div className="col-lg-7 col-7">
                        <span className="card-text-price">$250</span>
                        <span className="text-muted">/Hour</span>
                      </div>
                      <div className="col-lg-5 col-5 text-end">
                        <div className="btn btn-apply-now" data-bs-toggle="modal" data-bs-target="#ModalApplyJobForm">
                          Apply now
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={`tab-pane fade ${active == 6 && "show active"}`}>
          <div className="row">
            <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12">
              <div className="card-grid-2 hover-up">
                <div className="card-grid-2-image-left">
                  <span className="flash" />
                  <div className="image-box">
                    <img src="assets/imgs/brands/brand-8.png" alt="jobBox" />
                  </div>
                  <div className="right-info">
                    <Link href="company-details">
                      <span className="name-job">Periscope</span>
                    </Link>
                    <span className="location-small">New York, US</span>
                  </div>
                </div>
                <div className="card-block-info">
                  <h6>
                    <Link href="/job-details">
                      <span>Lead Quality Control QA</span>
                    </Link>
                  </h6>
                  <div className="mt-5">
                    <span className="card-briefcase">Full time</span>
                    <span className="card-time">
                      6<span> minutes ago</span>
                    </span>
                  </div>
                  <p className="font-sm color-text-paragraph mt-15">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae architecto eveniet, dolor quo repellendus pariatur.</p>
                  <div className="mt-30">
                    <Link href="/job-details">
                      <span className="btn btn-grey-small mr-5">iOS</span>
                    </Link>

                    <Link href="/job-details">
                      <span className="btn btn-grey-small mr-5">Laravel</span>
                    </Link>

                    <Link href="/job-details">
                      <span className="btn btn-grey-small mr-5">Golang</span>
                    </Link>
                  </div>
                  <div className="card-2-bottom mt-30">
                    <div className="row">
                      <div className="col-lg-7 col-7">
                        <span className="card-text-price">$250</span>
                        <span className="text-muted">/Hour</span>
                      </div>
                      <div className="col-lg-5 col-5 text-end">
                        <div className="btn btn-apply-now" data-bs-toggle="modal" data-bs-target="#ModalApplyJobForm">
                          Apply now
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12">
              <div className="card-grid-2 hover-up">
                <div className="card-grid-2-image-left">
                  <span className="flash" />
                  <div className="image-box">
                    <img src="assets/imgs/brands/brand-1.png" alt="jobBox" />
                  </div>
                  <div className="right-info">
                    <Link href="company-details">
                      <span className="name-job">LinkedIn</span>
                    </Link>
                    <span className="location-small">New York, US</span>
                  </div>
                </div>
                <div className="card-block-info">
                  <h6>
                    <Link href="/job-details">
                      <span>UI / UX Designer fulltime</span>
                    </Link>
                  </h6>
                  <div className="mt-5">
                    <span className="card-briefcase">Fulltime</span>
                    <span className="card-time">
                      4<span> minutes ago</span>
                    </span>
                  </div>
                  <p className="font-sm color-text-paragraph mt-15">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae architecto eveniet, dolor quo repellendus pariatur</p>
                  <div className="mt-30">
                    <Link href="/jobs-grid">
                      <span className="btn btn-grey-small mr-5">Adobe XD</span>
                    </Link>

                    <Link href="/jobs-grid">
                      <span className="btn btn-grey-small mr-5">Figma</span>
                    </Link>

                    <Link href="/jobs-grid">
                      <span className="btn btn-grey-small mr-5">Photoshop</span>
                    </Link>
                  </div>
                  <div className="card-2-bottom mt-30">
                    <div className="row">
                      <div className="col-lg-7 col-7">
                        <span className="card-text-price">$500</span>
                        <span className="text-muted">/Hour</span>
                      </div>
                      <div className="col-lg-5 col-5 text-end">
                        <div className="btn btn-apply-now" data-bs-toggle="modal" data-bs-target="#ModalApplyJobForm">
                          Apply now
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12">
              <div className="card-grid-2 hover-up">
                <div className="card-grid-2-image-left">
                  <span className="flash" />
                  <div className="image-box">
                    <img src="assets/imgs/brands/brand-2.png" alt="jobBox" />
                  </div>
                  <div className="right-info">
                    <Link href="company-details">
                      <span className="name-job">Adobe Ilustrator</span>
                    </Link>
                    <span className="location-small">New York, US</span>
                  </div>
                </div>
                <div className="card-block-info">
                  <h6>
                    <Link href="/job-details">
                      <span>Full Stack Engineer</span>
                    </Link>
                  </h6>
                  <div className="mt-5">
                    <span className="card-briefcase">Part time</span>
                    <span className="card-time">
                      5<span> minutes ago</span>
                    </span>
                  </div>
                  <p className="font-sm color-text-paragraph mt-15">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae architecto eveniet, dolor quo repellendus pariatur.</p>
                  <div className="mt-30">
                    <Link href="/jobs-grid">
                      <span className="btn btn-grey-small mr-5">React</span>
                    </Link>

                    <Link href="/jobs-grid">
                      <span className="btn btn-grey-small mr-5">NodeJS</span>
                    </Link>
                  </div>
                  <div className="card-2-bottom mt-30">
                    <div className="row">
                      <div className="col-lg-7 col-7">
                        <span className="card-text-price">$800</span>
                        <span className="text-muted">/Hour</span>
                      </div>
                      <div className="col-lg-5 col-5 text-end">
                        <div className="btn btn-apply-now" data-bs-toggle="modal" data-bs-target="#ModalApplyJobForm">
                          Apply now
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12">
              <div className="card-grid-2 hover-up">
                <div className="card-grid-2-image-left">
                  <span className="flash" />
                  <div className="image-box">
                    <img src="assets/imgs/brands/brand-3.png" alt="jobBox" />
                  </div>
                  <div className="right-info">
                    <Link href="company-details">
                      <span className="name-job">Bing Search</span>
                    </Link>
                    <span className="location-small">New York, US</span>
                  </div>
                </div>
                <div className="card-block-info">
                  <h6>
                    <Link href="/job-details">
                      <span>Java Software Engineer</span>
                    </Link>
                  </h6>
                  <div className="mt-5">
                    <span className="card-briefcase">Full time</span>
                    <span className="card-time">
                      6<span> minutes ago</span>
                    </span>
                  </div>
                  <p className="font-sm color-text-paragraph mt-15">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae architecto eveniet, dolor quo repellendus pariatur.</p>
                  <div className="mt-30">
                    <Link href="/jobs-grid">
                      <span className="btn btn-grey-small mr-5">Python</span>
                    </Link>

                    <Link href="/jobs-grid">
                      <span className="btn btn-grey-small mr-5">AWS</span>
                    </Link>

                    <Link href="/jobs-grid">
                      <span className="btn btn-grey-small mr-5">Photoshop</span>
                    </Link>
                  </div>
                  <div className="card-2-bottom mt-30">
                    <div className="row">
                      <div className="col-lg-7 col-7">
                        <span className="card-text-price">$250</span>
                        <span className="text-muted">/Hour</span>
                      </div>
                      <div className="col-lg-5 col-5 text-end">
                        <div className="btn btn-apply-now" data-bs-toggle="modal" data-bs-target="#ModalApplyJobForm">
                          Apply now
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12">
              <div className="card-grid-2 hover-up">
                <div className="card-grid-2-image-left">
                  <span className="flash" />
                  <div className="image-box">
                    <img src="assets/imgs/brands/brand-4.png" alt="jobBox" />
                  </div>
                  <div className="right-info">
                    <Link href="company-details">
                      <span className="name-job">Dailymotion</span>
                    </Link>
                    <span className="location-small">New York, US</span>
                  </div>
                </div>
                <div className="card-block-info">
                  <h6>
                    <Link href="/job-details">
                      <span>Frontend Developer</span>
                    </Link>
                  </h6>
                  <div className="mt-5">
                    <span className="card-briefcase">Full time</span>
                    <span className="card-time">
                      6<span> minutes ago</span>
                    </span>
                  </div>
                  <p className="font-sm color-text-paragraph mt-15">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae architecto eveniet, dolor quo repellendus pariatur.</p>
                  <div className="mt-30">
                    <Link href="/jobs-grid">
                      <span className="btn btn-grey-small mr-5">Typescript</span>
                    </Link>

                    <Link href="/jobs-grid">
                      <span className="btn btn-grey-small mr-5">Java</span>
                    </Link>
                  </div>
                  <div className="card-2-bottom mt-30">
                    <div className="row">
                      <div className="col-lg-7 col-7">
                        <span className="card-text-price">$250</span>
                        <span className="text-muted">/Hour</span>
                      </div>
                      <div className="col-lg-5 col-5 text-end">
                        <div className="btn btn-apply-now" data-bs-toggle="modal" data-bs-target="#ModalApplyJobForm">
                          Apply now
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12">
              <div className="card-grid-2 hover-up">
                <div className="card-grid-2-image-left">
                  <span className="flash" />
                  <div className="image-box">
                    <img src="assets/imgs/brands/brand-5.png" alt="jobBox" />
                  </div>
                  <div className="right-info">
                    <Link href="company-details">
                      <span className="name-job">Linkedin</span>
                    </Link>
                    <span className="location-small">New York, US</span>
                  </div>
                </div>
                <div className="card-block-info">
                  <h6>
                    <Link href="/job-details">
                      <span>React Native Web Developer</span>
                    </Link>
                  </h6>
                  <div className="mt-5">
                    <span className="card-briefcase">Fulltime</span>
                    <span className="card-time">
                      4<span> minutes ago</span>
                    </span>
                  </div>
                  <p className="font-sm color-text-paragraph mt-15">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae architecto eveniet, dolor quo repellendus pariatur</p>
                  <div className="mt-30">
                    <Link href="/jobs-grid">
                      <span className="btn btn-grey-small mr-5">Angular</span>
                    </Link>
                  </div>
                  <div className="card-2-bottom mt-30">
                    <div className="row">
                      <div className="col-lg-7 col-7">
                        <span className="card-text-price">$500</span>
                        <span className="text-muted">/Hour</span>
                      </div>
                      <div className="col-lg-5 col-5 text-end">
                        <div className="btn btn-apply-now" data-bs-toggle="modal" data-bs-target="#ModalApplyJobForm">
                          Apply now
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12">
              <div className="card-grid-2 hover-up">
                <div className="card-grid-2-image-left">
                  <span className="flash" />
                  <div className="image-box">
                    <img src="assets/imgs/brands/brand-6.png" alt="jobBox" />
                  </div>
                  <div className="right-info">
                    <Link href="company-details">
                      <span className="name-job">Quora JSC</span>
                    </Link>
                    <span className="location-small">New York, US</span>
                  </div>
                </div>
                <div className="card-block-info">
                  <h6>
                    <Link href="/job-details">
                      <span>Senior System Engineer</span>
                    </Link>
                  </h6>
                  <div className="mt-5">
                    <span className="card-briefcase">Part time</span>
                    <span className="card-time">
                      5<span> minutes ago</span>
                    </span>
                  </div>
                  <p className="font-sm color-text-paragraph mt-15">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae architecto eveniet, dolor quo repellendus pariatur.</p>
                  <div className="mt-30">
                    <Link href="/job-details">
                      <span className="btn btn-grey-small mr-5">PHP</span>
                    </Link>

                    <Link href="/job-details">
                      <span className="btn btn-grey-small mr-5">Android</span>
                    </Link>
                  </div>
                  <div className="card-2-bottom mt-30">
                    <div className="row">
                      <div className="col-lg-7 col-7">
                        <span className="card-text-price">$800</span>
                        <span className="text-muted">/Hour</span>
                      </div>
                      <div className="col-lg-5 col-5 text-end">
                        <div className="btn btn-apply-now" data-bs-toggle="modal" data-bs-target="#ModalApplyJobForm">
                          Apply now
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12">
              <div className="card-grid-2 hover-up">
                <div className="card-grid-2-image-left">
                  <span className="flash" />
                  <div className="image-box">
                    <img src="assets/imgs/brands/brand-7.png" alt="jobBox" />
                  </div>
                  <div className="right-info">
                    <Link href="company-details">
                      <span className="name-job">Nintendo</span>
                    </Link>
                    <span className="location-small">New York, US</span>
                  </div>
                </div>
                <div className="card-block-info">
                  <h6>
                    <Link href="/job-details">
                      <span>Products Manager</span>
                    </Link>
                  </h6>
                  <div className="mt-5">
                    <span className="card-briefcase">Full time</span>
                    <span className="card-time">
                      6<span> minutes ago</span>
                    </span>
                  </div>
                  <p className="font-sm color-text-paragraph mt-15">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae architecto eveniet, dolor quo repellendus pariatur.</p>
                  <div className="mt-30">
                    <Link href="/job-details">
                      <span className="btn btn-grey-small mr-5">ASP .Net</span>
                    </Link>

                    <Link href="/job-details">
                      <span className="btn btn-grey-small mr-5">Figma</span>
                    </Link>
                  </div>
                  <div className="card-2-bottom mt-30">
                    <div className="row">
                      <div className="col-lg-7 col-7">
                        <span className="card-text-price">$250</span>
                        <span className="text-muted">/Hour</span>
                      </div>
                      <div className="col-lg-5 col-5 text-end">
                        <div className="btn btn-apply-now" data-bs-toggle="modal" data-bs-target="#ModalApplyJobForm">
                          Apply now
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CategoryTab;