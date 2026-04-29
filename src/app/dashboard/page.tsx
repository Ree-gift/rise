'use client';

import Link from 'next/link';
import { useData } from '@/lib/data-context';
import { StatCard } from '@/components/StatCard';
import { ApplicationTable } from '@/components/ApplicationTable';
import { DailyAffirmation } from '@/components/DailyAffirmation';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Clock
} from 'lucide-react';

export default function DashboardPage() {
  const { applications, stats, affirmations } = useData();
  const recentApps = applications.slice(0, 5);
  const dailyAffirmation = affirmations[Math.floor(Math.random() * affirmations.length)];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
          <p className="mt-1 text-gray-600">Every rejection is a step closer to your dream job.</p>
        </div>
        <Link
          href="/track"
          prefetch={true}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          + Log Application
        </Link>
      </div>

      <DailyAffirmation affirmation={dailyAffirmation} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Applications"
          value={stats.totalApplications}
          icon={ArrowUpRight}
          color="primary"
        />
        <StatCard
          title="Interview Rate"
          value={`${stats.interviewRate}%`}
          icon={ArrowUpRight}
          color="green"
        />
        <StatCard
          title="Rejection Rate"
          value={`${stats.rejectionRate}%`}
          icon={ArrowDownRight}
          color="red"
        />
        <StatCard
          title="Avg Response Time"
          value={`${stats.averageResponseTime} days`}
          icon={Clock}
          color="yellow"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Applications</h2>
            <Link href="/track" prefetch={true} className="text-sm text-primary-600 hover:text-primary-700">
              View all
            </Link>
          </div>
          <ApplicationTable applications={recentApps} />
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Applications by Status</h2>
          <div className="space-y-4">
            {Object.entries(stats.applicationsByStatus).map(([status, count]) => {
              const percentage = Math.round((count / stats.totalApplications) * 100);
              const colors: Record<string, string> = {
                applied: 'bg-blue-500',
                interview: 'bg-yellow-500',
                rejected: 'bg-red-500',
                offered: 'bg-green-500',
              };
              return (
                <div key={status}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-600 capitalize">{status}</span>
                    <span className="font-medium text-gray-900">{count}</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${colors[status]} rounded-full transition-all duration-300`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <Link href="/track" prefetch={true} className="p-3 bg-blue-50 rounded-lg text-center hover:bg-blue-100 transition-colors">
                <p className="text-sm font-medium text-blue-700">Log Application</p>
              </Link>
              <Link href="/optimize" prefetch={true} className="p-3 bg-purple-50 rounded-lg text-center hover:bg-purple-100 transition-colors">
                <p className="text-sm font-medium text-purple-700">Review Feedback</p>
              </Link>
              <Link href="/motivation" prefetch={true} className="p-3 bg-pink-50 rounded-lg text-center hover:bg-pink-100 transition-colors">
                <p className="text-sm font-medium text-pink-700">Daily Boost</p>
              </Link>
              <Link href="/community" prefetch={true} className="p-3 bg-green-50 rounded-lg text-center hover:bg-green-100 transition-colors">
                <p className="text-sm font-medium text-green-700">Community</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
