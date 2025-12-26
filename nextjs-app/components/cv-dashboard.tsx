"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { CVEmptyState } from "@/components/cv-empty-state";
import type { ResumeData } from "@/components/resume-builder";

import { mapApiToForm, resumeApi } from "@/lib/api";

import { useToast } from "./ui/use-toast";
import ResumeUpdate from "./resume-update";
import { ViewCv } from "./view-cv";
import { CVList } from "./cv-list";

type ViewState = "empty" | "list" | "builder";

export function CVDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentView, setCurrentView] = useState<ViewState>("empty");
  const [resumes, setResumes] = useState<ResumeData[]>([]);
  const [editingResume, setEditingResume] = useState<ResumeData | null>(null);
  const { toast } = useToast();
  const [previewResume, setPreviewResume] = useState<ResumeData | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const loadResumes = async () => {
    try {
      const apiResumes = await resumeApi.getMyResume();
      const mappedResumes = Array.isArray(apiResumes)
        ? apiResumes.map((r) => mapApiToForm(r))
        : apiResumes
        ? [mapApiToForm(apiResumes)]
        : [];
      setResumes(mappedResumes);

      // Nếu đang ở chế độ tạo mới (builder) do action=create, không override view
      const action =
        typeof window !== "undefined"
          ? new URLSearchParams(window.location.search).get("action")
          : null;
      if (
        currentView !== "builder" &&
        action !== "create" &&
        action !== "edit"
      ) {
        if (mappedResumes.length > 0) {
          setCurrentView("list");
        } else {
          setCurrentView("empty");
        }
      }
    } catch (error) {
      console.error("Failed to load resumes:", error);
      toast({ description: "Error: Unable to load CV list" });
      setCurrentView("empty");
    }
  };

  useEffect(() => {
    loadResumes();
  }, []);

  // Tự động mở builder khi có ?action=create
  useEffect(() => {
    const action = searchParams.get("action");
    if (action === "create") {
      setEditingResume(null);
      setCurrentView("builder");
      return;
    }

    // Deep-link: ?action=edit&id=...
    if (action === "edit") {
      const idParam = searchParams.get("id");
      if (idParam) {
        (async () => {
          try {
            // Mở builder ngay lập tức để tránh giật về list trong khi fetch
            setCurrentView("builder");
            const getDataResumeById = await resumeApi.getResumeById(idParam);
            const mappedResume = mapApiToForm(getDataResumeById);
            setEditingResume(mappedResume);
          } catch (error) {
            console.error("Failed to load resume (deeplink edit):", error);
            toast({ description: "Lỗi: Không thể tải CV" });
          }
        })();
      }
    }
  }, [searchParams]);

  const handleCreateNewCV = () => {
    setEditingResume(null);
    setCurrentView("builder");
  };

  const handleEditCV = async (resume: ResumeData) => {
    // Nếu đang ở My CV trong candidate-profile, mở trang builder riêng
    try {
      const pathname =
        typeof window !== "undefined" ? window.location.pathname : "";
      if (pathname.includes("candidate-profile")) {
        router.push(
          `/page-resume?action=edit&id=${resume.id}&source=candidate-profile`
        );
        return;
      }

      // Hành vi mặc định: load và mở builder trong cùng trang
      const getDataResumeById = await resumeApi.getResumeById(resume.id);
      const mappedResume = mapApiToForm(getDataResumeById);
      setEditingResume(mappedResume);
      setCurrentView("builder");
    } catch (error) {
      console.error("Failed to load resume:", error);
      toast({ description: "Error: Unable to load CV" });
    }
  };

  const handleDeleteCV = async (resumeId: number) => {
    try {
      await resumeApi.deleteResume(resumeId);

      // remove from local state
      setResumes((prev) => prev.filter((resume) => resume.id !== resumeId));
      if (resumes.length === 1) {
        setCurrentView("empty");
      } else {
        setCurrentView("list");
      }
      await loadResumes();
    } catch (error) {
      console.error("Failed to delete resume:", error);
      toast({ description: "Error: Unable to delete CV" });
    }
  };

  const handleBackToList = () => {
    const source = searchParams.get("source");
    if (source === "candidate-profile") {
      router.push("/candidate-profile?tab=profile");
      return;
    }
    if (resumes.length > 0) {
      setCurrentView("list");
    } else {
      setCurrentView("empty");
    }
    // Xoá param action nếu có để tránh tự mở builder lần sau
    try {
      const url = new URL(window.location.href);
      if (url.searchParams.get("action")) {
        url.searchParams.delete("action");
        const next =
          url.pathname +
          (url.searchParams.toString()
            ? `?${url.searchParams.toString()}`
            : "");
        router.replace(next);
      }
    } catch {}
  };

  const handleCVSaved = async (newResume: ResumeData) => {
    await loadResumes(); // Gọi lại API để lấy danh sách mới nhất
    const source = searchParams.get("source");
    if (source === "candidate-profile") {
      router.push(`/candidate-profile?tab=profile&cv_saved=true&resume_id=${newResume.id}`);
      return;
    }
    setCurrentView("list");
  };

  const handlePreviewCV = (resume: ResumeData) => {
    setPreviewResume(resume);
    setShowPreview(true);
  };

  if (currentView === "builder") {
    // Nếu đang tạo mới CV
    if (editingResume === null) {
      return (
        <ResumeUpdate
          onBack={handleBackToList}
          onSave={handleCVSaved}
          initialData={undefined}
        />
      );
    }
    // Nếu đang edit, chỉ render khi đã có dữ liệu
    if (!editingResume) return <div>Loading data...</div>;
    return (
      <ResumeUpdate
        onBack={handleBackToList}
        onSave={handleCVSaved}
        initialData={editingResume}
      />
    );
  }

  if (currentView === "list") {
    return (
      <>
        <CVList
          resumes={resumes}
          onCreateNew={handleCreateNewCV}
          onEditCV={handleEditCV}
          onDeleteCV={handleDeleteCV}
          onPreviewCV={handlePreviewCV}
        />
        {showPreview && previewResume && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              background: "rgba(0,0,0,0.5)",
              zIndex: 9999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={() => setShowPreview(false)}
          >
            <div
              style={{
                background: "#fff",
                borderRadius: 8,
                padding: 24,
                maxWidth: "90vw",
                maxHeight: "90vh",
                overflow: "auto",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowPreview(false)}
                style={{
                  position: "absolute",
                  top: 24,
                  right: 32,
                  zIndex: 10000,
                }}
                className="btn btn-secondary"
              >
                Close
              </button>
              {/* Hiển thị ViewCv ở chế độ chỉ xem */}
              <ViewCv
                data={previewResume}
                template={previewResume?.template || "modern"}
                customization={previewResume?.customization}
                isCompact={false}
              />
            </div>
          </div>
        )}
      </>
    );
  }

  return <CVEmptyState onCreateNew={handleCreateNewCV} />;
}