"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { ResumeData } from "../resume-builder";
import { type CustomizationOptions, fontOptions, DEFAULT_CUSTOMIZATION } from "../customization-panel";
import styles from "./professional-template.module.css";

type ProfessionalTemplateProps = {
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

export function ProfessionalTemplate({
  data,
  isCompact = false,
  customization,
}: ProfessionalTemplateProps) {
  const selectedFont =
    fontOptions.find((f) => f.value === customization?.font) || fontOptions[0];

  const fontSizeMultiplier = getFontSizeMultiplier(customization?.fontSize);
  const spacingMultiplier = getSpacingMultiplier(customization?.spacing);

  // Use custom color if available
  const useCustomColor = customization?.customColor;
  const primaryColor = customization?.customColor || "#2c3e50";

  return (
    <div
      style={
        {
          "--font-family": selectedFont.family,
          "--font-size-multiplier": fontSizeMultiplier,
          "--spacing-multiplier": 1 + spacingMultiplier * 0.5,
          ...(useCustomColor && {
            "--header-bg": primaryColor,
            "--accent-color": primaryColor,
            "--sidebar-bg": `${primaryColor}15`,
          }),
        } as React.CSSProperties
      }
      className={[
        styles.professionalResumeRoot,
        "print-safe",
        isCompact ? styles.professionalCompact : "",
        !useCustomColor && getColorSchemeClass(customization?.colorScheme),
      ].join(" ")}
    >
      {/* Top block - gộp header + objective với avatar đè lên */}
      <div className={styles.professionalTopBlock}>
        <header className={styles.professionalHeader}>
          <div className={styles.professionalHeaderLeft}>
            <h1 className={styles.professionalName}>
              {data.personalInfo.fullName?.toUpperCase() || "FULL NAME"}
            </h1>
            {/* {data.personalInfo.jobTitle && (
              <div className={styles.professionalJobTitle}>
                {data.personalInfo.jobTitle.toUpperCase()}
              </div>
            )} */}
          </div>

          {/* Avatar đè lên cả header và objective */}
          {data.personalInfo.profileImage && (
            <div className={styles.professionalAvatarWrapper}>
              <Avatar className={styles.professionalAvatar}>
                <AvatarImage
                  src={data.personalInfo.profileImage || "/placeholder.svg"}
                  style={{ objectFit: "cover" }}
                />
                <AvatarFallback>
                  {data.personalInfo.fullName?.charAt(0)?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
            </div>
          )}
        </header>

        {/* Section mục tiêu nghề nghiệp */}
        {data.personalInfo.summary && (
          <section className={styles.professionalObjective}>
            {/* <div className={styles.professionalObjectiveTitle}>MỤC TIÊU NGHỀ NGHIỆP</div> */}
            <p className={styles.professionalObjectiveText}>
              {data.personalInfo.summary}
            </p>
          </section>
        )}
      </div>

      {/* 3 icon thông tin */}
      <div className={styles.professionalInfoRow}>
        {data.personalInfo.jobTitle && (
          <div className={styles.professionalInfoItem}>
            <div className={styles.professionalInfoIcon}>💼</div>
            <div>
              <div className={styles.professionalInfoLabel}>Position</div>
              <div className={styles.professionalInfoValue}>{data.personalInfo.jobTitle}</div>
            </div>
          </div>
        )}
        {data.personalInfo.phone && (
          <div className={styles.professionalInfoItem}>
            <div className={styles.professionalInfoIcon}>📞</div>
            <div>
              <div className={styles.professionalInfoLabel}>Phone</div>
              <div className={styles.professionalInfoValue}>{data.personalInfo.phone}</div>
            </div>
          </div>
        )}
        {data.personalInfo.email && (
          <div className={styles.professionalInfoItem}>
            <div className={styles.professionalInfoIcon}>✉️</div>
            <div>
              <div className={styles.professionalInfoLabel}>Email</div>
              <div className={styles.professionalInfoValue}>{data.personalInfo.email}</div>
            </div>
          </div>
        )}
      </div>

      {/* Container 2 cột */}
      <div className={styles.professionalContent}>
        {/* Cột trái - trắng */}
        <div className={styles.professionalLeftColumn}>
          {/* Học vấn */}
          {data.education && data.education.length > 0 && (
            <section className={styles.professionalSection}>
              <h2 className={styles.professionalMainTitle}>EDUCATION</h2>
              {data.education.map((edu, index) => (
                <div key={index} className={styles.professionalEduItem}>
                  <div className={styles.professionalEduBullet}>▸</div>
                  <div className={styles.professionalEduContent}>
                    <div className={styles.professionalEduHeader}>
                      <div className={styles.professionalEduLeft}>
                        <div className={styles.professionalEduDegree}>
                          {edu.institution}
                        </div>
                        <div className={styles.professionalEduInstitution}>
                          {edu.degree} {edu.field && `- ${edu.field}`}
                        </div>
                      </div>
                      <div className={styles.professionalEduDate}>
                        {edu.startDate} - {edu.endDate || "Present"}
                      </div>
                    </div>
                    {edu.gpa && (
                      <div className={styles.professionalEduGpa}>GPA: {edu.gpa}</div>
                    )}
                  </div>
                </div>
              ))}
            </section>
          )}

          {/* Kinh nghiệm */}
          {data.experience && data.experience.length > 0 && (
            <section className={styles.professionalSection}>
              <h2 className={styles.professionalMainTitle}>WORK EXPERIENCE</h2>
              {data.experience.map((exp, index) => (
                <div key={index} className={styles.professionalExpItem}>
                  <div className={styles.professionalExpBullet}>▸</div>
                  <div className={styles.professionalExpContent}>
                    <div className={styles.professionalExpHeader}>
                      <div className={styles.professionalExpLeft}>
                        <div className={styles.professionalExpPosition}>{exp.company}</div>
                        <div className={styles.professionalExpCompany}>{exp.position}</div>
                      </div>
                      <div className={styles.professionalExpDate}>
                        {exp.startDate} - {exp.endDate || "Present"}
                      </div>
                    </div>
                    {exp.description && (
                      <ul className={styles.professionalExpList}>
                        {exp.description.split('\n').map((item, i) => (
                          item.trim() && <li key={i}>{item.trim()}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ))}
            </section>
          )}

          {/* Dự án cá nhân */}
          {data.activities && data.activities.length > 0 && (
            <section className={styles.professionalSection}>
              <h2 className={styles.professionalMainTitle}>PERSONAL PROJECTS</h2>
              {data.activities.map((project, index) => (
                <div key={index} className={styles.professionalExpItem}>
                  <div className={styles.professionalExpBullet}>▸</div>
                  <div className={styles.professionalExpContent}>
                    <div className={styles.professionalExpHeader}>
                      <div className={styles.professionalExpLeft}>
                        <div className={styles.professionalExpPosition}>{project.title}</div>
                        <div className={styles.professionalExpCompany}>{project.organization}</div>
                      </div>
                      <div className={styles.professionalExpDate}>
                        {project.startDate} - {project.endDate || "Present"}
                      </div>
                    </div>
                    {project.description && (
                      <ul className={styles.professionalExpList}>
                        {project.description.split('\n').map((item, i) => (
                          item.trim() && <li key={i}>{item.trim()}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ))}
            </section>
          )}
        </div>

        {/* Cột phải - màu xanh nhạt */}
        <div className={styles.professionalRightColumn}>
          {/* Danh hiệu & giải thưởng */}
          {/* {data.awards && data.awards.length > 0 && (
            <section className={styles.professionalSection}>
              <h2 className={styles.professionalSidebarTitle}>DANH HIỆU VÀ GIẢI THƯỞNG</h2>
              {data.awards.map((award, index) => (
                <div key={index} className={styles.professionalAwardItem}>
                  <div className={styles.professionalAwardYear}>{award.date || "2024"}</div>
                  <div className={styles.professionalAwardContent}>
                    <div className={styles.professionalAwardTitle}>{award.title}</div>
                    {award.description && (
                      <div className={styles.professionalAwardDesc}>{award.description}</div>
                    )}
                  </div>
                </div>
              ))}
            </section>
          )} */}

          {/* Chứng chỉ & Giải thưởng */}
          {data.awards && data.awards.length > 0 && (
            <section className={styles.professionalSection}>
              <h2 className={styles.professionalSidebarTitle}>CERTIFICATIONS & AWARDS</h2>
              {data.awards.map((award, index) => (
                <div key={index} className={styles.professionalCertItem}>
                  <div className={styles.professionalCertBullet}>•</div>
                  <div className={styles.professionalCertContent}>
                    <div className={styles.professionalCertName}>{award.title}</div>
                    <div className={styles.professionalCertIssuer}>
                      {award.issuer && `${award.issuer} - `}{award.date}
                    </div>
                    {award.description && (
                      <div className={styles.professionalAwardDesc}>{award.description}</div>
                    )}
                  </div>
                </div>
              ))}
            </section>
          )}

          {/* Kỹ năng */}
          {data.skills && data.skills.length > 0 && (
            <section className={styles.professionalSection}>
              <h2 className={styles.professionalSidebarTitle}>SKILLS</h2>
              <ul className={styles.professionalSkillList}>
                {data.skills.map((skill, index) => (
                  <li key={index} className={styles.professionalSkillItem}>
                    <span className={styles.professionalSkillName}>{skill}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Thông tin liên hệ */}
          <section className={styles.professionalSection}>
            <h2 className={styles.professionalSidebarTitle}>CONTACT INFORMATION</h2>
            <div className={styles.professionalContactList}>
              {data.personalInfo.phone && (
                <div className={styles.professionalContactItem}>
                  <span className={styles.contactIcon}>📞</span>
                  <span className={styles.professionalContactText}>{data.personalInfo.phone}</span>
                </div>
              )}
              {data.personalInfo.email && (
                <div className={styles.professionalContactItem}>
                  <span className={styles.contactIcon}>✉️</span>
                  <span className={styles.professionalContactText}>{data.personalInfo.email}</span>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
