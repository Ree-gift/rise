export interface Application {
  id: string;
  company: string;
  position: string;
  status: 'applied' | 'interview' | 'rejected' | 'offered';
  appliedDate: string;
  responseDate?: string;
  feedback?: string;
  salary?: number;
  location?: string;
  notes?: string;
}

export interface Feedback {
  id: string;
  applicationId: string;
  category: 'skills' | 'experience' | 'culture' | 'salary' | 'other';
  text: string;
  date: string;
}

export interface Affirmation {
  id: string;
  text: string;
  category: 'confidence' | 'resilience' | 'growth' | 'self-worth';
}

export interface CommunityPost {
  id: string;
  author: string;
  avatar?: string;
  title: string;
  content: string;
  category: 'vent' | 'advice' | 'celebration' | 'question';
  upvotes: number;
  replies: number;
  date: string;
}

export interface Stats {
  totalApplications: number;
  interviewRate: number;
  rejectionRate: number;
  averageResponseTime: number;
  applicationsByStatus: Record<string, number>;
  applicationsByMonth: Record<string, number>;
  rejectionsByCategory: Record<string, number>;
}
