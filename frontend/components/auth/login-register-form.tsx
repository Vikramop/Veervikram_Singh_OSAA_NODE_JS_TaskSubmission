"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Mail, Lock } from "lucide-react"

interface LoginRegisterFormProps {
  onLogin: () => void
  onRegister: () => void
}

export function LoginRegisterForm({ onLogin, onRegister }: LoginRegisterFormProps) {
  const [authMode, setAuthMode] = useState<"login" | "register">("login")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (authMode === "login") {
      onLogin()
    } else {
      onRegister()
    }
  }

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader className="px-4 sm:px-6">
        <div className="flex justify-center mb-4">
          <div className="flex bg-gray-800 rounded-lg p-1">
            <Button
              variant={authMode === "login" ? "default" : "ghost"}
              size="sm"
              onClick={() => setAuthMode("login")}
              className={`text-xs sm:text-sm ${authMode === "login" ? "bg-blue-600 hover:bg-blue-700" : "hover:bg-gray-700"}`}
            >
              Login
            </Button>
            <Button
              variant={authMode === "register" ? "default" : "ghost"}
              size="sm"
              onClick={() => setAuthMode("register")}
              className={`text-xs sm:text-sm ${authMode === "register" ? "bg-blue-600 hover:bg-blue-700" : "hover:bg-gray-700"}`}
            >
              Register
            </Button>
          </div>
        </div>
        <CardTitle className="text-center text-gray-100 text-lg sm:text-xl">
          {authMode === "login" ? "Welcome Back" : "Create Account"}
        </CardTitle>
        <CardDescription className="text-center text-gray-400 text-sm">
          {authMode === "login"
            ? "Enter your credentials to access your account"
            : "Fill in your details to create a new account"}
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4 sm:px-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {authMode === "register" && (
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-200 text-sm">
                Full Name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="name"
                  placeholder="John Doe"
                  className="pl-10 bg-gray-800 border-gray-700 text-gray-100 focus:border-blue-500"
                  required
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-200 text-sm">
              Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                className="pl-10 bg-gray-800 border-gray-700 text-gray-100 focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-200 text-sm">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="pl-10 bg-gray-800 border-gray-700 text-gray-100 focus:border-blue-500"
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
            {authMode === "login" ? "Sign In" : "Create Account"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
