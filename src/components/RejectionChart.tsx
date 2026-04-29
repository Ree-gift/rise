'use client';

import dynamic from 'next/dynamic';

const Chart = dynamic(() => import('./Chart').then(m => m.Chart), { ssr: false });

export function RejectionChart() {
  return <Chart />;
}
