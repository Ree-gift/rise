import { Application, Feedback, Affirmation, CommunityPost, Stats } from '@/types';

let applications: Application[] = [
  {
    id: '1',
    company: 'TechCorp',
    position: 'Frontend Developer',
    status: 'rejected',
    appliedDate: '2024-01-15',
    responseDate: '2024-02-01',
    feedback: 'Looking for more React experience',
    location: 'Remote',
  },
  {
    id: '2',
    company: 'StartupXYZ',
    position: 'Full Stack Engineer',
    status: 'rejected',
    appliedDate: '2024-01-20',
    responseDate: '2024-02-10',
    feedback: 'Went with internal candidate',
    location: 'San Francisco, CA',
  },
  {
    id: '3',
    company: 'BigTech Inc',
    position: 'Software Engineer II',
    status: 'interview',
    appliedDate: '2024-02-01',
    location: 'Seattle, WA',
  },
  {
    id: '4',
    company: 'DesignCo',
    position: 'UI Engineer',
    status: 'rejected',
    appliedDate: '2024-02-05',
    responseDate: '2024-02-20',
    feedback: 'Need stronger TypeScript skills',
    location: 'Remote',
  },
  {
    id: '5',
    company: 'DataFlow',
    position: 'Frontend Developer',
    status: 'applied',
    appliedDate: '2024-02-15',
    location: 'Austin, TX',
  },
  {
    id: '6',
    company: 'CloudNine',
    position: 'React Developer',
    status: 'offered',
    appliedDate: '2024-01-10',
    responseDate: '2024-02-25',
    salary: 125000,
    location: 'Remote',
  },
  {
    id: '7',
    company: 'FinServe',
    position: 'Junior Developer',
    status: 'rejected',
    appliedDate: '2024-02-18',
    responseDate: '2024-03-01',
    feedback: 'Not enough experience with financial systems',
    location: 'New York, NY',
  },
  {
    id: '8',
    company: 'HealthTech',
    position: 'Software Engineer',
    status: 'interview',
    appliedDate: '2024-02-22',
    location: 'Boston, MA',
  },
];

const feedbacks: Feedback[] = [
  { id: 'f1', applicationId: '1', category: 'skills', text: 'Need more React project experience', date: '2024-02-01' },
  { id: 'f2', applicationId: '2', category: 'experience', text: 'Internal candidate preferred', date: '2024-02-10' },
  { id: 'f3', applicationId: '4', category: 'skills', text: 'Stronger TypeScript skills needed', date: '2024-02-20' },
  { id: 'f4', applicationId: '7', category: 'experience', text: 'Lack domain experience in finance', date: '2024-03-01' },
];

const affirmations: Affirmation[] = [
  { id: 'a1', text: 'Every rejection brings you one step closer to the right opportunity.', category: 'resilience' },
  { id: 'a2', text: 'Your worth is not defined by a rejection letter.', category: 'self-worth' },
  { id: 'a3', text: 'Skills can be learned. You are growing every day.', category: 'growth' },
  { id: 'a4', text: 'You have unique talents that the right employer will value.', category: 'confidence' },
  { id: 'a5', text: 'Persistence is your superpower in this journey.', category: 'resilience' },
  { id: 'a6', text: 'Each application is practice for your dream job.', category: 'growth' },
  { id: 'a7', text: 'You are more than your job title.', category: 'self-worth' },
  { id: 'a8', text: 'The right opportunity is out there, keep going.', category: 'confidence' },
];

const communityPosts: CommunityPost[] = [
  {
    id: 'p1',
    author: 'Alex M.',
    title: 'Finally got an offer after 47 rejections!',
    content: 'After 3 months of constant rejections, I finally received an offer. The key was to keep improving and not take rejections personally. Each one taught me something new.',
    category: 'celebration',
    upvotes: 234,
    replies: 45,
    date: '2024-02-25',
  },
  {
    id: 'p2',
    author: 'Sarah K.',
    title: 'How do you handle the emotional toll?',
    content: 'I have been rejected from 20 positions in the last month. How do you all stay motivated? Looking for coping strategies.',
    category: 'question',
    upvotes: 89,
    replies: 67,
    date: '2024-02-24',
  },
  {
    id: 'p3',
    author: 'Mike R.',
    title: 'Tip: Track your rejection reasons',
    content: 'I started categorizing my rejection reasons and noticed a pattern - most were about specific skills. I spent 2 weeks learning those skills and got 3 interviews the following week!',
    category: 'advice',
    upvotes: 156,
    replies: 23,
    date: '2024-02-23',
  },
  {
    id: 'p4',
    author: 'Jordan P.',
    title: 'Vent: Another ghosted application',
    content: 'Applied, did 3 rounds of interviews, and never heard back. The silence is sometimes worse than the rejection.',
    category: 'vent',
    upvotes: 201,
    replies: 89,
    date: '2024-02-22',
  },
];

export function getApplications(): Application[] {
  return applications;
}

export function getFeedbacks(): Feedback[] {
  return feedbacks;
}

export function getAffirmations(): Affirmation[] {
  return affirmations;
}

export function getCommunityPosts(): CommunityPost[] {
  return communityPosts;
}

export function getStats(): Stats {
  const total = applications.length;
  const rejected = applications.filter(a => a.status === 'rejected').length;
  const interview = applications.filter(a => a.status === 'interview').length;
  
  const applicationsByStatus = {
    applied: applications.filter(a => a.status === 'applied').length,
    interview,
    rejected,
    offered: applications.filter(a => a.status === 'offered').length,
  };

  const rejectionsByCategory: Record<string, number> = {
    skills: 0,
    experience: 0,
    culture: 0,
    salary: 0,
    other: 0,
  };
  
  feedbacks.forEach(f => {
    rejectionsByCategory[f.category] = (rejectionsByCategory[f.category] || 0) + 1;
  });

  const applicationsByMonth: Record<string, number> = {};
  applications.forEach(a => {
    const month = a.appliedDate.substring(0, 7);
    applicationsByMonth[month] = (applicationsByMonth[month] || 0) + 1;
  });

  let totalResponseTime = 0;
  let responseCount = 0;
  applications.forEach(a => {
    if (a.responseDate) {
      const applied = new Date(a.appliedDate).getTime();
      const responded = new Date(a.responseDate).getTime();
      totalResponseTime += (responded - applied) / (1000 * 60 * 60 * 24);
      responseCount++;
    }
  });

  return {
    totalApplications: total,
    interviewRate: total > 0 ? Math.round((interview / total) * 100) : 0,
    rejectionRate: total > 0 ? Math.round((rejected / total) * 100) : 0,
    averageResponseTime: responseCount > 0 ? Math.round(totalResponseTime / responseCount) : 0,
    applicationsByStatus,
    applicationsByMonth,
    rejectionsByCategory,
  };
}

export function addApplication(app: Omit<Application, 'id'>): Application {
  const newApp = { ...app, id: String(Date.now()) };
  applications = [newApp, ...applications];
  return newApp;
}
