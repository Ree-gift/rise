'use client';

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import {
  getApplications as _getApplications,
  getFeedbacks as _getFeedbacks,
  getAffirmations as _getAffirmations,
  getCommunityPosts as _getCommunityPosts,
  getStats as _getStats,
  addApplication as _addApplication,
} from './data';
import { Application, Stats, Feedback, Affirmation, CommunityPost } from '@/types';

interface DataContextType {
  applications: Application[];
  stats: Stats;
  feedbacks: Feedback[];
  affirmations: Affirmation[];
  posts: CommunityPost[];
  addApplication: (app: Omit<Application, 'id'>) => void;
}

const DataContext = createContext<DataContextType | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const [applications, setApplications] = useState<Application[]>(() => _getApplications());
  const [version, setVersion] = useState(0);

  const stats = _getStats();
  const feedbacks = _getFeedbacks();
  const affirmations = _getAffirmations();
  const posts = _getCommunityPosts();

  const addApplication = useCallback((app: Omit<Application, 'id'>) => {
    const newApp = _addApplication(app);
    setApplications(prev => [newApp, ...prev]);
    setVersion(v => v + 1);
  }, []);

  return (
    <DataContext.Provider value={{ applications, stats, feedbacks, affirmations, posts, addApplication }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}
