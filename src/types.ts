export type PageView = 'landing' | 'profile' | 'opportunities' | 'opportunity-detail';

export interface StudentProfile {
  // 1. Basic Information
  fullName: string;

  // 2. Education
  educationDegree: string;
  branchField: string;
  currentYear: string;

  // 3. Skills & Interests
  skills: string[];
  interests: string[];

  // 4. Career Goals
  careerGoal: string;

  // 5. Projects & Certifications
  projects: string[];
  certifications: string[];
}

export type OpportunityCategory = 'Internship' | 'Job' | 'Scholarship' | 'Certification';

export interface Opportunity {
  id: string;
  title: string;
  organization: string;
  category: OpportunityCategory;
  location: string;
  type: 'Remote' | 'Hybrid' | 'On-Site';
  deadline: string;
  field: string;
  summary: string;
  description: string;
  requiredSkills: string[];
  preferredSkills: string[];
  eligibilityCriteria: string[];
  benefitsOrAward: string;
  responsibilities?: string[];
}

export interface AIMatchAnalysis {
  opportunityId: string;
  matchScore: number; // 0 to 100
  eligibility: string;
  skillMatch: string[];
  careerRelevance: string;
  reasons: string[];
  skillGaps: string[];
  analyzedAt: string;
  isAiGenerated: boolean;
}
