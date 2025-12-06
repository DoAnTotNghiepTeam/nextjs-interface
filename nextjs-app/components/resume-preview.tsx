"use client";

import { Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import type { ResumeData } from "./resume-builder";
import type { CustomizationOptions } from "./customization-panel";
import { ModernTemplate } from "./resume-templates/modern-template";
import { ClassicTemplate } from "./resume-templates/classic-template";
import { mapFormToApi, resumeApi } from "@/lib/api";
import styles from "./resume-preview.module.css";

interface ResumePreviewProps {
  data: ResumeData;
  template?: string;
  customization?: CustomizationOptions;
  isCompact?: boolean;
  onSave?: (resumeData: ResumeData) => void;
  resumeData?: ResumeData;
  userId: string;
  showPDFUpload?: boolean;
}

const defaultCustomization: CustomizationOptions = {
  font: "inter",
  colorScheme: "blue",
  spacing: "normal",
  fontSize: "medium",
};

export function ResumePreview({
  data,
  template = "modern",
  customization = defaultCustomization,
  isCompact = false,
  onSave,
}: // userId,
// showPDFUpload = false,
// resumeData,
ResumePreviewProps) {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveCV = async () => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      const dataWithTemplate = { ...data, template };
      // 1. Xuất PDF từ dữ liệu preview
      const pdfService = await import("@/lib/pdf-service");
      const { blob, fileName } = await pdfService.PDFService.generatePDFBlob(
        dataWithTemplate,
        template,
        customization
      );
      // Chuyển blob sang File
      const pdfFile = pdfService.PDFService.blobToFile(blob, fileName);
      // 2. Upload PDF lên Firebase
      const userIdForPath =
        data.personalInfo?.email?.replace(/[^a-zA-Z0-9]/g, "_") || "unknown";
      const resumeIdForPath = data.id ? String(data.id) : Date.now().toString();
      const storagePath = `resumes/${userIdForPath}/${resumeIdForPath}.pdf`;
      const FirebaseStorageService = (await import("@/lib/firebase-storage"))
        .FirebaseStorageService;
      const pdfUrl = await FirebaseStorageService.uploadPDF(
        pdfFile,
        storagePath
      );
      // 3. Lưu link PDF về backend
      const apiData = { ...mapFormToApi(dataWithTemplate), resumeLink: pdfUrl };
      let savedResume;
      if (data.id) {
        savedResume = await resumeApi.updateMyResume(data.id, apiData);
      } else {
        savedResume = await resumeApi.saveMyResume(apiData);
      }
      const resumeId = savedResume?.id ?? savedResume?.data?.id;
      toast({
        title: "CV saved successfully!",
        description:
          "Your CV has been saved to the server and the PDF file has been uploaded to Firebase.",
      });
      if (onSave) {
        onSave({
          ...dataWithTemplate,
          id: resumeId,
          resumeLink: pdfUrl,
        } as ResumeData);
      }
    } catch (error) {
      console.error("Error saving CV:", error);
      // const errorMessage =
      //   error.response?.data?.message ||
      //   error.message ||
      //   "Không thể lưu CV. Vui lòng thử lại.";
      // toast({
      //   title: "Lỗi khi lưu CV",
      //   description: errorMessage,
      //   variant: "destructive",
      // });
    } finally {
      setIsSaving(false);
    }
  };

  const renderTemplate = () => {
    const tpl = (template || "modern").toLowerCase();
    const normalized = tpl.includes("classic")
      ? "classic"
      : tpl.includes("modern")
      ? "modern"
      : "modern";
    switch (normalized) {
      case "classic":
        return (
          <ClassicTemplate
            data={data}
            customization={customization}
            isCompact={isCompact}
          />
        );
      case "modern":
      default:
        return (
          <ModernTemplate
            data={data}
            customization={customization}
            isCompact={isCompact}
          />
        );
    }
  };

  return (
    <div
      className={isCompact ? styles.compactPreview : `card mx-auto shadow`}
      style={
        isCompact
          ? {
              minWidth: 0,
              minHeight: 0,
              padding: 0,
              background: "#fff",
              overflow: "visible",
            }
          : { maxWidth: "56rem", maxHeight: "90vh", overflowY: "auto" }
      }
    >
      <div
        className={isCompact ? undefined : `card-body p-4`}
        style={isCompact ? { padding: 0 } : {}}
      >
        {!isCompact && (
          <div className={styles.saveButtonContainer}>
            <button
              onClick={handleSaveCV}
              disabled={isSaving}
              className={`btn btn-primary d-flex align-items-center gap-2 ${styles.saveButton}`}
            >
              <Save
                size={16}
                className={isSaving ? "spinner-border spinner-border-sm" : ""}
              />
              {isSaving ? "Saving..." : "Save CV"}
            </button>
          </div>
        )}
        <div
          className={!isCompact ? "shadow-lg" : "d-flex justify-content-center"}
          style={
            isCompact
              ? { width: "100%", height: "100%", overflow: "hidden" }
              : { aspectRatio: "8.5 / 11" }
          }
        >
          {renderTemplate()}
        </div>
      </div>
    </div>
  );
}
