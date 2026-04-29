import { Application } from '@/types';
import { format } from 'date-fns';
import { CheckCircle, XCircle, Clock, Briefcase } from 'lucide-react';

interface ApplicationTableProps {
  applications: Application[];
}

const statusConfig = {
  applied: { icon: Clock, color: 'bg-blue-100 text-blue-700', label: 'Applied' },
  interview: { icon: Briefcase, color: 'bg-yellow-100 text-yellow-700', label: 'Interview' },
  rejected: { icon: XCircle, color: 'bg-red-100 text-red-700', label: 'Rejected' },
  offered: { icon: CheckCircle, color: 'bg-green-100 text-green-700', label: 'Offered' },
};

export function ApplicationTable({ applications }: ApplicationTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Company</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Position</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Date</th>
          </tr>
        </thead>
        <tbody>
          {applications.map(app => {
            const config = statusConfig[app.status];
            const Icon = config.icon;
            return (
              <tr key={app.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4">
                  <p className="text-sm font-medium text-gray-900">{app.company}</p>
                </td>
                <td className="py-3 px-4">
                  <p className="text-sm text-gray-600">{app.position}</p>
                </td>
                <td className="py-3 px-4">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
                    <Icon className="h-3 w-3" />
                    {config.label}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <p className="text-sm text-gray-600">
                    {format(new Date(app.appliedDate), 'MMM d')}
                  </p>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
