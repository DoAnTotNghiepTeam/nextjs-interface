import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { FirebaseStorageService } from '@/lib/firebase-storage';
import { PDFService } from '@/lib/pdf-service';
import type { ResumeData } from '@/components/resume-builder';
import type { CustomizationOptions } from '@/components/customization-panel';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { 
      resumeData, 
      template = 'modern', 
      customization = {
        font: 'inter',
        colorScheme: 'blue',
        spacing: 'normal',
        fontSize: 'medium',
      },
      resumeId 
    } = body;

    if (!resumeData) {
      return NextResponse.json(
        { success: false, error: 'Resume data is required' },
        { status: 400 }
      );
    }

    // Generate PDF blob
    const pdfResult = await PDFService.generatePDFBlob(
      resumeData as ResumeData,
      template,
      customization as CustomizationOptions
    );

    // Generate storage path
    const storagePath = FirebaseStorageService.generateResumePath(
      session.user.id,
      resumeId
    );

    // Upload to Firebase Storage
    const downloadURL = await FirebaseStorageService.uploadPDF(
      pdfResult.blob,
      storagePath
    );

    return NextResponse.json({
      success: true,
      resumeLink: downloadURL,
      filePath: storagePath,
      fileName: pdfResult.fileName,
      fileSize: pdfResult.fileSize,
    });
  } catch (error) {
    console.error('PDF Generation Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'PDF generation failed' 
      },
      { status: 500 }
    );
  }
}
