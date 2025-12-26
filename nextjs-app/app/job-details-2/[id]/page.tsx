"use client";
type Job = {
  id:  string | number;
  title?: string;
  jobType?: string;
  createdAt?: string;
  location?: string;
  salaryRange?: string;
  category?: string;
  requiredSkills?: string[];
  minExperience?: number;
  requiredDegree?: string;
  endAt?: string;
  employerId?: string | number;
  employerName?: string;
  employer?: { id?: string | number; name?: string };
  description?: string;
  companyName?: string;
   postPriceUSD: number;
  postType: string; // NORMAL | VIP
  postPrice: number;
  status?: string;

  applicantsCount: number;
  newApplicantsCount: number;
  lastAppliedAt: string | null;

};
type Company = {
  id?: string | number;
  companyName?: string;
  logoUrl?: string;
  address?: string;
  phone?: string;
  email?: string;
  location?: string;
  openJobs?: number;
};
import { useEffect, useState, useRef } from "react";
import { getCompanyByEmployerId } from "@/lib/company/api";
import { useParams, useRouter } from "next/navigation";


import Link from "next/link";
import Layout from "@/components/Layout/Layout";
import { useSession } from "next-auth/react";
import FeaturedSlider from "@/components/sliders/Featured";
import ApplyJob from "@/features/applicants/components/ApplyJob";
import Image from "next/image";

import { toast } from "react-toastify";


import MultiChatWidget from "@/components/MultiChatWidget";
import { JobPostingResponseDTO, Resume } from "@/types/applicant";
import { applicantService } from "@/features/applicants/services/applicant.service";
import { initializeChatConversation } from "@/lib/chat-helper";


export default function JobDetails2() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const [job, setJob] = useState<Job | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
 

    // Lấy dữ liệu Applyjob từ API 
    const [modalJob, setModalJob] = useState<JobPostingResponseDTO | null>(null);
    const [resumes, setResumes] = useState<Resume[]>([]);
    const router = useRouter();
      const handleOpenApply = (job: JobPostingResponseDTO) => {
        if (!session) {
          toast.error("You need to login to apply!");
          router.push("/page-signin"); // 👈 redirect sang trang login của bạn
          return;
        }
        setModalJob(job);
      };
      useEffect(() => {
        const fetchResumes = async () => {
          try {
            const res = await applicantService.getMyResumes();
             setResumes(res.data || []);
          } catch (err) {
            console.error("Error fetching resumes:", err);
          }
        };
        fetchResumes();
      }, []);
    

  useEffect(() => {
    if (!id) return;
    fetch(`http://localhost:8080/api/job-postings/${id}`)
      .then((res) => res.json())
      .then((data: Job) => setJob(data))
      .catch(() => setJob(null));
  }, [id]);

  const { data: session } = useSession();
  const chatRef = useRef<FloatingChatHandle | null>(null);
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
          } catch (err) {
            setJobsError((err as Error).message || "Lỗi không xác định");
          } finally {
            setJobsLoading(false);
          }
        };
        fetchJobs();
      }, []);

      // Helper: robustly parse createdAt value from API (supports ms, seconds, ISO string)
  const parseToDate = (val: string | number | Date | null | undefined): Date | null => {
        if (!val && val !== 0) return null;
        if (typeof val === 'number') {
          return new Date(val > 1e12 ? val : val * 1000);
        }
        if (typeof val === 'string') {
          const num = Number(val);
          if (!isNaN(num)) return new Date(num > 1e12 ? num : num * 1000);
          const d = new Date(val);
          if (!isNaN(d.getTime())) return d;
        }
        return null;
      };

      const formatCreatedAt = (date: Date) => {
        const diff = Date.now() - date.getTime();
        const minutes = Math.floor(diff / 60000);
        if (minutes < 60) return `${minutes} mins ago`;
const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours} hrs ago`;
        // show readable date for older posts
        return date.toLocaleDateString();
      };

  useEffect(() => {
    if (!job?.employerId) return;
    (async () => {
      try {
        // Ép kiểu employerId về string
        const data = await getCompanyByEmployerId(String(job.employerId));
        setCompany(data);
      } catch {
        setCompany(null);
      }
    })();
  }, [job?.employerId]);

  // Initialize chat conversation when job and session are available
  useEffect(() => {
    if (job?.employerId && session?.user?.id) {
      initializeChatConversation(
        String(job.employerId),
        session.user.id,
        job.employer?.name || company?.companyName || job.employerName,
        session?.user?.fullName ?? session?.user?.name
      ).catch(error => {
        console.error("Failed to initialize chat:", error);
      });
    }
  }, [job?.employerId, session?.user?.id, company?.companyName, job?.employer?.name, job?.employerName, session?.user?.fullName, session?.user?.name]);

  return (
    <>
      <Layout>
        <div>
          <section className="section-box mt-50">
            <div className="container">
              <div className="row">
                <div className="col-lg-8 col-md-12 col-sm-12 col-12">
                  <div className="box-border-single">
                    {/* JOB DETAIL: DỮ LIỆU TỪ API */}
                    {!job ? (
                      <div>Loading...</div>
                    ) : (
                      <>
                        <div className="row mt-10">
                          <div className="">
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, width: '100%' }}>
                              <h3 style={{ margin: 0, fontWeight: 800, fontSize: '2rem', color: '#1d3557', letterSpacing: 0.2 }}>{job.title}</h3>
                              {job.postType === 'vip' && (
                                <span
                                  className="badge-vip"
                                  style={{
                                    fontSize: '1rem',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 4,
                                    background: 'linear-gradient(90deg, #f59e0b 0%, #facc15 100%)',
                                    color: '#fff',
                                    fontWeight: 900,
                                    padding: '7px 16px',
                                    borderRadius: 999,
                                    border: '2px solid #fffbe6',
                                    boxShadow: '0 4px 16px 0 rgba(251,191,36,0.5), 0 0 8px 2px #fde68a',
                                    letterSpacing: 1,
                                    textShadow: '0 1px 4px rgba(0,0,0,0.08)',
                                    zIndex: 2,
                                    backdropFilter: 'blur(3px)'
                                  }}
                                >
                                  <span style={{ fontSize: '1.1em', color: '#fff', marginRight: 3 }}>★</span> VIP
                                </span>
                              )}
                            </div>
                            <div className="mt-0 mb-15">
                              {job.jobType && <span className="card-briefcase">{job.jobType}</span>}
                              {job.createdAt && <span className="card-time">{new Date(job.createdAt).toLocaleDateString()}</span>}
                            </div>
                              <button
                                onClick={() => handleOpenApply(job as JobPostingResponseDTO)} // 👈 Fix: open modal by setting modalJob
                                className="btn-apply"
                              >
                                Apply 
                              </button>                          
                          </div>
                        </div>
                        <div className="border-bottom pt-10 pb-10" />
                        <div className="job-overview">
                          <h5 className="border-bottom pb-15 mb-30">Employment Information</h5>
                          <div className="row" style={{rowGap: '18px', columnGap: '0'}}>
                            {job.title && (
                              <div className="col-md-6 d-flex align-items-center" style={{minHeight: '38px'}}>
                                <span style={{width: 32, textAlign: 'center', display: 'inline-block'}}>
                                  {/* Title icon */}
                                  <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" stroke="#8a94a6" strokeWidth="1.5"/><path d="M7 8h10M7 12h10M7 16h6" stroke="#8a94a6" strokeWidth="1.5" strokeLinecap="round"/></svg>
                                </span>
                                <span style={{color:'#8a94a6', minWidth: 110, marginLeft: 8}}>Title</span>
                                <span style={{fontWeight:600, marginLeft: 8}}>{job.title}</span>
</div>
                            )}
                            {job.location && (
                              <div className="col-md-6 d-flex align-items-center" style={{minHeight: '38px'}}>
                                <span style={{width: 32, textAlign: 'center', display: 'inline-block'}}>
                                  {/* Location icon */}
                                  <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M12 21s-6-5.686-6-10A6 6 0 0 1 18 11c0 4.314-6 10-6 10z" stroke="#8a94a6" strokeWidth="1.5"/><circle cx="12" cy="11" r="2.5" stroke="#8a94a6" strokeWidth="1.5"/></svg>
                                </span>
                                <span style={{color:'#8a94a6', minWidth: 110, marginLeft: 8}}>Location</span>
                                <span style={{fontWeight:600, marginLeft: 8}}>{job.location}</span>
                              </div>
                            )}
                            {job.salaryRange && (
                              <div className="col-md-6 d-flex align-items-center" style={{minHeight: '38px'}}>
                                <span style={{width: 32, textAlign: 'center', display: 'inline-block'}}>
                                  {/* Salary icon */}
                                  <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#8a94a6" strokeWidth="1.5"/><path d="M8 12h4a2 2 0 1 0 0-4h-2a2 2 0 1 1 0-4h4" stroke="#8a94a6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                </span>
                                <span style={{color:'#8a94a6', minWidth: 110, marginLeft: 8}}>Salary</span>
                                <span style={{fontWeight:600, marginLeft: 8}}>{job.salaryRange}</span>
                              </div>
                            )}
                            {job.jobType && (
                              <div className="col-md-6 d-flex align-items-center" style={{minHeight: '38px'}}>
                                <span style={{width: 32, textAlign: 'center', display: 'inline-block'}}>
                                  {/* Job Type icon */}
                                  <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="2" stroke="#8a94a6" strokeWidth="1.5"/><path d="M16 3v4M8 3v4" stroke="#8a94a6" strokeWidth="1.5" strokeLinecap="round"/></svg>
                                </span>
                                <span style={{color:'#8a94a6', minWidth: 110, marginLeft: 8}}>Job Type</span>
                                <span style={{fontWeight:600, marginLeft: 8}}>{job.jobType}</span>
                              </div>
                            )}
                            {job.category && (
                              <div className="col-md-6 d-flex align-items-center" style={{minHeight: '38px'}}>
<span style={{width: 32, textAlign: 'center', display: 'inline-block'}}>
                                  {/* Category icon */}
                                  <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="2" stroke="#8a94a6" strokeWidth="1.5"/><path d="M16 3v4M8 3v4" stroke="#8a94a6" strokeWidth="1.5" strokeLinecap="round"/></svg>
                                </span>
                                <span style={{color:'#8a94a6', minWidth: 110, marginLeft: 8}}>Category</span>
                                <span style={{fontWeight:600, marginLeft: 8}}>{job.category}</span>
                              </div>
                            )}
                            {job.requiredSkills && job.requiredSkills.length > 0 && (
                              <div className="col-md-6 d-flex align-items-center" style={{minHeight: '38px'}}>
                                <span style={{width: 32, textAlign: 'center', display: 'inline-block'}}>
                                  {/* Skills icon */}
                                  <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="2" stroke="#8a94a6" strokeWidth="1.5"/><path d="M7 10h10M7 14h6" stroke="#8a94a6" strokeWidth="1.5" strokeLinecap="round"/></svg>
                                </span>
                                <span style={{color:'#8a94a6', minWidth: 110, marginLeft: 8}}>Required Skills</span>
                                <span style={{fontWeight:600, marginLeft: 8}}>{job.requiredSkills.join(", ")}</span>
                              </div>
                            )}
                            {typeof job.minExperience !== 'undefined' && (
                              <div className="col-md-6 d-flex align-items-center" style={{minHeight: '38px'}}>
                                <span style={{width: 32, textAlign: 'center', display: 'inline-block'}}>
                                  {/* Experience icon */}
                                  <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#8a94a6" strokeWidth="1.5"/><path d="M12 6v6l4 2" stroke="#8a94a6" strokeWidth="1.5" strokeLinecap="round"/></svg>
                                </span>
                                <span style={{color:'#8a94a6', minWidth: 110, marginLeft: 8}}>Min Experience</span>
                                <span style={{fontWeight:600, marginLeft: 8}}>{job.minExperience} years</span>
                              </div>
                            )}
                            {job.requiredDegree && (
                              <div className="col-md-6 d-flex align-items-center" style={{minHeight: '38px'}}>
                                <span style={{width: 32, textAlign: 'center', display: 'inline-block'}}>
                                  {/* Degree icon */}
<svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M12 3L2 9l10 6 10-6-10-6z" stroke="#8a94a6" strokeWidth="1.5"/><path d="M2 17l10 6 10-6" stroke="#8a94a6" strokeWidth="1.5"/></svg>
                                </span>
                                <span style={{color:'#8a94a6', minWidth: 110, marginLeft: 8}}>Required Degree</span>
                                <span style={{fontWeight:600, marginLeft: 8}}>{job.requiredDegree}</span>
                              </div>
                            )}
                            {job.createdAt && (
                              <div className="col-md-6 d-flex align-items-center" style={{minHeight: '38px'}}>
                                <span style={{width: 32, textAlign: 'center', display: 'inline-block'}}>
                                  {/* Created At icon */}
                                  <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" stroke="#8a94a6" strokeWidth="1.5"/><path d="M16 2v4M8 2v4" stroke="#8a94a6" strokeWidth="1.5" strokeLinecap="round"/><path d="M3 10h18" stroke="#8a94a6" strokeWidth="1.5"/></svg>
                                </span>
                                <span style={{color:'#8a94a6', minWidth: 110, marginLeft: 8}}>Created At</span>
                                <span style={{fontWeight:600, marginLeft: 8}}>{new Date(job.createdAt).toLocaleDateString()}</span>
                              </div>
                            )}
                            {job.endAt && (
                              <div className="col-md-6 d-flex align-items-center" style={{minHeight: '38px'}}>
                                <span style={{width: 32, textAlign: 'center', display: 'inline-block'}}>
                                  {/* Deadline icon */}
                                  <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" stroke="#8a94a6" strokeWidth="1.5"/><path d="M16 2v4M8 2v4" stroke="#8a94a6" strokeWidth="1.5" strokeLinecap="round"/><path d="M3 10h18" stroke="#8a94a6" strokeWidth="1.5"/></svg>
                                </span>
                                <span style={{color:'#8a94a6', minWidth: 110, marginLeft: 8}}>Expiration date</span>
                                <span style={{fontWeight:600, marginLeft: 8}}>{new Date(job.endAt).toLocaleDateString()}</span>
                              </div>
                            )}
            
                            {job.employer && job.employer.name && (
                              <div className="col-md-6 d-flex align-items-center" style={{minHeight: '38px'}}>
                                <span style={{width: 32, textAlign: 'center', display: 'inline-block'}}>
                                  {/* Employer icon */}
<svg width="22" height="22" fill="none" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="2" stroke="#8a94a6" strokeWidth="1.5"/><circle cx="12" cy="12" r="3" stroke="#8a94a6" strokeWidth="1.5"/></svg>
                                </span>
                                <span style={{color:'#8a94a6', minWidth: 110, marginLeft: 8}}>Employer</span>
                                <span style={{fontWeight:600, marginLeft: 8}}>{job.employer.name}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="content-single" style={{background:'#fff',border:'1.5px solid #e5e8ec',borderRadius:16,padding:'28px 32px',margin:'32px 0',fontSize:'1.08rem',lineHeight:1.7,boxShadow:'0 2px 12px 0 rgba(0,0,0,0.03)'}}>
                          <h5 className="border-bottom pb-15 mb-30">Job Description</h5>
                          <div dangerouslySetInnerHTML={{ __html: job.description ? job.description.replace(/\n/g, '<br>') : '' }} />
                        </div>
                        <div className="author-single" style={{ display: "flex", alignItems: "center", gap: 16 }}>
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span>{job.employerName || job.employer?.name || company?.companyName}</span>
                            {session?.user?.id && (
                              <button
                                onClick={() => chatRef.current?.open()}
                                style={{ marginTop: 8, padding: '8px 12px', borderRadius: 6, border: '1px solid #1976d2', background: '#fff', color: '#1976d2', cursor: 'pointer' }}
                              >
                                Liên hệ với nhà tuyển dụng ngay
                              </button>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                   {modalJob && (
                            <ApplyJob
                              job={modalJob}
                              resumes={resumes} // 👈 truyền resumes vào
                              onClose={() => setModalJob(null)}
                              onSuccess={() => toast.success("Applied successfully!")}
                            />
                          )}
 
                <div className="col-lg-4 col-md-12 col-sm-12 col-12 pl-40 pl-lg-15 mt-lg-30">
                  
                  <div className="sidebar-border">
                  <div className="sidebar-heading">
                    <div className="avatar-sidebar">
                    
                      <figure style={{ width: 60, height: 60, borderRadius: 8, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Image
                          alt="jobBox"
                          src={company?.logoUrl || "/assets/imgs/page/job-single/avatar.png"}
                          width={60}
                          height={60}
                          style={{
                            maxWidth: "100%",
                            maxHeight: "100%",
                            objectFit: "contain",
                            display: "block"
                          }}
                        />
                      </figure>
                      <div className="sidebar-info">
                        {company?.id ? (
                          <Link href={`/company-details/${company.id}`}>
                            <span className="sidebar-company">{company.companyName || "Company"}</span>
                          </Link>
                        ) : (
                          <span className="sidebar-company">{company?.companyName || "Company"}</span>
                        )}
                          <span className="card-location">{company?.location || company?.address || "Unknown"}</span>
                        {company?.openJobs && (
                          <Link href="#">
                            <span className="link-underline mt-15">{company.openJobs} Open Jobs</span>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="sidebar-list-job">
                    <div className="box-map">
                      <iframe
                        src={`https://www.google.com/maps?q=${encodeURIComponent(
                          `${company?.address || ""} ${company?.location || ""}`
                        )}&output=embed`}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        style={{ width: "100%", height: "200px", border: 0, borderRadius: "8px" }}
                      />
                    </div>
                    <ul className="ul-disc">
                      {company?.address && <li>{company.address}</li>}
                      {company?.phone && <li>Phone: {company.phone}</li>}
                      {company?.email && <li>Email: {company.email}</li>}
                    </ul>
                  </div>
                </div>
                  <div className="sidebar-border">
                    <h6 className="f-18">Similar jobs</h6>
                    <div className="sidebar-list-job">
                      {jobsLoading && <div className="py-3">Đang tải...</div>}
                      {jobsError && <div className="py-3 text-danger">{jobsError}</div>}
                      {!jobsLoading && !jobsError && jobs.length === 0 && <div className="py-3">Không có công việc tương tự</div>}
                      {!jobsLoading && !jobsError && jobs.length > 0 && (
                        <ul>
                          {(() => {
                            // determine current employer identifier (id or name)
                            const currentEmployerKey = job?.employer?.id ?? job?.employerId ?? job?.employerName ?? job?.employer?.name ?? null;
                            return jobs
                              .slice()
                              .filter((j: Job) => {
                                if (!currentEmployerKey) return false;
                                return (
                                  String(j.employer?.id ?? j.employerId ?? j.employerName ?? j.employer?.name ?? '') === String(currentEmployerKey)
                                );
                              })
                              .sort((a: Job, b: Job) => new Date(b.createdAt ?? '').getTime() - new Date(a.createdAt ?? '').getTime())
                              .slice(0, 9)
                              .map((j: Job) => {
                                const createdDate = parseToDate(j.createdAt);
                                const timeText = createdDate ? formatCreatedAt(createdDate) : '';
                                return (
                                  <li key={j.id} style={{ marginBottom: 10 }}>
                                    <div
                                      className="card-list-4 wow animate__animated animate__fadeIn hover-up"
                                      style={{ minHeight: 88, display: 'flex', gap: 10, padding: '8px' }}
                                    >
                                      <div className="image" style={{ width: 44, flex: '0 0 44px' }}>
                                        <Link href={`/job-details-2/${j.id}`}>
                                          <span
                                            style={{
                                              display: 'inline-block',
                                              width: '44px',
                                              height: '44px',
                                              borderRadius: '8px',
                                              overflow: 'hidden',
                                              backgroundColor: '#f9f9f9', // thêm nền để dễ nhìn nếu ảnh nhỏ
                                            }}
                                          >
                                            <Image
                                              src={company?.logoUrl || '/assets/imgs/brands/brand-8.png'}
                                              alt={j.companyName || 'jobBox'}
                                              width={44}
                                              height={44}
                                              style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'contain',
                                              }}
                                            />
                                          </span>
                                        </Link>
                                      </div>
                                      <div className="info-text" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1 }}>
                                        <div>
                                          <h5 className="font-md font-bold color-brand-1" style={{ fontSize: '0.95rem', marginBottom: 6 }}>
                                            <Link href={`/job-details-2/${j.id}`}>
                                              <span>{j.title || 'No title'}</span>
                                            </Link>
                                          </h5>
                                          <div className="mt-0" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                            <span className="card-briefcase" style={{ fontSize: '0.82rem' }}>{j.jobType || 'Fulltime'}</span>
<span className="card-time" style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                                              <span>{timeText}</span>
                                            </span>
                                          </div>
                                        </div>
                                        <div className="mt-5">
                                          <div className="row">
                                            <div className="col-12 text-end">
                                              <span className="card-briefcase" style={{ fontSize: '0.82rem' }}>{j.location || 'Unknown'}</span>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </li>
                                );
                              });
                          })()}
                        </ul>
                      )}
                    </div>
                  </div>
                  <div className="sidebar-border">
                    <h6 className="f-18">Tags</h6>
                    <div className="sidebar-list-job">
                      <Link href="/jobs-grid">
                        <span className="btn btn-grey-small bg-14 mb-10 mr-5">App</span>
                      </Link>

                      <Link href="/jobs-grid">
                        <span className="btn btn-grey-small bg-14 mb-10 mr-5">Digital</span>
                      </Link>

                      <Link href="/jobs-grid">
                        <span className="btn btn-grey-small bg-14 mb-10 mr-5">Marketing</span>
                      </Link>

                      <Link href="/jobs-grid">
                        <span className="btn btn-grey-small bg-14 mb-10 mr-5">Conten Writer</span>
                      </Link>

                      <Link href="/jobs-grid">
                        <span className="btn btn-grey-small bg-14 mb-10 mr-5">Sketch</span>
                      </Link>

                      <Link href="/jobs-grid">
                        <span className="btn btn-grey-small bg-14 mb-10 mr-5">PSD</span>
                      </Link>

                      <Link href="/jobs-grid">
                        <span className="btn btn-grey-small bg-14 mb-10 mr-5">Laravel</span>
                      </Link>

                      <Link href="/jobs-grid">
                        <span className="btn btn-grey-small bg-14 mb-10 mr-5">React JS</span>
                      </Link>

                      <Link href="/jobs-grid">
                        <span className="btn btn-grey-small bg-14 mb-10 mr-5">HTML</span>
                      </Link>

                      <Link href="/jobs-grid">
                        <span className="btn btn-grey-small bg-14 mb-10 mr-5">Finance</span>
                      </Link>
<Link href="/jobs-grid">
                        <span className="btn btn-grey-small bg-14 mb-10 mr-5">Manager</span>
                      </Link>

                      <Link href="/jobs-grid">
                        <span className="btn btn-grey-small bg-14 mb-10 mr-5">Business</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section className="section-box mt-50 mb-50">
            <div className="container">
              <div className="text-left">
                <h2 className="section-title mb-10 wow animate__animated animate__fadeInUp">Featured Jobs</h2>
                <p className="font-lg color-text-paragraph-2 wow animate__animated animate__fadeInUp">Get the latest news, updates and tips</p>
              </div>
              <div className="mt-50">
                <div className="box-swiper style-nav-top">
                  <FeaturedSlider />
                </div>
              </div>
            </div>
          </section>
          <section className="section-box mt-50 mb-20">
            <div className="container">
              <div className="box-newsletter">
                <div className="row">
                  <div className="col-xl-3 col-12 text-center d-none d-xl-block">
                    <Image src="/assets/imgs/template/newsletter-left.png" alt="joxBox" width={120} height={120} />
                  </div>
                  <div className="col-lg-12 col-xl-6 col-12">
                    <h2 className="text-md-newsletter text-center">
                      New Things Will Always
                      <br /> Update Regularly
                    </h2>
                    <div className="box-form-newsletter mt-40">
                      <form className="form-newsletter">
                        <input className="input-newsletter" type="text" placeholder="Enter your email here" />
                        <button className="btn btn-default font-heading icon-send-letter">Subscribe</button>
                      </form>
                    </div>
                  </div>
                  <div className="col-xl-3 col-12 text-center d-none d-xl-block">
                    <Image src="/assets/imgs/template/newsletter-right.png" alt="joxBox" width={120} height={120} />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      {/* Hiển thị chat widget để chat với tất cả employers */}
      {session?.user?.id && (
        <MultiChatWidget
          applicantId={session.user.id}
          applicantName={session?.user?.fullName ?? session?.user?.name ?? undefined}
        />
      )}
    </Layout>
  </>
  );
}