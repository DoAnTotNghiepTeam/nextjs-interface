"use client";

import { forwardRef } from "react";
import type { ResumeData } from "./resume-builder";
import type { CustomizationOptions } from "./customization-panel";
import { ModernTemplate } from "./resume-templates/modern-template";
import { ClassicTemplate } from "./resume-templates/classic-template";

interface PrintableResumeProps {
  data: ResumeData;
  template: string;
  customization: CustomizationOptions;
}

export const PrintableResume = forwardRef<HTMLDivElement, PrintableResumeProps>(
  ({ data, template, customization }, ref) => {
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
              isCompact={false}
            />
          );
        case "modern":
        default:
          return (
            <ModernTemplate
              data={data}
              customization={customization}
              isCompact={false}
            />
          );
      }
    };

    return (
      <div
        ref={ref}
        className="print-container bg-white text-black"
        style={{
          width: "210mm",
          minHeight: "297mm",
          fontSize: "12pt",
          lineHeight: "1.4",
        }}
      >
        <style
          dangerouslySetInnerHTML={{
            __html: `
            @media print {
              .print-container {
                width: 100% !important;
                height: 100% !important;
                margin: 0 !important;
                padding: 0 !important;
                box-shadow: none !important;
              }
              
              * {
                -webkit-print-color-adjust: exact !important;
                color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
              
              .no-print {
                display: none !important;
              }
              
              .print-break {
                page-break-before: always;
              }
              
              /* Reset Bootstrap print styles */
              .d-print-inline,
              .d-print-inline-block,
              .d-print-block,
              .d-print-none {
                display: inherit !important;
              }
              
              /* Ensure proper layout */
              .d-flex {
                display: flex !important;
              }
              
              .align-items-center {
                align-items: center !important;
              }
              
              .justify-content-between {
                justify-content: space-between !important;
              }
              
              /* Ensure proper spacing */
              .rounded-lg {
                border-radius: 0.5rem !important;
              }
              
              /* Fix text colors */
              .text-white {
                color: white !important;
              }
              
              .text-muted {
                color: #6b7280 !important;
              }
              
              /* Ensure background colors */
              .bg-white {
                background-color: white !important;
              }
            }
          `,
          }}
        />
        {renderTemplate()}
      </div>
    );
  }
);

PrintableResume.displayName = "PrintableResume";
