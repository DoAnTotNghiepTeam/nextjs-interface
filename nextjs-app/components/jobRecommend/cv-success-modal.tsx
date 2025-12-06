
"use client"

import { useEffect, useState } from "react"
import { X, Heart, Download, Edit3, ArrowRight } from "lucide-react"
import "./CVSuccessModal.css"
import { useRouter } from "next/navigation"
import { exportResumeToPDF } from "../pdf-export"
import type { ResumeData } from "@/components/resume-builder"
import { fetchRecommendedJobs } from "@/lib/recommentJob/api"
import { useSession } from "next-auth/react"
import Link from "next/link";

interface Job {
  jobPostingId: string
  jobTitle: string
  salary_range: string
  location: string
  logoUrl: string
  description: string
  companyName: string
  major?: string
  isLiked?: boolean
}

interface CVSuccessModalProps {
  isOpen: boolean
  onClose: () => void
  resumeId: string | null
  resume?: ResumeData | null
}

export function CVSuccessModal({ isOpen, onClose, resumeId, resume }: CVSuccessModalProps) {
  const router = useRouter()
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(false)
  const { data: session } = useSession()
  const candidateId = session?.user?.id ? Number(session.user.id) : 0
  console.log("candidateId", candidateId)

  useEffect(() => {
    if (isOpen && candidateId) {
      setLoading(true)
      fetchRecommendedJobs(candidateId, 5, 30).then((data) => {
        if (data && data.recommendations) {
          setJobs(data.recommendations)
        }
        setLoading(false)
      })
    }
  }, [isOpen, candidateId])

  if (!isOpen) return null

  const handleViewAll = () => {
    router.push(`/jobs-grid?keyword=${encodeURIComponent(jobs[0]?.major || "")}`);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        {/* Header */}
        <div className="modal-header">
          <button onClick={onClose} className="modal-close">
            <X size={24} />
          </button>
          <div className="modal-success">
            <div className="modal-icon">
              <img
                src="/assets/imgs/template/logoJobBox.png"
                alt="Success Logo"
                className="w-12 h-12 object-contain"
              />
            </div>
            <div>
              <h2 className="modal-title">CV saved successfully!</h2>
              <div className="modal-actions">
                <button
                  className="btn-outline"
                  onClick={() => {
                    onClose()
                    router.push(`/page-resume?action=edit&id=${resumeId}&source=candidate-profile`)
                  }}
                >
                  <Edit3 size={16} />
                  <span>Continue Editing</span>
                </button>

                <button
                  className="btn-outline d-flex align-items-center gap-2"
                  onClick={async () => {
                    if (resume) {
                      await exportResumeToPDF(resume, (resume as ResumeData)?.template || "modern")
                    } else {
                      console.error("Resume is missing!")
                    }
                  }}
                >
                  <Download size={16} />
                  <span>Download</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Job Recommendations */}
        <div className="modal-body">
          <div className="modal-jobs-header">
            <h3>
              Jobs in <span>{jobs[0]?.major || ""}</span> that match your CV
            </h3>
            <button onClick={handleViewAll} className="btn-see-all">
              <span>View All</span>
              <ArrowRight size={16} />
            </button>
          </div>

          <div className="job-list">
            {loading ? (
              <p>Đang tải...</p>
            ) : jobs.length > 0 ? (
              jobs.map((job) => (
                <div key={job.jobPostingId} className="job-card">
                  <div className="job-header">
                    <div className="job-logo-title">
                      <div className="job-logo">
                        {job.logoUrl ? (
                          <img src={job.logoUrl} alt={job.companyName} />
                        ) : (
                          <span>{job.companyName?.[0]}</span>
                        )}
                      </div>
                      {/* <h4 className="job-title">{job.jobTitle}</h4> */}
                      <h4 className="job-title">
                        <Link href={`/job-details-2/${job.jobPostingId}`}>
                                  <span>{job.jobTitle || "No title"}</span>
                        </Link>
                      </h4>
                      
                    </div>
                    <button className="job-like">
                      <Heart size={18} />
                    </button>
                  </div>
                  <p className="job-company">
                    {job.description?.length > 150
                      ? job.description.substring(0, 150) + "..."
                      : job.description}
                  </p>
                  <div className="job-tags">
                    <span>{job.salary_range}</span>
                    <span style={{marginLeft: "8px"}}>{job.location}</span>
                  </div>
                </div>
              ))
            ) : (
              <p>Không tìm thấy việc làm phù hợp</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

