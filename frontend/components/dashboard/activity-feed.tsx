"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity } from "lucide-react"

const activities = [
  { action: "User logged in", time: "2 minutes ago", type: "success" },
  { action: "OTP verification completed", time: "5 minutes ago", type: "info" },
  { action: "New user registered", time: "8 minutes ago", type: "success" },
  { action: "Telegram account linked", time: "12 minutes ago", type: "info" },
  { action: "Password reset requested", time: "15 minutes ago", type: "warning" },
  { action: "Security scan completed", time: "20 minutes ago", type: "success" },
]

export function ActivityFeed() {
  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader className="pb-4">
        <CardTitle className="text-gray-100 flex items-center gap-2 text-lg sm:text-xl">
          <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
          Recent Activity
        </CardTitle>
        <CardDescription className="text-gray-400 text-sm">Latest user activities and system events</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 sm:space-y-4">
          {activities.map((activity, index) => (
            <div key={index} className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-800 rounded-lg">
              <div
                className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full flex-shrink-0 ${
                  activity.type === "success"
                    ? "bg-green-400"
                    : activity.type === "info"
                      ? "bg-blue-400"
                      : "bg-yellow-400"
                }`}
              ></div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-100 truncate">{activity.action}</p>
                <p className="text-xs text-gray-400">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
