import { getFeedbacks, getApplications } from '@/lib/data';
import { Feedback, Application } from '@/types';
import { Wrench, Lightbulb, Target, FileText, TrendingUp } from 'lucide-react';

export default function OptimizePage() {
  const feedbacks = getFeedbacks();
  const applications = getApplications();
  const rejected = applications.filter(a => a.status === 'rejected');

  const skillGapAnalysis = [
    {
      skill: 'React',
      mentions: 2,
      priority: 'High',
      resources: ['Build a portfolio project', 'Take advanced React patterns course'],
    },
    {
      skill: 'TypeScript',
      mentions: 1,
      priority: 'High',
      resources: ['Complete TypeScript handbook', 'Refactor existing projects to TS'],
    },
    {
      skill: 'Financial Domain Knowledge',
      mentions: 1,
      priority: 'Medium',
      resources: ['Learn fintech basics', 'Study financial systems architecture'],
    },
  ];

  const resumeTips = [
    {
      category: 'Tailor Your Resume',
      tip: 'Customize your resume for each application. Use keywords from the job description.',
      impact: 'High',
    },
    {
      category: 'Quantify Achievements',
      tip: 'Use metrics and numbers to demonstrate your impact. "Increased performance by 40%" beats "Improved performance".',
      impact: 'High',
    },
    {
      category: 'Highlight Projects',
      tip: 'Include 2-3 relevant projects that showcase the skills employers are looking for.',
      impact: 'Medium',
    },
    {
      category: 'ATS Optimization',
      tip: 'Use standard section headings and avoid complex formatting that ATS systems cant parse.',
      impact: 'High',
    },
  ];

  const interviewTips = [
    {
      phase: 'Before',
      tips: ['Research the company deeply', 'Prepare STAR method stories', 'Practice coding challenges'],
    },
    {
      phase: 'During',
      tips: ['Ask clarifying questions', 'Think out loud', 'Show enthusiasm for the role'],
    },
    {
      phase: 'After',
      tips: ['Send thank-you email within 24 hours', 'Reflect on areas to improve', 'Follow up after a week'],
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Optimize Your Applications</h1>
        <p className="mt-1 text-gray-600">Turn rejection feedback into actionable improvements</p>
      </div>

      <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-blue-100 rounded-lg">
            <Lightbulb className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-blue-900">Your Feedback Summary</h2>
            <p className="text-blue-700 mt-1">
              Based on {rejected.length} rejections, your most common feedback areas are identified below.
              Use this data to focus your improvement efforts.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-6">
          <Target className="h-5 w-5 text-primary-600" />
          <h2 className="text-lg font-semibold text-gray-900">Skill Gap Analysis</h2>
        </div>
        <div className="space-y-4">
          {skillGapAnalysis.map((gap, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-900">{gap.skill}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  gap.priority === 'High' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {gap.priority} Priority
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">Mentioned in {gap.mentions} rejection(s)</p>
              <div className="space-y-1">
                {gap.resources.map((resource, i) => (
                  <p key={i} className="text-sm text-green-700 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    {resource}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <FileText className="h-5 w-5 text-primary-600" />
            <h2 className="text-lg font-semibold text-gray-900">Resume Optimization</h2>
          </div>
          <div className="space-y-4">
            {resumeTips.map((tip, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">{tip.category}</h3>
                  <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded-full">
                    {tip.impact} Impact
                  </span>
                </div>
                <p className="text-sm text-gray-600">{tip.tip}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Wrench className="h-5 w-5 text-primary-600" />
            <h2 className="text-lg font-semibold text-gray-900">Interview Preparation</h2>
          </div>
          <div className="space-y-6">
            {interviewTips.map((phase, index) => (
              <div key={index}>
                <h3 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </span>
                  {phase.phase} Interview
                </h3>
                <ul className="space-y-1 ml-8">
                  {phase.tips.map((tip, i) => (
                    <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                      <span className="text-primary-600 mt-1">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
