"use client";
/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import Image from "next/image";
import Layout from "@/components/Layout/Layout";

import React, { useState } from "react";
import { useParams } from "next/navigation";

type Company = {
  id?: string | number;
  employer?: { id?: string | number } | null;
  bannerUrl?: string;
  logoUrl?: string;
  companyName?: string;
  location?: string;
  industry?: string;
  description?: string;
  address?: string;
  website?: string;
  phone?: string;
  email?: string;
  // Add other properties as needed
};
type Job = {
  id: string | number;
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
};

export default function CompanyDetails() {
  const params = useParams();
  const [job, setJob] = useState<Job | null>(null);
  const [activeIndex, setActiveIndex] = useState<number>(1);
  const companyId = params?.id as string; // id lấy từ URL

  const [company, setCompany] = useState<Company | null>(null);

  // Jobs state for Latest Jobs list (filter by this company)
  const [jobs, setJobs] = useState<Job[]>([]);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [jobsError, setJobsError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const jobsPerPage = 3;

  React.useEffect(() => {
    async function fetchCompany() {
      try {
        // Gọi API với id lấy từ URL
        // add lightweight logging to help debug when running locally
        // eslint-disable-next-line no-console
        console.log('[CompanyDetails] fetching company for id=', companyId);
        const data = await import("@/lib/company/api").then(m => m.getCompanyById(companyId));
        // eslint-disable-next-line no-console
        console.log('[CompanyDetails] company data:', data);
        setCompany(data);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('[CompanyDetails] fetchCompany error', err);
        setCompany(null);
      }
    }
    if (companyId) fetchCompany();
  }, [companyId]);

  // Fetch all jobs once and filter by company later
  React.useEffect(() => {
    let mounted = true;
    const fetchJobs = async () => {
      setJobsLoading(true);
      setJobsError(null);
      try {
        // eslint-disable-next-line no-console
        console.log('[CompanyDetails] fetching all jobs');
        const res = await fetch("http://localhost:8080/api/job-postings/all");
        // eslint-disable-next-line no-console
        console.log('[CompanyDetails] jobs response status=', res.status);
        if (!res.ok) throw new Error("Không thể lấy danh sách công việc");
        const data = await res.json();
        // eslint-disable-next-line no-console
        console.log('[CompanyDetails] jobs loaded count=', Array.isArray(data) ? data.length : 'not-array');
        if (!mounted) return;
        setJobs(Array.isArray(data) ? data : []);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('[CompanyDetails] fetchJobs error', err);
        setJobsError((err as Error).message || "Lỗi khi lấy công việc");
      } finally {
        if (mounted) setJobsLoading(false);
      }
    };
    fetchJobs();
    return () => { mounted = false };
  }, []);

  // Helpers to parse/format createdAt similar to job-details-2
  const parseToDate = (val: string | number | Date | null | undefined): Date | null => {
    if (val === null || val === undefined || val === '') return null;
    if (typeof val === 'number') {
      return new Date(val > 1e12 ? val : val * 1000);
    }
    if (val instanceof Date) return val;
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
    return date.toLocaleDateString();
  };


  const handleOnClick = (index: number) => {
    setActiveIndex(index);
  };

  // reset pagination when company changes or jobs reload
  React.useEffect(() => {
    setCurrentPage(1);
  }, [companyId, company?.id, company?.companyName, jobs.length]);

  return (
    <>
      <Layout>
        <div>
          <section className="section-box-2">
            <div className="container">
              <div className="banner-hero banner-image-single">
                <img src={company?.bannerUrl || "assets/imgs/page/company/img.png"} 
                alt={company?.companyName || "jobBox"}
                 style={{
                  width: "100%",         // banner chiếm full chiều ngang
                  height: "250px",       // chiều cao mặc định
                  objectFit: "cover",    // ảnh không bị méo, tự cắt cho vừa
                  borderRadius: "8px"    // bo góc nhẹ
                }} />
              </div>
              <div className="box-company-profile">
                <div className="image-compay">
                  <img src={company?.logoUrl || "assets/imgs/page/company/company.png"} 
                  alt={company?.companyName || "jobBox"} 
                  style={{
                  width: "100px",       // logo mặc định 100px
                  height: "100px",
                  objectFit: "contain", // giữ tỉ lệ logo
                  borderRadius: "8px",  // bo góc nhẹ
                  background: "#fff",   // nền trắng
                  padding: "5px"        // khoảng cách bên trong
                }}
                 />
                </div>
                <div className="row mt-10">
                  <div className="col-lg-8 col-md-12">
                    <h5 className="f-18">
                      {company?.companyName || "Company name"} <span className="card-location font-regular ml-20">{company?.location || "Location"}</span>
                    </h5>
                    <p className="mt-5 font-md color-text-paragraph-2 mb-15">{company?.industry || "Our Mission to make working life simple"}</p>
                  </div>
                  {/* <div className="col-lg-4 col-md-12 text-lg-end">
                    <Link href="page-contact">
                      <span className="btn btn-call-icon btn-apply btn-apply-big">Contact us</span>
                    </Link>
                  </div> */}
                </div>
              </div>
              <div className="box-nav-tabs mt-40 mb-5">
                <ul className="nav" role="tablist">
                  <li>
                    <a className={`btn btn-border aboutus-icon mr-15 mb-5${activeIndex === 1 ? " active" : ""}`} onClick={() => handleOnClick(1)}>
                      About us
                    </a>
                  </li>
                  {/* <li>
                    <a className={`btn btn-border recruitment-icon mr-15 mb-5${activeIndex === 2 ? " active" : ""}`} onClick={() => handleOnClick(2)}>
                      Recruitments
                    </a>
                  </li>
                  <li>
                    <a className={`btn btn-border people-icon mb-5${activeIndex === 3 ? " active" : ""}`} onClick={() => handleOnClick(3)}>
                      People
                    </a>
                  </li> */}
                </ul>
              </div>
              <div className="border-bottom pt-10 pb-10" />
            </div>
          </section>
          <section className="section-box mt-50">
            <div className="container">
              <div className="row">
                <div className="col-lg-8 col-md-12 col-sm-12 col-12">
                  <div className="content-single">
                    <div className="tab-content">
                      <div className={`tab-pane fade ${activeIndex === 1 && "show active"}`}>
                        <h4>Welcome to {company?.companyName}</h4>
                        <p>{company?.description || "Our Mission to make working life simple"}</p>
                      </div>
                      <div className={`tab-pane fade ${activeIndex === 2 && "show active"}`}>
                        <h4>Recruitments</h4>
                        <p>The {company?.companyName} Design team has a vision to establish a trusted platform that enables productive and healthy enterprises in a world of digital and remote everything, constantly changing work patterns and norms, and the need for organizational resiliency.</p>
                        <p>The ideal candidate will have strong creative skills and a portfolio of work which demonstrates their passion for illustrative design and typography. This candidate will have experiences in working with numerous different design platforms such as digital and print forms.</p>
                      </div>
                      <div className={`tab-pane fade ${activeIndex === 3 && "show active"}`}>
                        <h4>People</h4>
                        <p>The AliStudio Design team has a vision to establish a trusted platform that enables productive and healthy enterprises in a world of digital and remote everything, constantly changing work patterns and norms, and the need for organizational resiliency.</p>
                        <p>The ideal candidate will have strong creative skills and a portfolio of work which demonstrates their passion for illustrative design and typography. This candidate will have experiences in working with numerous different design platforms such as digital and print forms.</p>
                      </div>
                    </div>
                  </div>
                  <div className="box-related-job content-page">
                    <h5 className="mb-30">Latest Jobs</h5>
                      <div className="box-list-jobs display-list">
                        {jobsLoading && <div>Đang tải công việc...</div>}
                        {jobsError && <div className="text-danger">{jobsError}</div>}
                        {!jobsLoading && !jobsError && (
                          (() => {
                            // determine the company/employer key: prefer employer.id from company API, then company id, then company name
                            const companyEmployerId = company?.employer?.id ?? null;
                            const companyKey = companyEmployerId ?? company?.id ?? companyId ?? company?.companyName ?? null;
                            const filtered = jobs
                              .slice()
                              .filter((j: Job) => {
                                if (!companyKey) return false;
                                // compare against several possible employer identifiers (job may contain employer.id, employerId or employerName)
                                const jobEmployerKey = j.employer?.id ?? (j as any).employer?._id ?? j.employerId ?? j.employerName ?? j.employer?.name ?? '';

                                // First try matching by employer id (most reliable). If companyKey looks like an id and matches job's employer id, include it.
                                if (companyEmployerId && (String(jobEmployerKey) === String(companyEmployerId))) return true;

                                // Fallbacks: compare job.employerId / job.employerName / job.companyName against companyKey/companyName
                                if (String(jobEmployerKey) === String(companyKey)) return true;
                                if (String(j.companyName ?? '') === String(company?.companyName ?? '')) return true;
                                // case-insensitive name match
                                if (typeof j.companyName === 'string' && typeof company?.companyName === 'string' && j.companyName.toLowerCase() === company.companyName.toLowerCase()) return true;

                                return false;
                              })
                              .sort((a: Job, b: Job) => new Date(b.createdAt ?? '').getTime() - new Date(a.createdAt ?? '').getTime());

                            const total = filtered.length;
                            const totalPages = Math.max(1, Math.ceil(total / jobsPerPage));
                            const start = (currentPage - 1) * jobsPerPage;
                            const pageItems = filtered.slice(start, start + jobsPerPage);

                            return (
                              <>
                                {pageItems.length === 0 ? (
                                  <div>Không có công việc nào cho công ty này.</div>
                                ) : (
                                  <div className="row">
                                    {pageItems.map((j) => {
                                      const createdDate = parseToDate(j.createdAt);
                                      const timeText = createdDate ? formatCreatedAt(createdDate) : '';
                                      return (
                                        <div className="col-xl-12 col-12" key={j.id}>
                                          <div className="card-grid-2 hover-up">
                                            <span className="flash" />
                                            <div className="row">
                                              <div className="col-lg-6 col-md-6 col-sm-12">
                                                <div className="card-grid-2-image-left">
                                                  <div className="image-box">
                                                    <Image
                                                      src={company?.logoUrl || '/assets/imgs/brands/brand-6.png'}
                                                      alt={j.companyName || 'jobBox'}
                                                      width={56}
                                                      height={56}
                                                      className="img-fluid rounded-2"
                                                      style={{ objectFit: 'contain', background: '#fff' }}
                                                      priority={false}
                                                    />
                                                  </div>
                                                  <div className="right-info">
                                                    <Link href={`/company-details/${companyId ?? company?.id ?? ''}`}>
                                                      <span className="name-job">{company?.companyName || j.companyName || 'Company'}</span>
                                                    </Link>
                                                    <span className="location-small">{j.location || company?.location || 'Unknown'}</span>
                                                  </div>
                                                </div>
                                              </div>
                                              <div className="col-lg-6 text-start text-md-end pr-60 col-md-6 col-sm-12">
                                                <div className="pl-15 mb-15 mt-30">
                                                  {j.requiredSkills && j.requiredSkills.slice(0,2).map((s, idx) => (
                                                    <Link key={idx} href="#">
                                                      <span className="btn btn-grey-small mr-5">{s}</span>
                                                    </Link>
                                                  ))}
                                                </div>
                                              </div>
                                            </div>
                                            <div className="card-block-info">
                                              <h4>
                                                <Link href={`/job-details-2/${j.id}`}>
                                                  <span>{j.title || 'No title'}</span>
                                                </Link>
                                              </h4>
                                              <div className="mt-5">
                                                <span className="card-briefcase">{j.jobType || 'Full time'}</span>
                                                <span className="card-time">
                                                  <span>{timeText}</span>
                                                </span>
                                              </div>
                                              <p className="font-sm color-text-paragraph mt-10">{j.description ? (typeof j.description === 'string' ? j.description.slice(0,150) + (j.description.length>150 ? '...' : '') : '') : '—'}</p>
                                              <div className="card-2-bottom mt-20">
                                                <div className="row">
                                                  <div className="col-lg-7 col-7">
                                                    <span className="card-text-price">{j.salaryRange || '$0'}</span>
                                                    <span className="text-muted">/Tháng</span>
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
                                      );
                                    })}
                                  </div>
                                )}

                                {/* Pagination controls */}
                                <div className="paginations mt-20">
                                  <ul className="pager">
                                    <li>
                                      <a className="pager-prev" href="#" onClick={(e) => { e.preventDefault(); setCurrentPage((p) => Math.max(1, p-1)); }} />
                                    </li>
                                    {Array.from({ length: totalPages }).map((_, i) => (
                                      <li key={i}>
                                        <a href="#" onClick={(e) => { e.preventDefault(); setCurrentPage(i+1); }}>
                                          <span className={`pager-number ${currentPage === i+1 ? 'active' : ''}`}>{i+1}</span>
                                        </a>
                                      </li>
                                    ))}
                                    <li>
                                      <a className="pager-next" href="#" onClick={(e) => { e.preventDefault(); setCurrentPage((p) => Math.min(totalPages, p+1)); }} />
                                    </li>
                                  </ul>
                                </div>
                              </>
                            );
                          })()
                        )}
                      </div>
                    
                  </div>
                </div>
                <div className="col-lg-4 col-md-12 col-sm-12 col-12 pl-40 pl-lg-15 mt-lg-30">
                  <div className="sidebar-border">
                    <div className="sidebar-heading">
                      <div className="avatar-sidebar">
                        <div className="sidebar-info pl-0">
                          <span className="sidebar-company">{company?.companyName}</span>
                          <span className="card-location">{company?.location}</span>
                        </div>
                      </div>
                    </div>
                    <div className="sidebar-list-job">
                      {/* <div className="box-map">
                        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2970.3150609575905!2d-87.6235655!3d41.886080899999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x880e2ca8b34afe61%3A0x6caeb5f721ca846!2s205%20N%20Michigan%20Ave%20Suit%20810%2C%20Chicago%2C%20IL%2060601%2C%20Hoa%20K%E1%BB%B3!5e0!3m2!1svi!2s!4v1658551322537!5m2!1svi!2s" allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
                      </div> */}
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
                    </div>
                    <div className="sidebar-list-job">
                      <ul>
                        <li>
                          <div className="sidebar-icon-item">
                            <i className="fi-rr-briefcase" />
                          </div>
                          <div className="sidebar-text-info">
                            <span className="text-description">Company field</span>
                            <strong className="small-heading">{company?.industry}</strong>
                          </div>
                        </li>
                        <li>
                          <div className="sidebar-icon-item">
                            <i className="fi-rr-marker" />
                          </div>
                          <div className="sidebar-text-info">
                            <span className="text-description">Location</span>
                            <strong className="small-heading">{company?.address}</strong>
                          </div>
                        </li>
                        <li>
                          <div className="sidebar-icon-item">
                            <i className="fi-rr-dollar" />
                          </div>
                          <div className="sidebar-text-info">
                            <span className="text-description">website</span>
                            <strong className="small-heading">{company?.website}</strong>
                          </div>
                        </li>
                        <li>
                          <div className="sidebar-icon-item">
                            <i className="fi-rr-clock" />
                          </div>
                          <div className="sidebar-text-info">
                            <span className="text-description">Member since</span>
                            <strong className="small-heading">Jul 2012</strong>
                          </div>
                        </li>
                        <li>
                          <div className="sidebar-icon-item">
                            <i className="fi-rr-time-fast" />
                          </div>
                          <div className="sidebar-text-info">
                            <span className="text-description">Last Jobs Posted</span>
                            <strong className="small-heading">4 days</strong>
                          </div>
                        </li>
                      </ul>
                    </div>
                    <div className="sidebar-list-job">
                      <ul className="ul-disc">
                        <li>Address: {company?.address}, {company?.location}</li>
                        <li>Phone: {company?.phone}</li>
                        <li>Email: {company?.email}</li>
                      </ul>
                      <div className="mt-30">
                        <Link href="page-contact">
                          <span className="btn btn-send-message">Send Message</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="sidebar-border-bg bg-right">
                    <span className="text-grey">WE ARE</span>
                    <span className="text-hiring">HIRING</span>
                    <p className="font-xxs color-text-paragraph mt-5">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae architecto</p>
                    <div className="mt-15">
                      <Link href="page-contact">
                        <span className="btn btn-paragraph-2">Know More</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section className="section-box mt-50 mb-20">
            <div className="container">
              <div className="box-newsletter">
                <div className="row">
                  <div className="col-xl-3 col-12 text-center d-none d-xl-block">
                    <img src="assets/imgs/template/newsletter-left.png" alt="joxBox" />
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
                    <img src="assets/imgs/template/newsletter-right.png" alt="joxBox" />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </Layout>
    </>
  );
}
