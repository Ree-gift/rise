'use client';

import { useState } from 'react';
import { useData } from '@/lib/data-context';
import { Application } from '@/types';
import { ApplicationTable } from '@/components/ApplicationTable';
import { ApplicationForm } from '@/components/ApplicationForm';
import { RejectionChart } from '@/components/RejectionChart';
import { TrendingDown, Plus, X, BarChart3 } from 'lucide-react';

export default function TrackPage() {
  const { applications, stats, feedbacks, addApplication: addApp } = useData();
  const [showForm, setShowForm] = useState(false);

  const handleAddApplication = (newApp: Omit<Application, 'id'>) => {
    addApp(newApp);
    setShowForm(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Track Applications</h1>
          <p className="mt-1 text-gray-600">Log and analyze your job application journey</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Log Application
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 relative" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
            <ApplicationForm onSubmit={handleAddApplication} />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="h-5 w-5 text-primary-600" />
            <h2 className="text-lg font-semibold text-gray-900">Application Trends</h2>
          </div>
          <RejectionChart />
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingDown className="h-5 w-5 text-red-600" />
            <h2 className="text-lg font-semibold text-gray-900">Rejection Insights</h2>
          </div>
          <FeedbackSummary stats={stats} feedbacks={feedbacks} />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">All Applications</h2>
        <ApplicationTable applications={applications} />
      </div>
    </div>
  );
}

function FeedbackSummary({ stats, feedbacks }: { stats: any; feedbacks: any[] }) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-gray-900">Rejections by Category</h3>
      {Object.entries(stats.rejectionsByCategory).map(([category, count]) => {
        const numCount = count as number;
        const total = feedbacks.length;
        const percentage = total > 0 ? Math.round((numCount / total) * 100) : 0;
        if (numCount === 0) return null;
        return (
          <div key={category}>
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-gray-600 capitalize">{category}</span>
              <span className="font-medium text-gray-900">{numCount}</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-red-500 rounded-full transition-all duration-300"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        );
      })}

      <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
        <h4 className="text-sm font-medium text-yellow-800 mb-2">Suggested Action</h4>
        <p className="text-sm text-yellow-700">
          Based on your rejection patterns, focus on improving the top category. 
          Consider taking online courses or building projects to strengthen those areas.
        </p>
      </div>
    </div>
  );
}
