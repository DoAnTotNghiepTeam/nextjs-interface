"use client";

import { useRef, useState } from "react";
import type { ResumeData } from "./resume-builder";
import type { CustomizationOptions } from "./customization-panel";
import { PrintableResume } from "./printable-resume";
import { createRoot } from "react-dom/client";

interface PDFExportProps {
  data: ResumeData;
  template: string;
  customization: CustomizationOptions;
  onSave?: (resumeData: ResumeData) => void;
  resumeData?: ResumeData;
}

export function PDFExport({ data, template, customization }: PDFExportProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    if (!contentRef.current) return;
    setIsExporting(true);
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      setIsExporting(false);
      return;
    }
    const printContent = contentRef.current.innerHTML;
    // Copy all <link rel="stylesheet"> and <style> from main document
    let styles = "";
    // Copy <link rel="stylesheet">
    document.querySelectorAll('link[rel="stylesheet"]').forEach((link) => {
      styles += link.outerHTML;
    });
    // Copy <style>
    document.querySelectorAll("style").forEach((style) => {
      styles += style.outerHTML;
    });
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${data.personalInfo.fullName || "Resume"}_CV</title>
          <meta charset="utf-8">
          ${styles}
          <style>
            @page { size: A4; margin: 0.5in; }
            body {
              margin: 0;
              padding: 0;
              font-family: system-ui, -apple-system, sans-serif;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .print-container { width: 100%; height: 100%; margin: 0; padding: 0; box-shadow: none; }
            .print-safe * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
            .no-print { display: none !important; }
            
            /* Reset Bootstrap print styles that might conflict */
            @media print {
              .d-print-inline,
              .d-print-inline-block,
              .d-print-block,
              .d-print-none {
                display: inherit !important;
              }
            }
            
            /* Ensure proper layout for print */
            .bg-white {
              background-color: white !important;
            }
            
            /* Fix flexbox issues in print */
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
          </style>
        </head>
        <body>
          ${printContent}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
        setIsExporting(false);
        setExportSuccess(true);
        setTimeout(() => setExportSuccess(false), 3000);
      }, 500);
    };
  };

  return (
    <div className="mb-4">
      {/* Bootstrap Card */}
      <div className="card shadow-sm">
        <div className="card-header d-flex align-items-center">
          <i className="bi bi-file-earmark-text me-2"></i>
          <h5 className="mb-0">Export PDF</h5>
        </div>
        <div className="card-body">
          {/* Export Section */}
          <div className="d-flex justify-content-between align-items-center p-3 bg-light rounded mb-3">
            <div>
              <h6 className="fw-semibold">Download Resume</h6>
              <p className="text-muted small mb-0">
                Export resume as PDF for printing or sending to employers
              </p>
            </div>
            <div className="d-flex align-items-center gap-2">
              {exportSuccess ? (
                <span className="badge bg-success d-flex align-items-center">
                  <i className="bi bi-check-circle me-1"></i>
                  Exported
                </span>
              ) : (
                <button
                  onClick={handlePrint}
                  disabled={isExporting}
                  className="btn btn-primary d-flex align-items-center"
                >
                  {isExporting ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                      ></span>
                      Exporting...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-download me-2"></i>
                      Download PDF
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Notes */}
          <div className="text-muted small">
            <h6 className="fw-semibold text-dark">Notes for PDF Export:</h6>
            <ul className="mb-0 ps-3">
              <li>Ensure the browser supports printing background graphics</li>
              <li>Select A4 paper size for best results</li>
              <li>Check the preview before printing or saving</li>
              <li>Colors may differ between screen and print</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Hidden printable component */}
      <div style={{ display: "none" }}>
        <PrintableResume
          ref={contentRef}
          data={data}
          template={template}
          customization={customization}
        />
      </div>
    </div>
  );
}

// Hàm xuất PDF dùng ở bất kỳ đâu
export async function exportResumeToPDF(
  data: ResumeData,
  template: string = "modern",
  customization: CustomizationOptions = {
    font: "inter",
    colorScheme: "blue",
    spacing: 1.5,
    fontSize: 4,
  }
) {
  return new Promise<void>((resolve, reject) => {
    try {
      // Tạo một div ẩn để render component
      const hiddenDiv = document.createElement("div");
      hiddenDiv.style.display = "none";
      document.body.appendChild(hiddenDiv);

      // Tạo root và render component
      const root = createRoot(hiddenDiv);
      root.render(
        <PrintableResume
          data={data}
          template={template}
          customization={customization}
        />
      );

      // Đợi component render xong
      setTimeout(() => {
        const content = hiddenDiv.innerHTML;

        // Tạo cửa sổ in
        const printWindow = window.open("", "_blank");
        if (!printWindow) {
          reject(new Error("Không thể mở cửa sổ in"));
          return;
        }

        // Copy styles
        let styles = "";
        document.querySelectorAll('link[rel="stylesheet"]').forEach((link) => {
          styles += link.outerHTML;
        });
        document.querySelectorAll("style").forEach((style) => {
          styles += style.outerHTML;
        });

        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>${data.personalInfo.fullName || "Resume"}_CV</title>
              <meta charset="utf-8">
              ${styles}
              <style>
                @page { size: A4; margin: 0.5in; }
                body {
                  margin: 0;
                  padding: 0;
                  font-family: system-ui, -apple-system, sans-serif;
                  -webkit-print-color-adjust: exact !important;
                  print-color-adjust: exact !important;
                }
                .print-container { width: 100%; height: 100%; margin: 0; padding: 0; box-shadow: none; }
                .print-safe * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
                .no-print { display: none !important; }
                
                /* Reset Bootstrap print styles that might conflict */
                @media print {
                  .d-print-inline,
                  .d-print-inline-block,
                  .d-print-block,
                  .d-print-none {
                    display: inherit !important;
                  }
                }
                
                /* Ensure proper layout for print */
                .bg-white {
                  background-color: white !important;
                }
                
                /* Fix flexbox issues in print */
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
              </style>
            </head>
            <body>
              ${content}
            </body>
          </html>
        `);

        printWindow.document.close();
        printWindow.onload = () => {
          setTimeout(() => {
            printWindow.print();
            printWindow.close();
            resolve();
          }, 500);
        };

        // Cleanup
        root.unmount();
        document.body.removeChild(hiddenDiv);
      }, 100);
    } catch (error) {
      reject(error);
    }
  });
}
