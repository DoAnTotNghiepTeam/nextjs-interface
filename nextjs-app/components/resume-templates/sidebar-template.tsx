"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { ResumeData } from "../resume-builder";
import type { CustomizationOptions } from "../customization-panel";
import { colorSchemes, fontOptions, DEFAULT_CUSTOMIZATION } from "../customization-panel";
import styles from "./sidebar-template.module.css";

interface SidebarTemplateProps {
  data: ResumeData;
  customization: CustomizationOptions;
  isCompact?: boolean;
}

export function SidebarTemplate({
  data,
  customization,
  isCompact = false,
}: SidebarTemplateProps) {
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

  const getFontSizeMultiplier = () => {
    return 0.7 + ((fontSize - 1) * 0.9) / 7;
  };
  
  const getSpacingMultiplier = () => {
    return (spacing - 1.0) / 1.0;
  };

  const fontSizeMultiplier = getFontSizeMultiplier();
  const spacingMultiplier = getSpacingMultiplier();

  return (
    <div className={isCompact ? styles.sidebarCompact : undefined}>
      <div
        className={styles.sidebarResumeRoot}
        style={{
          fontFamily,
          fontSize: `${0.875 * fontSizeMultiplier}rem`,
        }}
      >
        {/* Left Sidebar */}
        <aside 
          className={styles.sidebar}
          style={{ backgroundColor: '#f5f5f0', color: '#2d2d2d' }}
        >
          {/* Avatar */}
          <div className={styles.avatarContainer}>
            <Avatar className={styles.avatar}>
              <AvatarImage
                src={data.personalInfo.profileImage || "/placeholder.svg"}
                style={{ objectFit: "cover" }}
              />
              <AvatarFallback style={{ fontSize: '2rem', backgroundColor: primaryColor, color: 'white' }}>
                {data.personalInfo.fullName?.charAt(0)?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Contact Info */}
          <div className={styles.sidebarSection}>
          <h3 className={styles.sidebarTitle}>Contact</h3>
          {data.personalInfo.phone && (
            <div className={styles.contactItem}>
              <span className={styles.contactIcon}>📞</span>
              <span className={styles.contactText}>{data.personalInfo.phone}</span>
            </div>
          )}
          {data.personalInfo.email && (
            <div className={styles.contactItem}>
              <span className={styles.contactIcon}>✉️</span>
              <span className={styles.contactText}>{data.personalInfo.email}</span>
            </div>
          )}
          {data.personalInfo.jobTitle && (
            <div className={styles.contactItem}>
              <span className={styles.contactIcon}>📍</span>
              <span className={styles.contactText}>{data.personalInfo.jobTitle}</span>
            </div>
          )}
          
        </div>

        {/* Skills */}
        {data.skills.length > 0 && (
          <div className={styles.sidebarSection}>
            <h3 className={styles.sidebarTitle}>Skills</h3>
            <div className={styles.skillsList}>
              {data.skills.map((skill, idx) => (
                <div key={idx} className={styles.skillItem}>
                  <div className={styles.skillDot}></div>
                  <span>{skill}</span>
                </div>
              ))}
            </div>
          </div>
        )}


        {/* Awards */}
        {data.awards.length > 0 && (
          <div className={styles.sidebarSection}>
            <h3 className={styles.sidebarTitle}>Awards & Certificates</h3>
            {data.awards.map((award, index) => (
              <div key={award.id || index} className={styles.awardItem}>
                <div className={styles.awardTitle}>{award.title}</div>
                <div className={styles.awardIssuer}>{award.issuer}</div>
                <div className={styles.awardDate}>{award.date}</div>
                {award.description && (
                  <div className={styles.awardDesc}>{award.description}</div>
                )}
              </div>
            ))}
          </div>
        )}
      </aside>

      {/* Right Main Content */}
      <main className={styles.mainContent} style={getBackgroundStyle()}>
        {/* Header */}
        <div className={styles.header} style={{ backgroundColor: primaryColor }}>
          <h1 className={styles.name} style={{ fontSize: `${2.25 * fontSizeMultiplier}rem`, color: 'white' }}>
            {data.personalInfo.fullName || "Your Name"}
          </h1>
          {data.personalInfo.summary && (
            <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.3)' }}>
              <p style={{ color: 'white', fontSize: `${0.875 * fontSizeMultiplier}rem`, lineHeight: 1.6, textAlign: 'justify', margin: 0, whiteSpace: 'pre-wrap', wordWrap: 'break-word', overflowWrap: 'break-word' }}>
                {data.personalInfo.summary}
              </p>
            </div>
          )}
        </div>

        {/* Work Experience */}
        {data.experience.length > 0 && (
          <section className={styles.section} style={{ marginBottom: `${1.5 * (1 + spacingMultiplier * 0.5)}rem` }}>
            <h2 className={styles.sectionTitle} style={{ color: primaryColor, fontSize: `${1.25 * fontSizeMultiplier}rem` }}>
              Work Experience
            </h2>
            {data.experience.map((exp, index) => (
              <div 
                key={exp.id || index} 
                className={styles.experienceItem}
                style={{ marginBottom: `${1 * (1 + spacingMultiplier * 0.5)}rem` }}
              >
                <div className={styles.expHeader}>
                  <div>
                    {/* <div className={styles.expCompany}>{exp.company}</div> */}
                    <div className={styles.expPosition}>{exp.company}</div>
                    <div className={styles.expCompany}>{exp.position}</div>
                  </div>
                  <div className={styles.expDate} style={{ backgroundColor: '#2d2d2d', color: 'white', padding: '0.15rem 0.35rem', borderRadius: '8px', fontSize: '0.4rem' }}>
                    {exp.startDate} - {exp.endDate || "Present"}
                  </div>
                </div>
                {exp.description && (
                  <div className={styles.expDescription}>
                    {exp.description.split('\n').map((line, i) => (
                      line.trim() && <div key={i}>{line.trim()}</div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </section>
        )}

        {/* Education */}
        {data.education.length > 0 && (
          <section className={styles.section} style={{ marginBottom: `${1.5 * (1 + spacingMultiplier * 0.5)}rem` }}>
            <h2 className={styles.sectionTitle} style={{ color: primaryColor, fontSize: `${1.25 * fontSizeMultiplier}rem` }}>
              Education
            </h2>
            {data.education.map((edu, index) => (
              <div 
                key={edu.id || index} 
                className={styles.experienceItem}
                style={{ marginBottom: `${1 * (1 + spacingMultiplier * 0.5)}rem` }}
              >
                <div className={styles.expHeader}>
                  <div>
                    <div className={styles.expCompany}>{edu.institution}</div>
                    <div className={styles.expCompany}>{edu.degree}</div>
                    {edu.field && <div className={styles.expCompany} style={{ fontSize: '0.875rem', marginTop: '0.25rem', color: '#6b7280' }}>{edu.field}</div>}
                  </div>
                  <div className={styles.expDate} style={{ backgroundColor: '#2d2d2d', color: 'white', padding: '0.15rem 0.35rem', borderRadius: '8px', fontSize: '0.4rem' }}>
                    {edu.startDate} - {edu.endDate}
                  </div>
                </div>
                {edu.gpa && (
                  <div className={styles.expDescription}>
                    <div>GPA: {edu.gpa}</div>
                  </div>
                )}
              </div>
            ))}
          </section>
        )}

        {/* Activities */}
        {data.activities.length > 0 && (
          <section className={styles.section} style={{ marginBottom: `${1.5 * (1 + spacingMultiplier * 0.5)}rem` }}>
            <h2 className={styles.sectionTitle} style={{ color: primaryColor, fontSize: `${1.25 * fontSizeMultiplier}rem` }}>
              Personal Projects
            </h2>
            {data.activities.map((activity, index) => (
              <div 
                key={activity?.id || `activity-${index}`} 
                className={styles.activityItem}
                style={{ marginBottom: `${1 * (1 + spacingMultiplier * 0.5)}rem` }}
              >
                <div className={styles.actHeader}>
                  <div>
                    <div className={styles.actTitle}>{activity.title}</div>
                    <div className={styles.actOrg}>{activity.organization}</div>
                  </div>
                  <div className={styles.actDate} style={{ backgroundColor: '#2d2d2d', color: 'white', padding: '0.15rem 0.35rem', borderRadius: '8px', fontSize: '0.4rem' }}>
                    {activity.startDate} - {activity.endDate || "Present"}
                  </div>
                </div>
                {activity.description && (
                  <div className={styles.actDescription}>{activity.description}</div>
                )}
              </div>
            ))}
          </section>
        )}
      </main>
      </div>
    </div>
  );
}
