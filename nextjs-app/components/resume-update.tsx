"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  ChevronLeft,
  ChevronRight,
  Check,
  AlertCircle,
  Save,
  Palette,
  FileText,
  Download,
  Menu,
  Eye,
} from "lucide-react";
import { PersonalInfoStep } from "./steps/personal-info-step";
import { ExperienceStep } from "./steps/experience-step";
import { EducationStep } from "./steps/education-step";
import { SkillsStep } from "./steps/skills-step";
import { ActivitiesStep } from "./steps/activities-step";
import { AwardsStep } from "./steps/awards-step";
import { ResumePreview } from "./resume-preview";
import { TemplateSelector } from "./template-selector";
import {
  CustomizationPanel,
  type CustomizationOptions,
} from "./customization-panel";
import { PDFExport } from "./pdf-export";
import { useToast } from "@/hooks/use-toast";
import styles from "./resume-builder.module.css";

export interface ResumeData {
  id: number;
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    jobTitle: string; // Changed from address to jobTitle
    summary: string;
    profileImage?: string;
  };
  experience: Array<{
    id: string;
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  education: Array<{
    id: string;
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
    gpa?: string;
  }>;
  skills: Array<string>; // Simplified to array of strings, removed level and category
  activities: Array<{
    id: string;
    title: string;
    organization: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  awards: Array<{
    id: string;
    title: string;
    issuer: string;
    date: string;
    description: string;
  }>;
}
interface ResumeDataWithTemplate extends ResumeData {
  template: string;
}

interface DesktopSidebarProps {
  currentStep: number;
  completedSteps: number[];
  stepHasErrors: (stepIndex: number) => boolean;
  goToStep: (stepIndex: number) => void;
  selectedTemplate: string;
  setSelectedTemplate: (template: string) => void;
  customization: CustomizationOptions;
  setCustomization: (customization: CustomizationOptions) => void;
  resumeData: ResumeData;
}

interface StepButtonProps {
  step: (typeof steps)[number]; // Điều này sẽ suy luận kiểu từ mảng `steps`
  index: number;
  currentStep: number;
  completedSteps: number[];
  stepHasErrors: (stepIndex: number) => boolean;
  goToStep: (stepIndex: number) => void;
}

interface MobileSidebarProps {
  currentStep: number;
  completedSteps: number[];
  stepHasErrors: (stepIndex: number) => boolean;
  goToStep: (stepIndex: number) => void;
  selectedTemplate: string;
  setSelectedTemplate: (template: string) => void;
  customization: CustomizationOptions;
  setCustomization: (customization: CustomizationOptions) => void;
  resumeData: ResumeData;
  onMenuClose: () => void;
}

const steps = [
  {
    id: "personal",
    title: "Personal information",
    component: PersonalInfoStep,
    fields: ["personalInfo"],
  },
  {
    id: "experience",
    title: "Work experience",
    component: ExperienceStep,
    fields: ["experience"],
  },
  {
    id: "education",
    title: "Education",
    component: EducationStep,
    fields: ["education"],
  },
  { id: "skills", title: "Skills", component: SkillsStep, fields: ["skills"] },
  {
    id: "activities",
    title: "Activities",
    component: ActivitiesStep,
    fields: ["activities"],
  },
  {
    id: "awards",
    title: "Awards",
    component: AwardsStep,
    fields: ["awards"],
  },
];

interface ResumeUpdateProps {
  onBack?: () => void; // Callback để quay lại danh sách CV
  onSave?: (resumeData: ResumeData) => void; // Callback để lưu CV và chuyển về danh sách
  initialData?: ResumeData; // Dữ liệu khởi tạo cho resume
  userId?: string; // User ID for PDF upload
}
import { mapFormToApi, resumeApi } from "@/lib/api";
export function ResumeUpdate({
  onBack,
  onSave,
  initialData,
  userId,
}: ResumeUpdateProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const router = useRouter();
  const [showPreview, setShowPreview] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("modern");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [customization, setCustomization] = useState<CustomizationOptions>({
    font: "inter",
    colorScheme: "blue",
    spacing: "normal",
    fontSize: "medium",
  });
  const { toast } = useToast();

  const methods = useForm<ResumeData>({
    mode: "onChange",
    defaultValues: initialData
      ? { ...initialData, id: initialData.id }
      : {
          id: undefined,
          personalInfo: {
            fullName: "",
            email: "",
            phone: "",
            jobTitle: "",
            summary: "",
          },
          experience: [],
          education: [],
          skills: [],
          activities: [],
          awards: [],
        },
  });
  // Reset form when initialData changes (for edit)
  // Reset form only when initialData changes and after mount
  useEffect(() => {
    if (mounted) {
      if (initialData && typeof initialData === "object") {
        // Edit: fill form with old data
        methods.reset({
          id: initialData.id,
          personalInfo: {
            fullName: initialData.personalInfo?.fullName || "",
            email: initialData.personalInfo?.email || "",
            phone: initialData.personalInfo?.phone || "",
            jobTitle: initialData.personalInfo?.jobTitle || "",
            summary: initialData.personalInfo?.summary || "",
            profileImage: initialData.personalInfo?.profileImage || "",
          },
          experience: Array.isArray(initialData.experience)
            ? initialData.experience
            : [],
          education: Array.isArray(initialData.education)
            ? initialData.education
            : [],
          skills: Array.isArray(initialData.skills) ? initialData.skills : [],
          activities: Array.isArray(initialData.activities)
            ? initialData.activities
            : [],
          awards: Array.isArray(initialData.awards) ? initialData.awards : [],
        });
        if ((initialData as ResumeDataWithTemplate)?.template) {
          setSelectedTemplate((initialData as ResumeDataWithTemplate).template);
        }
      } else {
        // Create new: always reset to empty
        methods.reset({
          id: undefined,
          personalInfo: {
            fullName: "",
            email: "",
            phone: "",
            jobTitle: "",
            summary: "",
            profileImage: "",
          },
          experience: [],
          education: [],
          skills: [],
          activities: [],
          awards: [],
        });
      }
    }
  }, [initialData, mounted, methods]);

  const {
    handleSubmit,
    trigger,
    watch,
    formState: { errors },
  } = methods;

  const autoSave = async () => {
    if (!mounted) return;

    setIsAutoSaving(true);
    setTimeout(() => {
      localStorage.setItem("resume-draft", JSON.stringify(watch()));
      setIsAutoSaving(false);
    }, 1000);
  };

  useEffect(() => {
    const timeoutId = setTimeout(autoSave, 2000);
    return () => clearTimeout(timeoutId);
  }, [watch, mounted]);

  useEffect(() => {
    setMounted(true);

    const savedDraft = localStorage.getItem("resume-draft");
    if (savedDraft) {
      try {
        const parsedData = JSON.parse(savedDraft);
        methods.reset(parsedData);
        if (parsedData?.template) {
          setSelectedTemplate(parsedData.template);
        }
        toast({
          title: "Draft restored",
          description: "Previously saved data has been restored.",
        });
      } catch (error) {
        console.error("Error loading draft:", error);
      }
    }
  }, [methods, toast]);

  if (!mounted) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingContent}>
            <div className={styles.spinner}></div>
            <p className={styles.loadingText}>Đang tải...</p>
          </div>
        </div>
      </div>
    );
  }

  const validateCurrentStep = async () => {
    const currentStepFields = steps[currentStep].fields as Array<
      keyof ResumeData
    >;
    const isValid = await trigger(currentStepFields);

    if (isValid && !completedSteps.includes(currentStep)) {
      setCompletedSteps([...completedSteps, currentStep]);
    }

    return isValid;
  };

  const nextStep = async () => {
    const isValid = await validateCurrentStep();
    if (isValid && currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else if (!isValid) {
      toast({
        title: "Please check your information",
        description: "Some required fields have not been filled out.",
        variant: "destructive",
      });
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Back button in header: go to previous step if possible, else go to previous page, else fallback
  const handleHeaderBack = () => {
    if (currentStep > 0) {
      setCurrentStep((s) => (s > 0 ? s - 1 : s));
      return;
    }
    try {
      if (typeof window !== "undefined" && window.history.length > 1) {
        router.back();
        return;
      }
    } catch {}
    if (onBack) onBack();
  };

  const goToStep = async (stepIndex: number) => {
    if (stepIndex < currentStep || completedSteps.includes(stepIndex)) {
      setCurrentStep(stepIndex);
    } else {
      const isValid = await validateCurrentStep();
      if (isValid) {
        setCurrentStep(stepIndex);
      }
    }
  };

  const onSubmit = async (data: ResumeData) => {
    console.log("[ResumeUpdate] Submit id:", data.id);
    try {
      // 1. Tạo PDF từ dữ liệu CV
      const { blob } = await (
        await import("@/lib/pdf-service")
      ).PDFService.generatePDFBlob(data, selectedTemplate, customization);
      // 2. Upload PDF lên Firebase Storage
      const userIdForPath =
        userId ||
        data.personalInfo?.email?.replace(/[^a-zA-Z0-9]/g, "_") ||
        "unknown";
      const resumeIdForPath = data.id ? String(data.id) : Date.now().toString();
      const storagePath = `resumes/${userIdForPath}/${resumeIdForPath}.pdf`;
      const FirebaseStorageService = (await import("@/lib/firebase-storage"))
        .FirebaseStorageService;
      const pdfUrl = await FirebaseStorageService.uploadPDF(blob, storagePath);
      // 3. Gửi link PDF về backend
      const apiData = { ...mapFormToApi(data), resumeLink: pdfUrl };
      if (data.id) {
        await resumeApi.updateMyResume(data.id, apiData);
        if (onSave) onSave({ ...data, id: data.id });
        setShowPreview(true);
      } else {
        await resumeApi.saveMyResume(apiData);
        if (onSave) onSave({ ...data });
        setShowPreview(true);
      }
    } catch (error) {
      console.error("Error saving CV:", error);
      toast({
        title: "Error saving CV",
        description: "Unable to save CV. Please try again.",
        variant: "destructive",
      });
    }
  };

  const stepHasErrors = (stepIndex: number) => {
    const stepFields = steps[stepIndex].fields;
    return stepFields.some((field) => errors[field as keyof typeof errors]);
  };

  const CurrentStepComponent = steps[currentStep].component;
  const progress = ((currentStep + 1) / steps.length) * 100;

  if (showPreview) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <Button
            variant="outline"
            onClick={() => setShowPreview(false)}
            className={styles.actionButton}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className={styles.hiddenOnMobile}>Back to edit</span>
            <span className={styles.hiddenOnDesktop}>Back</span>
          </Button>
        </div>
        <div className={`${styles.mainGrid} ${styles.previewGrid}`}>
          <div className={styles.previewSidebarXl}>
            <PDFExport
              data={methods.getValues()}
              template={selectedTemplate}
              customization={customization}
              onSave={onSave} // Pass callback to handle save and navigation
              resumeData={methods.getValues()} // Pass resume data
            />
          </div>
          <div className={styles.previewMainXl}>
            <ResumePreview
              key={JSON.stringify(customization)}
              data={methods.getValues()}
              template={selectedTemplate}
              customization={customization}
              onSave={onSave}
              userId={userId ?? ""}
              showPDFUpload={true}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Quay lại"
              onClick={handleHeaderBack}
              style={{ marginRight: 8 }}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <h1 className={styles.title} style={{ marginBottom: 0 }}>
              Create Resume
            </h1>
          </div>
          <div className={styles.subtitle}>
            <p className={`${styles.subtitleText} ${styles.hiddenOnMobile}`}>
              Create a professional resume in minutes
            </p>
            {isAutoSaving && (
              <div className={styles.autoSaveIndicator}>
                <Save className="h-3 w-3 animate-spin" />
                <span className={styles.hiddenOnMobile}>Saving...</span>
              </div>
            )}
          </div>
        </div>
        <div className={styles.headerActions}>
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={`${styles.actionButton} ${styles.hiddenOnDesktop}`}
              >
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <MobileSidebar
                  currentStep={currentStep}
                  completedSteps={completedSteps}
                  stepHasErrors={stepHasErrors}
                  goToStep={goToStep}
                  selectedTemplate={selectedTemplate}
                  setSelectedTemplate={setSelectedTemplate}
                  customization={customization}
                  setCustomization={setCustomization}
                  resumeData={watch()}
                  onMenuClose={() => setMobileMenuOpen(false)}
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className={styles.mainGrid}>
        <div className={styles.sidebar}>
          <DesktopSidebar
            currentStep={currentStep}
            completedSteps={completedSteps}
            stepHasErrors={stepHasErrors}
            goToStep={goToStep}
            selectedTemplate={selectedTemplate}
            setSelectedTemplate={setSelectedTemplate}
            customization={customization}
            setCustomization={setCustomization}
            resumeData={watch()}
          />
        </div>

        <div className={styles.mainContent}>
          <Card>
            <CardHeader className={styles.cardHeader}>
              <div className={styles.cardHeaderContent}>
                <div className={styles.cardTitleContainer}>
                  <CardTitle className={styles.cardTitle}>
                    {steps[currentStep].title}
                  </CardTitle>
                  {completedSteps.includes(currentStep) && (
                    <Badge className={styles.completedBadge}>
                      <Check className="h-3 w-3 mr-1" />
                      <span className={styles.hiddenOnMobile}>Hoàn thành</span>
                    </Badge>
                  )}
                </div>
                <span className={styles.stepCounter}>
                  {currentStep + 1} / {steps.length}
                </span>
              </div>
              <Progress value={progress} className={styles.progress} />
            </CardHeader>
            <CardContent className={styles.formContainer}>
              <FormProvider {...methods}>
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-4 lg-space-y-6"
                >
                  <CurrentStepComponent />

                  <div className={styles.formActions}>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prevStep}
                      disabled={currentStep === 0}
                      className={`${styles.actionButton} ${styles.secondaryButton}`}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Quay lại
                    </Button>

                    {currentStep === steps.length - 1 ? (
                      <Button
                        type="button"
                        onClick={() => setShowPreview(true)}
                        className={`${styles.actionButton} ${styles.primaryButton}`}
                      >
                        <span className={styles.hiddenOnMobile}>
                          Preview Resume
                        </span>
                        <span className={styles.hiddenOnDesktop}>Preview</span>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        onClick={nextStep}
                        className={`${styles.actionButton} ${styles.primaryButton}`}
                      >
                        Next
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </form>
              </FormProvider>
            </CardContent>
          </Card>
        </div>

        <div className={styles.previewSidebar}>
          <Card className={styles.previewCard}>
            <CardHeader className={styles.cardHeader}>
              <CardTitle
                className="text-base d-flex align-items-center gap-2"
                style={{
                  display: "flex",
                  alignItems: "center",
                  margin: "13px",
                }}
              >
                <Eye className="h-4 w-4" style={{ verticalAlign: "middle" }} />
                <span style={{ verticalAlign: "middle" }}>Preview</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4">
              <div className={styles.previewContainer}>
                <div className={styles.previewContent}>
                  <ResumePreview
                    data={watch()}
                    template={selectedTemplate}
                    customization={customization}
                    isCompact
                    userId={userId ?? ""}
                    showPDFUpload={false}
                  />
                </div>
              </div>
              <div
                className="d-flex justify-content-center mt-4"
                style={{ marginBottom: 10 }}
              >
                <Button
                  variant="outline"
                  onClick={() => setShowPreview(true)}
                  className="text-sm d-flex justify-content-center align-items-center"
                >
                  View full screen
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className={styles.floatingPreview}>
        <Button
          onClick={() => setShowPreview(true)}
          className={styles.floatingButton}
        >
          <Eye className="h-4 w-4" />
          <span className={styles.hiddenOnMobile}>Preview</span>
        </Button>
      </div>
    </div>
  );
}

function DesktopSidebar({
  currentStep,
  completedSteps,
  stepHasErrors,
  goToStep,
  selectedTemplate,
  setSelectedTemplate,
  customization,
  setCustomization,
  resumeData,
}: DesktopSidebarProps) {
  return (
    <Tabs defaultValue="steps" className="w-full">
      <TabsList className={styles.tabsList}>
        <TabsTrigger value="steps" className={styles.tabsTrigger}>
          <FileText className="h-3 w-3" />
          Steps
        </TabsTrigger>
        <TabsTrigger value="design" className={styles.tabsTrigger}>
          <Palette className="h-3 w-3" />
          Design
        </TabsTrigger>
        <TabsTrigger value="export" className={styles.tabsTrigger}>
          <Download className="h-3 w-3" />
          Export
        </TabsTrigger>
      </TabsList>

      <TabsContent value="steps" className="mt-4">
        <Card className={styles.previewCard}>
          <CardHeader className={styles.cardHeader}>
            <CardTitle className="text-base">Các bước</CardTitle>
          </CardHeader>
          <CardContent className={styles.stepsList}>
            {steps.map((step, index) => (
              <StepButton
                key={step.id}
                step={step}
                index={index}
                currentStep={currentStep}
                completedSteps={completedSteps}
                stepHasErrors={stepHasErrors}
                goToStep={goToStep}
              />
            ))}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="design" className="mt-4">
        <Card className={`${styles.previewCard} max-h-80vh overflow-y-auto`}>
          <CardContent className={styles.sidebarContent}>
            <TemplateSelector
              selectedTemplate={selectedTemplate}
              onTemplateChange={setSelectedTemplate}
            />
            <CustomizationPanel
              options={customization}
              onOptionsChange={setCustomization}
            />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="export" className="mt-4">
        <Card className={styles.previewCard}>
          <CardContent className="p-4">
            <PDFExport
              data={resumeData}
              template={selectedTemplate}
              customization={customization}
            />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

function MobileSidebar({
  currentStep,
  completedSteps,
  stepHasErrors,
  goToStep,
  selectedTemplate,
  setSelectedTemplate,
  customization,
  setCustomization,
  resumeData,
  onMenuClose,
}: MobileSidebarProps) {
  return (
    <Tabs defaultValue="steps" className="w-full">
      <TabsList className={styles.tabsList}>
        <TabsTrigger value="steps">
          <FileText className="h-4 w-4" />
        </TabsTrigger>
        <TabsTrigger value="design">
          <Palette className="h-4 w-4" />
        </TabsTrigger>
        <TabsTrigger value="export">
          <Download className="h-4 w-4" />
        </TabsTrigger>
      </TabsList>

      <TabsContent value="steps" className="mt-4 space-y-2">
        <h3 className="font-medium text-sm mb-3">Các bước</h3>
        <div className={styles.stepsList}>
          {steps.map((step, index) => (
            <StepButton
              key={step.id}
              step={step}
              index={index}
              currentStep={currentStep}
              completedSteps={completedSteps}
              stepHasErrors={stepHasErrors}
              goToStep={(stepIndex: number) => {
                goToStep(stepIndex);
                onMenuClose();
              }}
            />
          ))}
        </div>
      </TabsContent>

      <TabsContent value="design" className="mt-4 space-y-6">
        <TemplateSelector
          selectedTemplate={selectedTemplate}
          onTemplateChange={setSelectedTemplate}
        />
        <CustomizationPanel
          options={customization}
          onOptionsChange={setCustomization}
        />
      </TabsContent>

      <TabsContent value="export" className="mt-4">
        <PDFExport
          data={resumeData}
          template={selectedTemplate}
          customization={customization}
        />
      </TabsContent>
    </Tabs>
  );
}

function StepButton({
  step,
  index,
  currentStep,
  completedSteps,
  stepHasErrors,
  goToStep,
}: StepButtonProps) {
  const isCurrentStep = index === currentStep;
  const isCompleted = completedSteps.includes(index);
  const hasErrors = stepHasErrors(index);

  let buttonClass = styles.stepButton;
  if (isCurrentStep) {
    buttonClass += ` ${styles.stepButtonActive}`;
  } else if (isCompleted) {
    buttonClass += ` ${styles.stepButtonCompleted}`;
  } else if (hasErrors) {
    buttonClass += ` ${styles.stepButtonError}`;
  }

  return (
    <button onClick={() => goToStep(index)} className={buttonClass}>
      <div className={styles.stepButtonContent}>
        <div className={styles.stepButtonText}>
          <div className={styles.stepButtonTitle}>{step.title}</div>
          <div className={styles.stepButtonSubtitle}>Steps {index + 1}</div>
        </div>
        <div className={styles.stepButtonIcon}>
          {isCompleted && <Check className="h-4 w-4 text-green-600" />}
          {hasErrors && <AlertCircle className="h-4 w-4 text-red-600" />}
        </div>
      </div>
    </button>
  );
}

export default ResumeUpdate;
