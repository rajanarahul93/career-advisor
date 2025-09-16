export interface UserProfile {
  interests: string[];
  currentSkills: string[];
  education: string;
  careerGoals: string;
  preferredIndustries: string[];
}

export interface FormErrors {
  interests?: string;
  currentSkills?: string;
  education?: string;
  careerGoals?: string;
  preferredIndustries?: string;
}

export type AppSection =
  | "home"
  | "mentor"
  | "roadmap"
  | "interview"
  | "analytics";

export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}