"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Save,
  FolderOpen,
  Trash2,
  Edit,
  Calendar,
  Download,
  Upload,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { resumeApi, mapFormToApi, mapApiToForm } from "@/lib/api";
import type { ResumeData } from "./resume-builder";
import type { CustomizationOptions } from "./customization-panel";
import type { SavedResume } from "@/app/api/resume/route";

interface ResumeManagerProps {
  currentData: ResumeData;
  currentTemplate: string;
  currentCustomization: CustomizationOptions;
  onLoadResume: (
    data: ResumeData,
    template: string,
    customization: CustomizationOptions
  ) => void;
}

export function ResumeManager({
  currentData,
  currentTemplate,
  currentCustomization,
  onLoadResume,
}: ResumeManagerProps) {
  const [savedResumes, setSavedResumes] = useState<SavedResume[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [resumeName, setResumeName] = useState("");
  const [isLoadingFromApi, setIsLoadingFromApi] = useState(false);
  const [isSavingToApi, setIsSavingToApi] = useState(false);
  const { toast } = useToast();

  // Load saved resumes from localStorage (simulating API)
  useEffect(() => {
    const saved = localStorage.getItem("saved-resumes");
    if (saved) {
      setSavedResumes(JSON.parse(saved));
    }
  }, []);

  const loadResumeFromApi = async () => {
    setIsLoadingFromApi(true);
    try {
      const apiData = await resumeApi.getMyResume();
      const formData = mapApiToForm(apiData);

      onLoadResume(formData, currentTemplate, currentCustomization);

      toast({
        title: "Thành công",
        description: "Đã tải resume từ server",
      });
    } catch (error) {
      console.error("Failed to load resume from API:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tải resume từ server",
        variant: "destructive",
      });
    } finally {
      setIsLoadingFromApi(false);
    }
  };

  const saveResumeToApi = async () => {
    setIsSavingToApi(true);
    try {
      const dataWithTemplate = {
        ...currentData,
        template: currentTemplate,
      };
      const apiData = mapFormToApi(dataWithTemplate);
      await resumeApi.saveMyResume(apiData);

      toast({
        title: "Thành công",
        description: "Đã lưu resume lên server",
      });
    } catch (error) {
      console.error("Failed to save resume to API:", error);
      toast({
        title: "Lỗi",
        description: "Không thể lưu resume lên server",
        variant: "destructive",
      });
    } finally {
      setIsSavingToApi(false);
    }
  };

  const saveResume = async () => {
    if (!resumeName.trim()) return;

    setIsLoading(true);
    try {
      const newResume: SavedResume = {
        id: Date.now().toString(),
        name: resumeName.trim(),
        data: currentData,
        template: currentTemplate,
        customization: currentCustomization,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const updatedResumes = [...savedResumes, newResume];
      setSavedResumes(updatedResumes);
      localStorage.setItem("saved-resumes", JSON.stringify(updatedResumes));

      setResumeName("");
      setSaveDialogOpen(false);

      toast({
        title: "Thành công",
        description: "Đã lưu resume vào bộ nhớ local",
      });
    } catch (error) {
      console.error("Failed to save resume:", error);
      toast({
        title: "Lỗi",
        description: "Không thể lưu resume",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadResume = (resume: SavedResume) => {
    onLoadResume(resume.data, resume.template, resume.customization);
  };

  const deleteResume = (id: string) => {
    const updatedResumes = savedResumes.filter((r) => r.id !== id);
    setSavedResumes(updatedResumes);
    localStorage.setItem("saved-resumes", JSON.stringify(updatedResumes));
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderOpen className="h-5 w-5" />
            Resume Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <Button
              onClick={loadResumeFromApi}
              disabled={isLoadingFromApi}
              variant="outline"
              className="flex items-center gap-2 bg-transparent"
            >
              <Download className="h-4 w-4" />
              {isLoadingFromApi ? "Đang tải..." : "Tải từ Server"}
            </Button>
            <Button
              onClick={saveResumeToApi}
              disabled={isSavingToApi}
              className="flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              {isSavingToApi ? "Đang lưu..." : "Lưu lên Server"}
            </Button>
          </div>

          <div className="flex gap-2">
            <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 bg-transparent"
                >
                  <Save className="h-4 w-4" />
                  Save Locally
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Save Resume</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="resume-name">Tên Resume</Label>
                    <Input
                      id="resume-name"
                      value={resumeName}
                      onChange={(e) => setResumeName(e.target.value)}
                      placeholder="Nhập tên cho resume..."
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setSaveDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={saveResume}
                      disabled={!resumeName.trim() || isLoading}
                    >
                      {isLoading ? "Đang lưu..." : "Lưu"}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {savedResumes.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FolderOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No resumes saved</p>
              <p className="text-sm">
                Save the current resume for management and reuse
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <h4 className="font-medium">
                Resume đã lưu ({savedResumes.length})
              </h4>
              <div className="space-y-2">
                {savedResumes.map((resume) => (
                  <div
                    key={resume.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h5 className="font-medium">{resume.name}</h5>
                        <Badge variant="outline" className="text-xs">
                          {resume.template}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(resume.updatedAt).toLocaleDateString(
                            "vi-VN"
                          )}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => loadResume(resume)}
                        className="flex items-center gap-1"
                      >
                        <Edit className="h-3 w-3" />
                        Tải
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteResume(resume.id)}
                        className="flex items-center gap-1 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
