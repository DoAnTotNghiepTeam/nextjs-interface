import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { createRoot } from 'react-dom/client';
import { PrintableResume } from '@/components/printable-resume';
import type { ResumeData } from '@/components/resume-builder';
import type { CustomizationOptions } from '@/components/customization-panel';
import { DEFAULT_CUSTOMIZATION } from '@/components/customization-panel';

export interface PDFGenerationResult {
  blob: Blob;
  fileName: string;
  fileSize: number;
}

export class PDFService {
  /**
   * Generate PDF blob from resume data
   * @param data - Resume data
   * @param template - Template name
   * @param customization - Customization options
   * @returns Promise<PDFGenerationResult>
   */
  static async generatePDFBlob(
    data: ResumeData,
    template: string = 'modern',
    customization: CustomizationOptions = {
      font: DEFAULT_CUSTOMIZATION.font,
      colorScheme: DEFAULT_CUSTOMIZATION.colorScheme,
      spacing: DEFAULT_CUSTOMIZATION.spacing,
      fontSize: DEFAULT_CUSTOMIZATION.fontSize,
      backgroundPattern: DEFAULT_CUSTOMIZATION.backgroundPattern,
    }
  ): Promise<PDFGenerationResult> {
    return new Promise((resolve, reject) => {
      try {
        // Tạo container ẩn để render component
        const hiddenDiv = document.createElement('div');
        hiddenDiv.style.position = 'absolute';
        hiddenDiv.style.left = '-9999px';
        hiddenDiv.style.top = '-9999px';
        hiddenDiv.style.width = '210mm'; // A4 width
        hiddenDiv.style.backgroundColor = 'white';
        hiddenDiv.style.padding = '20px';
        hiddenDiv.style.fontFamily = 'Arial, sans-serif';
        hiddenDiv.style.fontSize = '12px';
        hiddenDiv.style.lineHeight = '1.4';
        
        document.body.appendChild(hiddenDiv);

        // Render component
        const root = createRoot(hiddenDiv);
        root.render(
          <PrintableResume
            data={data}
            template={template}
            customization={customization}
          />
        );

        // Đợi component render xong
        setTimeout(async () => {
          try {
            // Convert to canvas
            const canvas = await html2canvas(hiddenDiv, {
              scale: 2, // Higher quality
              useCORS: true,
              allowTaint: true,
              backgroundColor: '#ffffff',
              width: hiddenDiv.offsetWidth,
              height: hiddenDiv.offsetHeight,
            });

            // Create PDF
            const pdf = new jsPDF({
              orientation: 'portrait',
              unit: 'mm',
              format: 'a4',
            });

            const imgData = canvas.toDataURL('image/png');
            const imgWidth = pdf.internal.pageSize.getWidth();
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            
            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
            
            // Convert to blob
            const pdfBlob = pdf.output('blob');
            
            // Generate filename
            const fileName = this.generateFileName(data);
            
            // Cleanup
            root.unmount();
            document.body.removeChild(hiddenDiv);
            
            resolve({
              blob: pdfBlob,
              fileName,
              fileSize: pdfBlob.size,
            });
          } catch (error) {
            // Cleanup on error
            root.unmount();
            document.body.removeChild(hiddenDiv);
            reject(error);
          }
        }, 1000); // Wait 1 second for rendering
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Generate filename for resume PDF
   * @param data - Resume data
   * @returns Generated filename
   */
  static generateFileName(data: ResumeData): string {
    const name = data.personalInfo?.fullName?.replace(/[^a-zA-Z0-9]/g, '_') || 'Resume';
    const timestamp = new Date().toISOString().split('T')[0];
    return `${name}_${timestamp}.pdf`;
  }

  /**
   * Convert blob to File object
   * @param blob - PDF blob
   * @param fileName - File name
   * @returns File object
   */
  static blobToFile(blob: Blob, fileName: string): File {
    return new File([blob], fileName, { type: 'application/pdf' });
  }
}

export default PDFService;
