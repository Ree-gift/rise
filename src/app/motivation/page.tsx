'use client';

import { useState } from 'react';
import { useData } from '@/lib/data-context';
import { Heart, RefreshCw, Bookmark, BookmarkCheck, Sparkles, Shield, Brain } from 'lucide-react';

const categories = [
  { key: 'all', label: 'All', icon: Sparkles },
  { key: 'confidence', label: 'Confidence', icon: Shield },
  { key: 'resilience', label: 'Resilience', icon: Brain },
  { key: 'growth', label: 'Growth', icon: Sparkles },
  { key: 'self-worth', label: 'Self-Worth', icon: Heart },
];

const copingStrategies = [
  {
    title: 'Reframe the Rejection',
    description: 'View each rejection as redirection to something better suited for you. Companies reject candidates for countless reasons that have nothing to do with your worth.',
    action: 'Write down 3 things this experience taught you.',
  },
  {
    title: 'The 24-Hour Rule',
    description: 'Give yourself 24 hours to feel disappointed, then channel that energy into your next application. Acknowledge your emotions, but dont let them define your timeline.',
    action: 'Set a timer for 24 hours, then update your resume or apply to a new role.',
  },
  {
    title: 'Celebrate the Effort',
    description: 'Applying is an achievement in itself. Each application represents courage and effort. Track your applications and celebrate milestones.',
    action: 'Reward yourself for every 10 applications submitted.',
  },
  {
    title: 'Build Your Support Network',
    description: 'Connect with others who understand the job search struggle. Share your experiences, vent safely, and learn from others journeys.',
    action: 'Share your story in the community or reach out to a mentor.',
  },
];

export default function MotivationPage() {
  const { affirmations } = useData();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentAffirmation, setCurrentAffirmation] = useState(affirmations[0]);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  const filteredAffirmations = selectedCategory === 'all'
    ? affirmations
    : affirmations.filter(a => a.category === selectedCategory);

  const getRandomAffirmation = () => {
    const next = filteredAffirmations[Math.floor(Math.random() * filteredAffirmations.length)];
    setCurrentAffirmation(next);
  };

  const toggleSave = (id: string) => {
    const newSaved = new Set(savedIds);
    if (newSaved.has(id)) {
      newSaved.delete(id);
    } else {
      newSaved.add(id);
    }
    setSavedIds(newSaved);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Stay Motivated</h1>
        <p className="mt-1 text-gray-600">Your mental wellness is just as important as your job search</p>
      </div>

      <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl p-8 text-white text-center">
        <p className="text-sm font-medium text-white/80 mb-4">Your Daily Reminder</p>
        <p className="text-2xl md:text-3xl font-medium mb-6">{currentAffirmation.text}</p>
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={getRandomAffirmation}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            New affirmation
          </button>
          <button
            onClick={() => toggleSave(currentAffirmation.id)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
          >
            {savedIds.has(currentAffirmation.id) ? (
              <BookmarkCheck className="h-4 w-4" />
            ) : (
              <Bookmark className="h-4 w-4" />
            )}
            Save
          </button>
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {categories.map(cat => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat.key
                    ? 'bg-primary-100 text-primary-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Icon className="h-4 w-4" />
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredAffirmations.map(affirmation => (
          <div
            key={affirmation.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <p className="text-gray-800 flex-1">{affirmation.text}</p>
              <button
                onClick={() => toggleSave(affirmation.id)}
                className="ml-4 text-gray-400 hover:text-primary-600 transition-colors"
              >
                {savedIds.has(affirmation.id) ? (
                  <BookmarkCheck className="h-5 w-5 text-primary-600" />
                ) : (
                  <Bookmark className="h-5 w-5" />
                )}
              </button>
            </div>
            <span className="inline-block mt-3 text-xs font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded-full capitalize">
              {affirmation.category}
            </span>
          </div>
        ))}
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Coping Strategies</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {copingStrategies.map((strategy, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{strategy.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{strategy.description}</p>
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-sm font-medium text-green-800">Try this:</p>
                <p className="text-sm text-green-700">{strategy.action}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
