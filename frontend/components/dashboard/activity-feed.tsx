'use client';

import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Activity } from 'lucide-react';
import { getActivityLogs } from '@/lib/api/admin';
import { formatDistanceToNow } from 'date-fns';

interface ActivityLog {
  type: string;
  createdAt: string;
  username?: string;
  ip?: string;
  endpoint?: string;
  success?: boolean;
}

interface Log {
  username: string;
  type: string;
  createdAt: string;
  ip?: string;
  endpoint?: string;
  success?: boolean;
}

export function ActivityFeed() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    getActivityLogs(token)
      .then((data) => setLogs(data))
      .catch((err) => console.error('Failed to load activity logs:', err));
  }, []);

  const getTypeColor = (type: string) => {
    if (type.includes('success')) return 'bg-green-400';
    if (type.includes('fail') || type.includes('error')) return 'bg-yellow-400';
    if (type.includes('login') || type.includes('otp')) return 'bg-blue-400';
    return 'bg-gray-400';
  };

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader className="pb-4">
        <CardTitle className="text-gray-100 flex items-center gap-2 text-lg sm:text-xl">
          <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
          Recent Activity
        </CardTitle>
        <CardDescription className="text-gray-400 text-sm">
          Latest user activities and system events
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="max-h-[400px] overflow-y-auto pr-1 space-y-3 sm:space-y-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
          {logs.length === 0 && (
            <p className="text-sm text-gray-400">No activity found.</p>
          )}
          {logs.map((log, index) => (
            <div
              key={index}
              className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-800 rounded-lg"
            >
              <div
                className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full flex-shrink-0 ${getTypeColor(
                  log.type
                )}`}
              ></div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-100 truncate">
                  <span className="font-medium">
                    {log.username || 'Unknown'}:
                  </span>{' '}
                  {log.type.replace(/_/g, ' ')}
                </p>
                <p className="text-xs text-gray-400">
                  {formatDistanceToNow(new Date(log.createdAt), {
                    addSuffix: true,
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
