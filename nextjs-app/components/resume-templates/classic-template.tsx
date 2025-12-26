"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { ResumeData } from "../resume-builder";
import { type CustomizationOptions, fontOptions, DEFAULT_CUSTOMIZATION } from "../customization-panel";
import styles from "./classic-template.module.css";

type ClassicTemplateProps = {
  data: ResumeData;
  isCompact?: boolean;
  customization: CustomizationOptions;
};

function getFontSizeMultiplier(fontSize: number | undefined): number {
  const size = fontSize || DEFAULT_CUSTOMIZATION.fontSize;
  return 0.7 + ((size - 1) * 0.9) / 7;
}

function getSpacingMultiplier(spacing: number | undefined): number {
  const space = spacing || DEFAULT_CUSTOMIZATION.spacing;
  return (space - 1.0) / 1.0;
}

function getColorSchemeClass(
  colorScheme: CustomizationOptions["colorScheme"] | undefined
) {
  switch (colorScheme) {
    case "blue":
      return styles.colorSchemeBlue;
    case "green":
      return styles.colorSchemeGreen;
    case "purple":
      return styles.colorSchemePurple;
    case "red":
      return styles.colorSchemeRed;
    case "orange":
      return styles.colorSchemeOrange;
    case "gray":
      return styles.colorSchemeGray;
    default:
      return styles.colorSchemeBlue;
  }
}

export function ClassicTemplate({
  data,
  isCompact = false,
  customization,
}: ClassicTemplateProps) {
  const selectedFont =
    fontOptions.find((f) => f.value === customization?.font) || fontOptions[0];

  const fontSizeMultiplier = getFontSizeMultiplier(customization?.fontSize);
  const spacingMultiplier = getSpacingMultiplier(customization?.spacing);

  // Use custom color if available
  const useCustomColor = customization?.customColor;
  const primaryColor = customization?.customColor;

  // Get background pattern
  const getBackgroundStyle = () => {
    const pattern = customization?.backgroundPattern;
    if (!pattern || pattern === 'none') return {};
    
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
    return { background: patterns[pattern] };
  };

  return (
    <div
      style={
        {
          "--font-family": selectedFont.family,
          "--font-size-multiplier": fontSizeMultiplier,
          "--spacing-multiplier": 1 + spacingMultiplier * 0.5,
          ...(useCustomColor && {
            "--sidebar-primary": primaryColor,
            "--sidebar-secondary": primaryColor,
            "--accent-color": primaryColor,
          }),
        } as React.CSSProperties
      }
      className={[
        styles.classicResumeRoot,
        "print-safe",
        isCompact ? styles.classicCompact : "",
        !useCustomColor && getColorSchemeClass(customization?.colorScheme),
      ].join(" ")}
    >
      {/* Sidebar trái */}
      <aside className={styles.classicResumeSidebar}>
        {/* Avatar */}
        <Avatar className={styles.classicResumeAvatar}>
          <AvatarImage
            src={data.personalInfo.profileImage || "/placeholder.svg"}
            className={styles.classicResumeAvatar}
            style={{ objectFit: "cover" }}
          />
          <AvatarFallback>
            {data.personalInfo.fullName?.charAt(0)?.toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
        
        {/* Tên và Chức danh trong sidebar */}
        <div className={styles.classicResumeSidebarName}>
          {data.personalInfo.fullName || "Full name"}
        </div>
        {data.personalInfo.jobTitle && (
          <div className={styles.classicResumeSidebarTitle}>
            {data.personalInfo.jobTitle}
          </div>
        )}
        
        {/* Thông tin cá nhân */}
        <div className={styles.classicResumeSection}>
          <ul className={styles.classicResumeInfoList}>
            {data.personalInfo.phone && (
              <li>
                <span>📞</span>
                <span>{data.personalInfo.phone}</span>
              </li>
            )}
            {data.personalInfo.email && (
              <li>
                <span>✉️</span>
                <span>{data.personalInfo.email}</span>
              </li>
            )}
            {data.personalInfo.jobTitle && (
              <li>
                <span>📍</span>
                <span>{data.personalInfo.jobTitle}</span>
              </li>
            )}
          </ul>
        </div>
        
        {/* Kỹ năng */}
        {data.skills.length > 0 && (
          <div className={styles.classicResumeSection}>
            <div className={styles.classicResumeSectionTitle}>Kỹ năng</div>
            <ul className={styles.classicResumeSkillList}>
              {data.skills.map((skill, idx) => (
                <li key={idx}>
                  <span className={styles.skillName}>{skill}</span>
                  <div className={styles.skillDots}>
                    <span className={styles.dotFilled}></span>
                    <span className={styles.dotFilled}></span>
                    <span className={styles.dotFilled}></span>
                    <span className={styles.dotFilled}></span>
                    <span className={styles.dotEmpty}></span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Chứng chỉ */}
        {data.awards.length > 0 && (
          <div className={styles.classicResumeSection}>
            <div className={styles.classicResumeSectionTitle}>Chứng chỉ</div>
            <ul className={styles.classicResumeCertList}>
              {data.awards.map((award, index) => (
                <li key={award.id || index}>
                  <div>
                    <b>{award.title}</b>
                    {award.issuer && <span> - {award.issuer}</span>}
                  </div>
                  {award.date && <div className={styles.certDate}>{award.date}</div>}
                  {award.description && <div>{award.description}</div>}
                </li>
              ))}
            </ul>
          </div>
        )}
      </aside>
      {/* Main phải */}
      <main className={styles.classicResumeMain} style={getBackgroundStyle()}>
        {/* Mục tiêu nghề nghiệp */}
        {data.personalInfo.summary && (
          <div className={styles.classicResumeSection}>
            <div className={styles.classicResumeSectionTitle}>
              Mục tiêu nghề nghiệp
            </div>
            <div className={styles.classicResumeSummary}>
              {data.personalInfo.summary}
            </div>
          </div>
        )}
        
        {/* Học vấn */}
        {data.education.length > 0 && (
          <div className={styles.classicResumeSection}>
            <div className={styles.classicResumeSectionTitle}>Học vấn</div>
            {data.education.map((edu, index) => (
              <div
                key={edu.id || index}
                className={styles.classicResumeSubSection}
                style={getBackgroundStyle()}
              >
                <div className={styles.classicResumeJobHeader}>
                  <div>
                    <div className={styles.classicResumeMeta}>
                      {edu.startDate} - {edu.endDate}
                    </div>
                    <div className={styles.classicResumeSubSectionTitle}>
                      {edu.institution}
                    </div>
                  </div>
                  <div className={styles.classicResumePosition}>
                    {edu.degree} | {edu.field}
                  </div>
                </div>
                {edu.gpa && <div>GPA: {edu.gpa}</div>}
              </div>
            ))}
          </div>
        )}
        
        {/* Kinh nghiệm làm việc */}
        {data.experience.length > 0 && (
          <div className={styles.classicResumeSection}>
            <div className={styles.classicResumeSectionTitle}>
              Kinh nghiệm làm việc
            </div>
            {data.experience.map((exp, index) => (
              <div
                key={exp.id || index}
                className={styles.classicResumeSubSection}
                style={getBackgroundStyle()}
              >
                <div className={styles.classicResumeJobHeader}>
                  <div>
                    <div className={styles.classicResumeMeta}>
                      {exp.startDate} - {exp.endDate || "Nay"}
                    </div>
                    <div className={styles.classicResumeSubSectionTitle}>
                      {exp.company}
                    </div>
                  </div>
                  <div className={styles.classicResumePosition}>
                    {exp.position}
                  </div>
                </div>
                {exp.description && (
                  <div className={styles.classicResumeDescription}>
                    {exp.description.split('\n').map((line, i) => (
                      line.trim() && <div key={i}>• {line.trim()}</div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        
        {/* Hoạt động */}
        {data.activities.length > 0 && (
          <div className={styles.classicResumeSection}>
            <div className={styles.classicResumeSectionTitle}>Hoạt động</div>
            {data.activities.map((activity, index) => (
              <div
                key={
                  activity?.id || `${activity?.title || "activity"}-${index}`
                }
                className={styles.classicResumeSubSection}
                style={getBackgroundStyle()}
              >
                <div className={styles.classicResumeJobHeader}>
                  <div>
                    <div className={styles.classicResumeMeta}>
                      {activity.startDate} - {activity.endDate || "Hiện tại"}
                    </div>
                    <div className={styles.classicResumeSubSectionTitle}>
                      {activity.organization}
                    </div>
                  </div>
                  <div className={styles.classicResumePosition}>
                    {activity.title}
                  </div>
                </div>
                {activity.description && (
                  <div className={styles.classicResumeDescription}>
                    {activity.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
