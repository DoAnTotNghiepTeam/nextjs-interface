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
  
  // Use custom color if available, otherwise use scheme color
  const primaryColor = customization.customColor || colorScheme.primary;
  const secondaryColor = customization.customColor 
    ? adjustColorBrightness(customization.customColor, -20) 
    : colorScheme.secondary;

  const fontSize = customization.fontSize ?? DEFAULT_CUSTOMIZATION.fontSize;
  const spacing = customization.spacing ?? DEFAULT_CUSTOMIZATION.spacing;
  
  // Get background pattern
  const getBackgroundStyle = () => {
    const pattern = customization.backgroundPattern;
    if (!pattern || pattern === 'none') return { background: '#ffffff' };
    
    const patterns: Record<string, string> = {
      gradient1: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)',
      gradient2: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)',
      gradient3: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
      gradient4: 'linear-gradient(135deg, #dbeafe 0%, #93c5fd 100%)',
      gradient5: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)',
      gradient6: 'linear-gradient(135deg, #fed7aa 0%, #fdba74 100%)',
      gradient7: 'linear-gradient(135deg, #e9d5ff 0%, #d8b4fe 100%)',
      gradient8: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
      gradient9: 'linear-gradient(180deg, #dbeafe 0%, #93c5fd 100%)',
    };
    return { background: patterns[pattern] || '#ffffff' };
  };
  
  // Helper function to adjust color brightness
  function adjustColorBrightness(color: string, percent: number): string {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return '#' + (
      0x1000000 +
      (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
      (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
      (B < 255 ? (B < 1 ? 0 : B) : 255)
    ).toString(16).slice(1);
  }

  const today = new Date().toISOString().slice(0, 10);
  
  // Convert fontSize number (1-8) to size multiplier
  const getFontSizeMultiplier = () => {
    // fontSize: 1=smallest (0.7x), 4=medium (1x), 8=largest (1.6x)
    const fontSize = customization.fontSize ?? DEFAULT_CUSTOMIZATION.fontSize;
    return 0.7 + ((fontSize - 1) * 0.9) / 7;
  };
  
  const getSizeStyles = (type: "text" | "heading" | "title" | "name") => {
    const multiplier = getFontSizeMultiplier();
    const baseSizes = {
      text: isCompact ? 0.75 : 0.875,
      heading: isCompact ? 0.9 : 1,
      title: isCompact ? 1.1 : 1.25,
      name: isCompact ? 1.4 : 1.875,
    };
    return { fontSize: `${baseSizes[type] * multiplier}rem` };
  };

  const getSpacingStyles = () => {
    // Convert spacing number (1.0-2.0) to spacing multiplier
    const spacingMultiplier = customization.spacing ?? DEFAULT_CUSTOMIZATION.spacing;
    
    const baseSpacing = {
      // Main container spacing
      containerPadding: isCompact ? 0.75 : 2,
      sectionMargin: isCompact ? 0.5 : 1.5,
      headerPadding: isCompact ? 0.75 : 1.5,
      headerMargin: isCompact ? 0.5 : 1.5,

      // Section content spacing
      sectionGap: isCompact ? 0.25 : 1,
      itemGap: isCompact ? 0.25 : 0.5,
      itemPadding: isCompact ? 0.5 : 1,

      // Header spacing
      headerGap: isCompact ? 0.75 : 1.5,
      avatarMargin: isCompact ? 0.75 : 1.5,

      // Text spacing
      textMargin: isCompact ? 0.25 : 0.5,
      titleMargin: isCompact ? 0.25 : 0.75,
    };
    
    // Apply multiplier to all spacing values
    const multiplier = (spacingMultiplier - 1.0) / 1.0; // 0 to 1 range
    return {
      containerPadding: `${baseSpacing.containerPadding * (1 + multiplier * 0.5)}rem`,
      sectionMargin: `${baseSpacing.sectionMargin * (1 + multiplier * 0.5)}rem`,
      headerPadding: `${baseSpacing.headerPadding * (1 + multiplier * 0.5)}rem`,
      headerMargin: `${baseSpacing.headerMargin * (1 + multiplier * 0.5)}rem`,
      sectionGap: `${baseSpacing.sectionGap * (1 + multiplier * 0.5)}rem`,
      itemGap: `${baseSpacing.itemGap * (1 + multiplier * 0.5)}rem`,
      itemPadding: `${baseSpacing.itemPadding * (1 + multiplier * 0.5)}rem`,
      headerGap: `${baseSpacing.headerGap * (1 + multiplier * 0.5)}rem`,
      avatarMargin: `${baseSpacing.avatarMargin * (1 + multiplier * 0.5)}rem`,
      textMargin: `${baseSpacing.textMargin * (1 + multiplier * 0.5)}rem`,
      titleMargin: `${baseSpacing.titleMargin * (1 + multiplier * 0.5)}rem`,
    };
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
      className={`print-safe`}
      style={{
        ...getBackgroundStyle(),
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
          backgroundColor: primaryColor,
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
                backgroundColor: secondaryColor,
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
                borderColor: primaryColor,
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
                wordBreak: "break-word",
                overflowWrap: "break-word",
                whiteSpace: "pre-wrap",
                lineHeight: spacing,
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
                borderColor: primaryColor,
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
                          color: secondaryColor,
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
                      style={{ 
                        ...getSizeStyles("text"), 
                        marginTop: "0.25rem",
                        wordBreak: "break-word",
                        overflowWrap: "break-word",
                        whiteSpace: "pre-wrap",
                        lineHeight: spacing,
                      }}
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
                borderColor: primaryColor,
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
                          color: secondaryColor,
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
                borderColor: primaryColor,
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
                      backgroundColor: primaryColor,
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
                borderColor: primaryColor,
                fontFamily: fontFamily,
              }}
            >
              PERSONAL PROJECT
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
                          color: secondaryColor,
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
                        wordBreak: "break-word",
                        overflowWrap: "break-word",
                        whiteSpace: "pre-wrap",
                        lineHeight: spacing,
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
                borderColor: primaryColor,
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
                          color: secondaryColor,
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
                        wordBreak: "break-word",
                        overflowWrap: "break-word",
                        whiteSpace: "pre-wrap",
                        lineHeight: spacing,
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
