export type PageView = 'landing' | 'profile' | 'how-it-works';

export interface StudentProfile {
  fullName: string;
  email: string;
  educationLevel: string;
  fieldOfStudy: string;
  targetRole: string;
  skills: string[];
  interests: string[];
  opportunityTypes: string[];
}

export interface CapabilityItem {
  id: string;
  title: string;
  tagline: string;
  description: string;
  points: string[];
}
