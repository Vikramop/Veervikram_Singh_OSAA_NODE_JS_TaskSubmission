"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LogOut, Bell, Search } from "lucide-react"

interface DashboardHeaderProps {
  onLogout: () => void
}

export function DashboardHeader({ onLogout }: DashboardHeaderProps) {
  return (
    <header className="bg-gray-900 border-b border-gray-800 px-4 sm:px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-4">
          <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            SecureAuth
          </h1>
          <span className="hidden sm:inline text-lg sm:text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Dashboard
          </span>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search..."
              className="pl-10 w-48 lg:w-64 bg-gray-800 border-gray-700 text-gray-100 focus:border-blue-500"
            />
          </div>
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-100 hover:bg-gray-800">
            <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
          <Button
            onClick={onLogout}
            variant="outline"
            size="sm"
            className="border-red-600 text-red-400 hover:bg-red-900 hover:text-red-100 bg-transparent"
          >
            <LogOut className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </div>

      {/* Mobile Search */}
      <div className="mt-4 sm:hidden">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search..."
            className="pl-10 w-full bg-gray-800 border-gray-700 text-gray-100 focus:border-blue-500"
          />
        </div>
      </div>
    </header>
  )
}
