"use client";

// import { useToast } from "@/hooks/use-toast";
// import { useState } from "react";
import type { ResumeData } from "./resume-builder";
import type { CustomizationOptions } from "./customization-panel";
import { DEFAULT_CUSTOMIZATION } from "./customization-panel";
import { ModernTemplate } from "./resume-templates/modern-template";
import { ClassicTemplate } from "./resume-templates/classic-template";
import { SidebarTemplate } from "./resume-templates/sidebar-template";
// import { mapFormToApi, resumeApi } from "@/lib/api";

interface viewCvProps {
  data: ResumeData;
  template?: string;
  customization?: CustomizationOptions;
  isCompact?: boolean;
  onSave?: (resumeData: ResumeData) => void;
  resumeData?: ResumeData;
}

const defaultCustomization: CustomizationOptions = {
  font: DEFAULT_CUSTOMIZATION.font,
  colorScheme: DEFAULT_CUSTOMIZATION.colorScheme,
  spacing: DEFAULT_CUSTOMIZATION.spacing,
  fontSize: DEFAULT_CUSTOMIZATION.fontSize,
  backgroundPattern: DEFAULT_CUSTOMIZATION.backgroundPattern,
};

export function ViewCv({
  data,
  template = "modern",
  customization = defaultCustomization,
  isCompact = false,
  // onSave,
}: // resumeData,
viewCvProps) {
  // const { toast } = useToast();
  // const [isSaving, setIsSaving] = useState(false);

  // const handleSaveCV = async () => {
  //   if (isSaving) return;
  //   setIsSaving(true);
  //   try {
  //     const apiData = mapFormToApi(data);
  //     if (data.id) {
  //       await resumeApi.updateMyResume(data.id, apiData);
  //     } else {
  //       await resumeApi.saveMyResume(apiData);
  //     }

  //     toast({
  //       title: "Lưu CV thành công!",
  //       description: "CV của bạn đã được lưu lên server.",
  //     });

  //     if (onSave) {
  //       onSave(data);
  //     }
  //   } catch (error: any) {
  //     console.error("Error saving CV:", error);
  //     const errorMessage =
  //       error.response?.data?.message ||
  //       error.message ||
  //       "Không thể lưu CV. Vui lòng thử lại.";
  //     toast({
  //       title: "Lỗi khi lưu CV",
  //       description: errorMessage,
  //       variant: "destructive",
  //     });
  //   } finally {
  //     setIsSaving(false);
  //   }
  // };

  const renderTemplate = () => {
    switch (template) {
      case "classic":
        return (
          <ClassicTemplate
            data={data}
            customization={customization}
            isCompact={isCompact}
          />
        );
      case "sidebar":
        return (
          <SidebarTemplate
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
      className={isCompact ? "" : "mx-auto shadow-lg"}
      style={
        isCompact
          ? {}
          : {
              maxWidth: "56rem",
              background: "#fff",
              borderRadius: 12,
              padding: 32,
            }
      }
    >
      <div style={isCompact ? {} : { aspectRatio: "8.5 / 11" }}>
        {renderTemplate()}
      </div>
    </div>
  );
}
