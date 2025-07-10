"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Users, CheckCircle, Activity, Settings, TrendingUp } from "lucide-react"

const stats = [
  {
    title: "Total Users",
    value: "1,234",
    change: "+12% from last month",
    icon: Users,
    color: "bg-blue-600",
  },
  {
    title: "Verified Accounts",
    value: "987",
    change: "+8% from last month",
    icon: CheckCircle,
    color: "bg-green-600",
  },
  {
    title: "Active Sessions",
    value: "156",
    change: "Real-time",
    icon: Activity,
    color: "bg-purple-600",
  },
  {
    title: "System Health",
    value: "99.9%",
    change: "All systems operational",
    icon: Settings,
    color: "bg-orange-600",
  },
]

export function StatsGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="bg-gray-900 border-gray-800">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className={`w-10 h-10 sm:w-12 sm:h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-gray-400">{stat.title}</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-100">{stat.value}</p>
                <p className="text-xs text-green-400 flex items-center gap-1">
                  {stat.change.includes("Real-time") ? (
                    <Activity className="w-3 h-3" />
                  ) : stat.change.includes("All systems") ? (
                    <CheckCircle className="w-3 h-3" />
                  ) : (
                    <TrendingUp className="w-3 h-3" />
                  )}
                  {stat.change}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
