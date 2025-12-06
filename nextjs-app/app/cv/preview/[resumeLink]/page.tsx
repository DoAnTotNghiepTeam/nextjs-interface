"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { mapApiToForm, resumeApi } from "@/lib/api";
import type { ResumeData } from "@/components/resume-builder";
import { ResumeCardItem } from "@/components/resume-card-item";

export default function ResumeDetailPage() {
  const { resumeLink } = useParams<{ resumeLink: string }>();
  const [resume, setResume] = useState<ResumeData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const res = await resumeApi.getResumeByLink(resumeLink);
        console.log("API lấy CV theo link:", res);
        setResume(mapApiToForm(res));
      } catch (err) {
        console.error("Lỗi khi tải CV:", err);
      } finally {
        setLoading(false);
      }
    };

    if (resumeLink) fetchResume();
  }, [resumeLink]);

  if (loading) return <div className="p-8">Đang tải CV...</div>;
  if (!resume) return <div className="p-8">Không tìm thấy CV</div>;

  return (
    <div
    style={{
      // minHeight: "100vh",
      // display: "flex",
      // justifyContent: "center",
      // padding: "2rem",
      backgroundImage: "url('/assets/imgs/brands/anh_nen_cv.jpg')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    }}
    >
      <ResumeCardItem
        data={resume}
        template={resume.template || "modern"}
        isCompact={false} // Hiển thị full size
      />
    </div>
  );
}
