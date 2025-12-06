"use client";

"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { ResumeData } from "../resume-builder";
import type { CustomizationOptions } from "../customization-panel";
import { colorSchemes, fontOptions } from "../customization-panel";

interface ModernTemplateProps {
  data: ResumeData;
  customization: CustomizationOptions;
  isCompact?: boolean;
}

export function ModernTemplate({
  data,
  customization,
  isCompact = false,
}: ModernTemplateProps) {
  const colorScheme =
    colorSchemes.find((c) => c.value === customization.colorScheme) ||
    colorSchemes[0];
  const fontFamily =
    fontOptions.find((f) => f.value === customization.font)?.family ||
    '"Inter", Arial, sans-serif';

  const today = new Date().toISOString().slice(0, 10);
  const getSizeStyles = (type: "text" | "heading" | "title" | "name") => {
    const sizeMap = {
      small: {
        text: isCompact ? "0.65rem" : "0.75rem",
        heading: isCompact ? "0.8rem" : "0.875rem",
        title: isCompact ? "1rem" : "1.125rem",
        name: isCompact ? "1.2rem" : "1.5rem",
      },
      medium: {
        text: isCompact ? "0.75rem" : "0.875rem",
        heading: isCompact ? "0.9rem" : "1rem",
        title: isCompact ? "1.1rem" : "1.25rem",
        name: isCompact ? "1.4rem" : "1.875rem",
      },
      large: {
        text: isCompact ? "0.85rem" : "1rem",
        heading: isCompact ? "1rem" : "1.125rem",
        title: isCompact ? "1.2rem" : "1.5rem",
        name: isCompact ? "1.7rem" : "2.25rem",
      },
    };
    return { fontSize: sizeMap[customization.fontSize][type] };
  };

  const getSpacingStyles = () => {
    const spacingMap = {
      compact: {
        // Main container spacing
        containerPadding: isCompact ? "0.5rem" : "1.5rem",
        sectionMargin: isCompact ? "0.25rem" : "1rem",
        headerPadding: isCompact ? "0.5rem" : "1rem",
        headerMargin: isCompact ? "0.25rem" : "1rem",

        // Section content spacing
        sectionGap: isCompact ? "0.125rem" : "0.5rem",
        itemGap: isCompact ? "0.125rem" : "0.25rem",
        itemPadding: isCompact ? "0.25rem" : "0.5rem",

        // Header spacing
        headerGap: isCompact ? "0.5rem" : "1rem",
        avatarMargin: isCompact ? "0.5rem" : "1rem",

        // Text spacing
        textMargin: isCompact ? "0.125rem" : "0.25rem",
        titleMargin: isCompact ? "0.125rem" : "0.5rem",
      },
      normal: {
        // Main container spacing
        containerPadding: isCompact ? "0.75rem" : "2rem",
        sectionMargin: isCompact ? "0.5rem" : "1.5rem",
        headerPadding: isCompact ? "0.75rem" : "1.5rem",
        headerMargin: isCompact ? "0.5rem" : "1.5rem",

        // Section content spacing
        sectionGap: isCompact ? "0.25rem" : "1rem",
        itemGap: isCompact ? "0.25rem" : "0.5rem",
        itemPadding: isCompact ? "0.5rem" : "1rem",

        // Header spacing
        headerGap: isCompact ? "0.75rem" : "1.5rem",
        avatarMargin: isCompact ? "0.75rem" : "1.5rem",

        // Text spacing
        textMargin: isCompact ? "0.25rem" : "0.5rem",
        titleMargin: isCompact ? "0.25rem" : "0.75rem",
      },
      relaxed: {
        // Main container spacing
        containerPadding: isCompact ? "1rem" : "2.5rem",
        sectionMargin: isCompact ? "0.75rem" : "2rem",
        headerPadding: isCompact ? "1rem" : "2rem",
        headerMargin: isCompact ? "0.75rem" : "2rem",

        // Section content spacing
        sectionGap: isCompact ? "0.375rem" : "1.5rem",
        itemGap: isCompact ? "0.375rem" : "0.75rem",
        itemPadding: isCompact ? "0.75rem" : "1.5rem",

        // Header spacing
        headerGap: isCompact ? "1rem" : "2rem",
        avatarMargin: isCompact ? "1rem" : "2rem",

        // Text spacing
        textMargin: isCompact ? "0.375rem" : "0.75rem",
        titleMargin: isCompact ? "0.375rem" : "1rem",
      },
    };
    return spacingMap[customization.spacing];
  };

  const spacingStyle = getSpacingStyles();

  // Helper: wrap section with proper spacing
  const Section = ({ children }: { children: React.ReactNode }) => (
    <section style={{ marginBottom: spacingStyle.sectionMargin }}>
      {children}
    </section>
  );

  return (
    <div
      className={`bg-white print-safe`}
      style={{
        color: "rgb(17 24 39)",
        padding: spacingStyle.containerPadding,
        fontFamily: fontFamily,
      }}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .print-safe * {
              -webkit-print-color-adjust: exact !important;
              color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
          `,
        }}
      />

      {/* Header: avatar left, info right */}
      <div
        className="rounded-lg print-safe d-flex align-items-center"
        style={{
          backgroundColor: colorScheme.primary,
          padding: spacingStyle.headerPadding,
          marginBottom: spacingStyle.headerMargin,
          fontFamily: fontFamily,
        }}
      >
        <div
          style={{
            width: isCompact ? 56 : 120,
            height: isCompact ? 72 : 160,
            borderRadius: "12px",
            overflow: "hidden",
            background: "#fff",
            flexShrink: 0,
            marginRight: spacingStyle.avatarMargin,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Avatar
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "0",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <AvatarImage
              src={data.personalInfo.profileImage || "/placeholder.svg"}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "0",
              }}
            />
            <AvatarFallback
              style={{
                backgroundColor: colorScheme.secondary,
                color: "white",
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: isCompact ? 24 : 48,
                borderRadius: "0",
              }}
            >
              {data.personalInfo.fullName?.charAt(0)?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
        </div>
        <div style={{ color: "white", minWidth: 0 }}>
          <h1
            className="font-bold"
            style={{
              fontSize: getSizeStyles("name").fontSize,
              fontFamily: fontFamily,
              wordBreak: "break-word",
              overflowWrap: "anywhere",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {data.personalInfo.fullName || "Họ và tên"}
          </h1>
          <div
            style={{
              fontSize: getSizeStyles("text").fontSize,
              opacity: 0.9,
              display: "flex",
              flexDirection: "column",
              gap: isCompact ? "0" : "0.25rem",
              fontFamily: fontFamily,
              minWidth: 0,
            }}
          >
            {data.personalInfo.email && (
              <p
                style={{
                  color: "#fff",
                  wordBreak: "break-word",
                  overflowWrap: "anywhere",
                }}
              >
                {data.personalInfo.email}
              </p>
            )}
            {data.personalInfo.phone && (
              <p
                style={{
                  color: "#fff",
                  wordBreak: "break-word",
                  overflowWrap: "anywhere",
                }}
              >
                {data.personalInfo.phone}
              </p>
            )}
            {data.personalInfo.jobTitle && (
              <p
                style={{
                  color: "#fff",
                  wordBreak: "break-word",
                  overflowWrap: "anywhere",
                }}
              >
                {data.personalInfo.jobTitle}
              </p>
            )}
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: spacingStyle.headerGap,
          fontFamily: fontFamily,
        }}
      >
        {data.personalInfo.summary && (
          <Section>
            <h2
              className="font-semibold print-safe"
              style={{
                fontSize: getSizeStyles("heading").fontSize,
                marginBottom: spacingStyle.titleMargin,
                paddingBottom: "0.25rem",
                borderBottom: "2px solid",
                borderColor: colorScheme.primary,
                borderRadius: "4px",
                fontFamily: fontFamily,
              }}
            >
              DESCRIBE YOURSELF
            </h2>
            <p
              style={{
                fontSize: getSizeStyles("text").fontSize,
                fontFamily: fontFamily,
              }}
            >
              {data.personalInfo.summary}
            </p>
          </Section>
        )}

        {Array.isArray(data.experience) && data.experience.length > 0 && (
          <Section>
            <h2
              className="font-semibold print-safe"
              style={{
                ...getSizeStyles("heading"),
                marginBottom: spacingStyle.titleMargin,
                paddingBottom: "0.25rem",
                borderBottom: "2px solid",
                borderColor: colorScheme.primary,
                fontFamily: fontFamily,
              }}
            >
              WORK EXPERIENCE
            </h2>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: spacingStyle.sectionGap,
              }}
            >
              {data.experience.map((exp, idx) => (
                <div key={exp.id ?? idx}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3
                        className="font-semibold print-safe"
                        style={{
                          ...getSizeStyles("text"),
                          color: colorScheme.secondary,
                          fontFamily: fontFamily,
                        }}
                      >
                        {exp.position}
                      </h3>
                      <p
                        style={{
                          ...getSizeStyles("text"),
                          color: "rgb(75 85 99)",
                          fontFamily: fontFamily,
                        }}
                      >
                        {exp.company}
                      </p>
                    </div>
                    <p
                      style={{
                        ...getSizeStyles("text"),
                        color: "rgb(107 114 128)",
                        fontFamily: fontFamily,
                      }}
                    >
                      {exp.startDate} -{" "}
                      {exp.endDate && exp.endDate < today
                        ? exp.endDate
                        : "Hiện tại"}
                    </p>
                  </div>
                  {exp.description && (
                    <p
                      style={{ ...getSizeStyles("text"), marginTop: "0.25rem" }}
                    >
                      {exp.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </Section>
        )}

        {data.education.length > 0 && (
          <Section>
            <h2
              className="font-semibold print-safe"
              style={{
                ...getSizeStyles("heading"),
                marginBottom: spacingStyle.titleMargin,
                paddingBottom: "0.25rem",
                borderBottom: "2px solid",
                borderColor: colorScheme.primary,
                fontFamily: fontFamily,
              }}
            >
              EDUCATION
            </h2>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: spacingStyle.sectionGap,
              }}
            >
              {data.education.map((edu, idx) => (
                <div key={edu.id ?? idx}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3
                        className="font-semibold print-safe"
                        style={{
                          ...getSizeStyles("text"),
                          color: colorScheme.secondary,
                          fontFamily: fontFamily,
                        }}
                      >
                        {edu.degree} - {edu.field}
                      </h3>
                      <p
                        style={{
                          ...getSizeStyles("text"),
                          color: "rgb(75 85 99)",
                          fontFamily: fontFamily,
                        }}
                      >
                        {edu.institution}
                      </p>
                    </div>
                    <p
                      style={{
                        ...getSizeStyles("text"),
                        color: "rgb(107 114 128)",
                        fontFamily: fontFamily,
                      }}
                    >
                      {/* {edu.startDate} - {edu.endDate} */}
                      {edu.startDate} -{" "}
                      {edu.endDate && edu.endDate < today
                        ? edu.endDate
                        : "Present"}
                    </p>
                  </div>
                  {edu.gpa && (
                    <p
                      style={{
                        ...getSizeStyles("text"),
                        fontFamily: fontFamily,
                      }}
                    >
                      GPA: {edu.gpa}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </Section>
        )}

        {data.skills.length > 0 && (
          <Section>
            <h2
              className="font-semibold print-safe"
              style={{
                ...getSizeStyles("heading"),
                marginBottom: spacingStyle.titleMargin,
                paddingBottom: "0.25rem",
                borderBottom: "2px solid",
                borderColor: colorScheme.primary,
                fontFamily: fontFamily,
              }}
            >
              SKILL
            </h2>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: isCompact ? "0.25rem" : "0.5rem",
              }}
            >
              {data.skills.map((skill, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    ...getSizeStyles("text"),
                    fontFamily: fontFamily,
                  }}
                >
                  <span
                    className="print-safe"
                    style={{
                      display: "inline-block",
                      width: isCompact ? "0.5rem" : "0.75rem",
                      height: isCompact ? "0.5rem" : "0.75rem",
                      backgroundColor: colorScheme.primary,
                      borderRadius: "2px",
                      marginRight: "8px",
                      verticalAlign: "middle",
                    }}
                  ></span>
                  <span
                    className="font-medium"
                    style={{ verticalAlign: "middle" }}
                  >
                    {skill}
                  </span>
                </div>
              ))}
            </div>
          </Section>
        )}

        {data.activities.length > 0 && (
          <Section>
            <h2
              className="font-semibold print-safe"
              style={{
                ...getSizeStyles("heading"),
                marginBottom: spacingStyle.titleMargin,
                paddingBottom: "0.25rem",
                borderBottom: "2px solid",
                borderColor: colorScheme.primary,
                fontFamily: fontFamily,
              }}
            >
              ACTIVITIES
            </h2>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: spacingStyle.sectionGap,
              }}
            >
              {data.activities.map((activity, idx) => (
                <div key={activity.id ?? idx}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3
                        className="font-semibold print-safe"
                        style={{
                          ...getSizeStyles("text"),
                          color: colorScheme.secondary,
                          fontFamily: fontFamily,
                        }}
                      >
                        {activity.title}
                      </h3>
                      <p
                        style={{
                          ...getSizeStyles("text"),
                          color: "rgb(75 85 99)",
                          fontFamily: fontFamily,
                        }}
                      >
                        {activity.organization}
                      </p>
                    </div>
                    <p
                      style={{
                        ...getSizeStyles("text"),
                        color: "rgb(107 114 128)",
                        fontFamily: fontFamily,
                      }}
                    >
                      {activity.startDate} -{" "}
                      {activity.endDate && activity.endDate < today
                        ? activity.endDate
                        : "Hiện tại"}
                    </p>
                  </div>
                  {activity.description && (
                    <p
                      style={{
                        ...getSizeStyles("text"),
                        marginTop: "0.25rem",
                        fontFamily: fontFamily,
                      }}
                    >
                      {activity.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </Section>
        )}

        {data.awards.length > 0 && (
          <Section>
            <h2
              className="font-semibold print-safe"
              style={{
                ...getSizeStyles("heading"),
                marginBottom: spacingStyle.titleMargin,
                paddingBottom: "0.25rem",
                borderBottom: "2px solid",
                borderColor: colorScheme.primary,
                fontFamily: fontFamily,
              }}
            >
              AWARDS & CERTIFICATES
            </h2>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: spacingStyle.sectionGap,
              }}
            >
              {data.awards.map((award, idx) => (
                <div key={award.id ?? idx}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3
                        className="font-semibold print-safe"
                        style={{
                          ...getSizeStyles("text"),
                          color: colorScheme.secondary,
                          fontFamily: fontFamily,
                        }}
                      >
                        {award.title}
                      </h3>
                      <p
                        style={{
                          ...getSizeStyles("text"),
                          color: "rgb(75 85 99)",
                          fontFamily: fontFamily,
                        }}
                      >
                        {award.issuer}
                      </p>
                    </div>
                    <p
                      style={{
                        ...getSizeStyles("text"),
                        color: "rgb(107 114 128)",
                        fontFamily: fontFamily,
                      }}
                    >
                      {award.date}
                    </p>
                  </div>
                  {award.description && (
                    <p
                      style={{
                        ...getSizeStyles("text"),
                        marginTop: "0.25rem",
                        fontFamily: fontFamily,
                      }}
                    >
                      {award.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </Section>
        )}
      </div>
    </div>
  );
}
