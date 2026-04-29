'use client';

import { useState } from 'react';
import { Affirmation } from '@/types';
import { Heart, RefreshCw } from 'lucide-react';
import { getAffirmations } from '@/lib/data';

interface DailyAffirmationProps {
  affirmation: Affirmation;
}

export function DailyAffirmation({ affirmation }: DailyAffirmationProps) {
  const [current, setCurrent] = useState(affirmation);
  const [animate, setAnimate] = useState(false);

  const handleNewAffirmation = () => {
    const affirmations = getAffirmations();
    const all = affirmations.filter(a => a.id !== current.id);
    const next = all[Math.floor(Math.random() * all.length)];
    setAnimate(true);
    setTimeout(() => {
      setCurrent(next);
      setAnimate(false);
    }, 200);
  };

  return (
    <div className="bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl p-6 text-white">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-white/20 rounded-lg">
          <Heart className="h-6 w-6" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-white/80 mb-2">Daily Affirmation</p>
          <p className={`text-xl font-medium transition-opacity duration-200 ${animate ? 'opacity-0' : 'opacity-100'}`}>
            {current.text}
          </p>
          <div className="flex items-center gap-4 mt-4">
            <button
              onClick={handleNewAffirmation}
              className="inline-flex items-center gap-2 text-sm text-white/80 hover:text-white transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              New affirmation
            </button>
            <span className="text-xs text-white/60 capitalize bg-white/10 px-2 py-1 rounded-full">
              {current.category}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
