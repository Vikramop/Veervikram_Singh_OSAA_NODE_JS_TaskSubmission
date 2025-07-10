'use client';

import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { DashboardHeader } from './dashboard-header';
import { StatsGrid } from './stats-grid';
import { ActivityFeed } from './activity-feed';
import { SecurityPanel } from './security-panel';
import { AdminPanel } from '../auth/admin-panel';

interface DashboardProps {
  onLogout: () => void;
}

interface DecodedToken {
  id: string;
  role: string;
  iat: number;
  exp: number;
}

export function Dashboard({ onLogout }: DashboardProps) {
  const username = localStorage.getItem('username');
  const [isAdmin, setIsAdmin] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  // 🔑 On mount, load token and decode role
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (!storedToken) return;

    try {
      const decoded = jwtDecode<DecodedToken>(storedToken);
      setIsAdmin(decoded.role === 'admin');
      setToken(storedToken);
    } catch (err) {
      console.error('Invalid JWT', err);
      localStorage.removeItem('token');
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <DashboardHeader onLogout={onLogout} />

      <div className="p-4 sm:p-6">
        <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
          {/* Welcome */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-4 sm:p-6 text-white">
            <h2 className="text-xl sm:text-2xl font-bold mb-2">
              Welcome back! {username}
            </h2>
            <p className="text-blue-100 text-sm sm:text-base">
              Here's what's happening with your account today.
            </p>
          </div>

          <StatsGrid />

          {/* Main grid layout */}
          {isAdmin ? (
            <>
              {/* Admin layout: both ActivityFeed + SecurityPanel (stacked cards) */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 ">
                <div className="lg:col-span-2">
                  <ActivityFeed />
                </div>
                <SecurityPanel isAdmin={true} />
              </div>

              {/* Admin Panel Section */}
              {token && (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-4 text-gray-200">
                    🔧 Admin Panel
                  </h3>
                  <AdminPanel token={token} />
                </div>
              )}
            </>
          ) : (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 w-[100%]">
                <SecurityPanel isAdmin={false} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
