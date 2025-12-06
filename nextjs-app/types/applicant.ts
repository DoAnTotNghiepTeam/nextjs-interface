export interface Applicant {
  id: number;
  jobId: number;
  candidateId: number;
  resumesId: number | null;
  resumeLink: string | null;
  jobTitle: string;
  applicationStatus: string; 
  coverLetter: string | null;
  appliedAt: string;
  description_company: string | null;
  companyName: string | null;
  logoUrl: string | null;
  salaryRange: string | null;
  fullName: string;
  location_company: string | null;
   // ✅ thêm field backend trả về
  missingSkills: string[];
  minExperience: string | null;
  experienceYears: number | null;
  skillMatchPercent: number | null;
  isSkillQualified: boolean;
  isExperienceQualified: boolean;
  skillMatchMessage: string | null;
  isRead: boolean;
  history?: ApplicantHistory[];
}

export type ApplicantHistory = {
  id: number;
  status: string;
  note: string;
  changedAt: string;
  changedBy: string;
};

export type ApplicantDetail = {
  id: number;
  jobTitle: string;
  fullName: string;
  coverLetter: string;
  applicationStatus: string;
  appliedAt: string;
  history: ApplicantHistory[];
};

export interface TimelineEvent {
  stepOrder: number;
  status: string;
  events: ApplicantHistory[];
  currentStep: boolean;
  completed: boolean;
}


export interface ApplicantTracking {
  detail: Applicant;
  history: ApplicantHistory[];
  timeline: TimelineEvent[];
}

export interface SavedJobResponseDTO {
  savedJobId: number;
  jobPostingResponseDTO: JobPostingResponseDTO;
  savedAt: string;
}

export interface JobPostingResponseDTO {
  postPriceUSD: number;
  postType: string; // NORMAL | VIP
  postPrice: number;
  id: number;
  employerId: number;
  employerName: string;
  title: string;
  description: string;
  location: string;
  salaryRange: string;
  jobType: string;
  category: string;
  requiredSkills: string[];
  minExperience: number;
  requiredDegree: string;
  endAt: string; // LocalDateTime => string
  status: string;
  createdAt: string;

  applicantsCount: number;
  newApplicantsCount: number;
  lastAppliedAt: string | null;
}

export interface Resume {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  profilePicture: string;
  summary: string;
  createdAt: string;
  jobTitle: string;
  template: string;
  experiences: Experience[];
  educations: Education[];
  awards: Award[];
  activities: Activity[];
  applicantIds: number[];
  skillsResumes: string[];
  candidateId: number;
  resumeLink: string;
}


export interface Award {
  resumeId: number;
  awardName: string;
  awardYear: string; // LocalDate → string
  donViTrao: string;
  description: string;
}
export interface Education {
  resumeId: number;
  schoolName: string;
  degree: string;
  major: string;
  startYear: string; // LocalDate → string
  endYear: string;   // LocalDate → string
  GPA: string;
}
export interface Experience {
  id: number;
  companyName: string;
  position: string;
  startYear: string; // LocalDate → string
  endYear: string;   // LocalDate → string
  description: string;
}
export interface Activity {
  activityName: string;
  organization: string;
  startYear: string; // LocalDate → string
  endYear: string;   // LocalDate → string
  description: string;
}

