"use client"

import { DashboardHeader } from "./dashboard-header"
import { StatsGrid } from "./stats-grid"
import { ActivityFeed } from "./activity-feed"
import { SecurityPanel } from "./security-panel"

interface DashboardProps {
  onLogout: () => void
}

export function Dashboard({ onLogout }: DashboardProps) {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <DashboardHeader onLogout={onLogout} />

      <div className="p-4 sm:p-6">
        <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-4 sm:p-6 text-white">
            <h2 className="text-xl sm:text-2xl font-bold mb-2">Welcome back!</h2>
            <p className="text-blue-100 text-sm sm:text-base">Here's what's happening with your account today.</p>
          </div>

          <StatsGrid />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="lg:col-span-2">
              <ActivityFeed />
            </div>
            <SecurityPanel />
          </div>
        </div>
      </div>
    </div>
  )
}
