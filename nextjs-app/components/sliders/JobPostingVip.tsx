"use client"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import "./JobCardVip.css"
import { getCompanyByEmployerId } from "@/lib/company/api"

const JobPostingVip = () => {
  const [jobs, setJobs] = useState<any[]>([])
  const [companyInfoMap, setCompanyInfoMap] = useState<{ [key: string]: any }>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [isVisible, setIsVisible] = useState(false)
  const [animationPhase, setAnimationPhase] = useState<"loading" | "loaded" | "error">("loading")

  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true)
      },
      { threshold: 0.1 },
    )
    if (containerRef.current) observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  // Fetch job VIP
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true)
      setError("")
      setAnimationPhase("loading")
      try {
        const res = await fetch("http://localhost:8080/api/job-postings/all")
        if (!res.ok) throw new Error("Không thể lấy danh sách công việc")
        const data = await res.json()
        const vipJobs = data.filter((job: any) => job.postType === "vip")
        setJobs(
          vipJobs.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
        )

        const employerIds = Array.from(new Set(vipJobs.map((job: any) => job.employerId).filter(Boolean)))
        const companyResults = await Promise.all(
          employerIds.map(async (employerId) => {
            try {
              const company = await getCompanyByEmployerId(employerId)
              return { employerId, company }
            } catch {
              return { employerId, company: null }
            }
          }),
        )
        const companyMap: { [key: string]: any } = {}
        companyResults.forEach(({ employerId, company }) => {
          companyMap[employerId] = company
        })
        setCompanyInfoMap(companyMap)
        setTimeout(() => setAnimationPhase("loaded"), 300)
      } catch (err: any) {
        setError(err.message || "Lỗi không xác định")
        setAnimationPhase("error")
      } finally {
        setLoading(false)
      }
    }
    fetchJobs()
  }, [])

  // Chỉ scroll khi nhấn mũi tên
  const scroll = (direction: "left" | "right") => {
    if (!containerRef.current) return
    const container = containerRef.current
    const scrollStep = 340
    const targetScroll = container.scrollLeft + (direction === "left" ? -scrollStep : scrollStep)
    container.scrollTo({ left: targetScroll, behavior: "smooth" })
  }

  const isScrolling = jobs.length > 6
  const jobsToRender = isScrolling ? jobs : jobs

  return (
    <div className={`job-vip-wrapper ${isVisible ? "fade-in" : ""}`}>
      {isScrolling && (
        <>
          <button className="nav-btn left" onClick={() => scroll("left")}>
            <span className="nav-icon">⬅</span>
          </button>
          <button className="nav-btn right" onClick={() => scroll("right")}>
            <span className="nav-icon">➡</span>
          </button>
        </>
      )}

      <div ref={containerRef} className={`${isScrolling ? "job-vip-slider" : "job-vip-grid"} ${animationPhase}`}>
        {loading && (
          <div className="job-vip-loading">
            <div className="loading-spinner"></div>
            <span>Đang tải dữ liệu...</span>
          </div>
        )}
        {error && (
          <div className="job-vip-error">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}
        {!loading && !error && jobsToRender.length === 0 && (
          <div className="job-vip-empty">
            <span className="empty-icon">📋</span>
            Không có bài đăng VIP nào
          </div>
        )}
        {!loading &&
          !error &&
          jobsToRender.length > 0 &&
          jobsToRender.map((job: any, index: number) => {
            const company = job.employerId ? companyInfoMap[job.employerId] : null
            return (
              <div
                key={job.id + "-" + index}
                className="job-card-vip"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="company">
                  <img
                    src={company?.logoUrl || "//assets/imgs/brands/brand-1.png"}
                    alt={company?.companyName || "Company Logo"}
                    className="logo"
                  />
                  <div>
                    <h3 className="companyName">{company?.companyName || "Company Name"}</h3>
                    <span className="posted-time">
                      {job.createdAt
                        ? (() => {
                            const diffMs = Date.now() - new Date(job.createdAt).getTime()
                            const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
                            if (diffDays === 0) {
                              const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
                              return (
                                <>
                                  🕒 {diffHours} giờ trước
                                </>
                              )
                            }
                            return <>📅 {diffDays} ngày trước</>
                          })()
                        : "Chưa xác định"}
                    </span>
                  </div>
                  <span className="badge-vip">★ VIP</span>
                </div>

                <h2 className="jobTitle">
                  <Link href={`/job-details-2/${job.id}`} target="_blank" rel="noopener noreferrer">
                    {job.title}
                  </Link>
                </h2>

                <div className="info">
                  <span>📍 {job.location}</span>
                  <span>⏰ {job.endAt ? new Date(job.endAt).toLocaleDateString("vi-VN") : "Không xác định"}</span>
                </div>

                <div className="info">
                  <span>
                    {job.description
                      ? job.description.length > 100
                        ? job.description.slice(0, 100) + "..."
                        : job.description
                      : "No description"}
                  </span>
                </div>

                <div className="salary">
                  {job.salaryRange ? job.salaryRange : "Thương lượng"} / Month
                  <br />
                  <span className="competitive">🔥 Competitive</span>
                </div>

                <Link href="/jobs-grid" className="apply-btn">
                  <span className="btn-text">Apply Now</span>
                  <span className="btn-arrow">→</span>
                </Link>
              </div>
            )
          })}
      </div>
    </div>
  )
}

export default JobPostingVip
