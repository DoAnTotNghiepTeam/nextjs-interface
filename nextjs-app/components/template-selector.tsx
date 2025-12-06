"use client";

import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

export interface ResumeTemplate {
  id: string;
  name: string;
  description: string;
  preview: string;
  category: "modern" | "classic";
}

export const resumeTemplates: ResumeTemplate[] = [
  {
    id: "modern",
    name: "Modern",
    description: "Thiết kế hiện đại với accent colors",
    preview: "/modern-resume-template.png",
    category: "modern",
  },
  {
    id: "classic",
    name: "Classic",
    description: "Thiết kế truyền thống, chuyên nghiệp",
    preview: "/classic-resume-template.png",
    category: "classic",
  },
];

interface TemplateSelectorProps {
  selectedTemplate: string;
  onTemplateChange: (templateId: string) => void;
}

export function TemplateSelector({
  selectedTemplate,
  onTemplateChange,
}: TemplateSelectorProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div>
        <h3
          style={{
            fontSize: "1.125rem",
            fontWeight: "600",
            marginBottom: "0.5rem",
            marginLeft: 10,
          }}
        >
          Chọn mẫu thiết kế
        </h3>
        <p
          style={{
            fontSize: "0.875rem",
            color: "var(--muted-foreground)",
            marginLeft: 10,
          }}
        >
          Chọn một mẫu thiết kế phù hợp với phong cách của bạn
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: "1rem",
        }}
      >
        {resumeTemplates.map((template) => {
          const isSelected = selectedTemplate === template.id;
          return (
            <Card
              key={template.id}
              style={{
                cursor: "pointer",
                transition: "all 150ms ease",
                borderColor: isSelected ? "var(--primary)" : "var(--border)",
                boxShadow: isSelected ? "0 0 0 2px var(--primary)" : "none",
              }}
              onClick={() => onTemplateChange(template.id)}
            >
              <CardHeader style={{ paddingBottom: "0.5rem" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <CardTitle style={{ fontSize: "0.875rem" }}>
                      {template.name}
                    </CardTitle>
                    <Badge
                      variant="secondary"
                      style={{ fontSize: "0.75rem", marginTop: "0.25rem" }}
                    >
                      {template.category}
                    </Badge>
                  </div>
                  {isSelected && (
                    <div
                      style={{
                        height: "1.25rem",
                        width: "1.25rem",
                        borderRadius: "50%",
                        backgroundColor: "var(--primary)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Check
                        className="h-3 w-3"
                        style={{ color: "var(--primary-foreground)" }}
                      />
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent style={{ paddingTop: "0" }}>
                <div
                  style={{
                    backgroundColor: "var(--muted)",
                    borderRadius: "0.375rem",
                    marginBottom: "0.5rem",
                    overflow: "hidden",
                    aspectRatio: "3 / 4",
                    position: "relative",
                  }}
                >
                  <Image
                    src={template.preview || "/placeholder.svg"}
                    alt={`${template.name} template preview`}
                    fill
                    style={{
                      objectFit: "cover",
                    }}
                  />
                </div>
                <p
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--muted-foreground)",
                  }}
                >
                  {template.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
