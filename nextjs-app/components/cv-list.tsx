"use client";

import { CVCard } from "@/components/cv-card";
// import { useRouter } from "next/navigation";
import type { ResumeData } from "@/components/resume-builder";

interface CVListProps {
  resumes: ResumeData[];
  onCreateNew: () => void;
  onEditCV: (resume: ResumeData) => void;
  onDeleteCV: (index: number) => void;
  onPreviewCV: (resume: ResumeData) => void;
}

export function CVList({
  resumes,
  // onCreateNew,
  onEditCV,
  onDeleteCV,
  onPreviewCV,
}: CVListProps) {
  // const router = useRouter();
  return (
    <div className="pb-4">
      <div className="container">
        {/* Header */}
        {/* <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="d-flex align-items-center gap-2">
            <button
              className="btn btn-link p-0 me-2"
              style={{ boxShadow: "none" }}
              onClick={() => router.push("/")}
              title="Quay lại trang chủ"
            >
              <ArrowLeft size={22} />
            </button>
          </div>
          <button
            className="btn btn-primary fw-semibold px-3"
            onClick={onCreateNew}
          >
            + Tạo CV
          </button>
        </div> */}

        {/* Resume grid */}
        <div className="row g-3">
          {Array.isArray(resumes) && resumes.length > 0 ? (
            resumes.map((resume) => {
              const id = resume?.id;
              if (typeof id === "number" && id !== null && id !== undefined) {
                return (
                  <div className="col-md-4" key={id}>
                    <CVCard
                      resume={resume}
                      onEdit={() => onEditCV(resume)}
                      onDelete={() => onDeleteCV(id)}
                      onPreview={() => onPreviewCV(resume)}
                    />
                  </div>
                );
              }
              return null;
            })
          ) : (
            <div className="text-center text-muted py-5">No CV yet</div>
          )}
        </div>
      </div>
    </div>
  );
}
