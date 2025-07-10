"use client"

import type React from "react"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { User, MessageCircle, Shield } from "lucide-react"

import { LoginRegisterForm } from "@/components/auth/login-register-form"
import { TelegramLink } from "@/components/auth/telegram-link"
import { OTPVerification } from "@/components/auth/otp-verification"
import { Dashboard } from "@/components/dashboard/dashboard"

export default function AuthDashboard() {
  const [activeTab, setActiveTab] = useState("auth")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isTelegramLinked, setIsTelegramLinked] = useState(false)
  const [isLinkingTelegram, setIsLinkingTelegram] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState("")
  const [showDashboard, setShowDashboard] = useState(false)
  const [resendCount, setResendCount] = useState(0)
  const [isResending, setIsResending] = useState(false)
  const { toast } = useToast()

  const handleRegister = () => {
    toast({
      title: "Registration Successful!",
      description: "Please login with your credentials.",
      className: "bg-green-900 border-green-700 text-green-100",
    })
  }

  const handleLogin = () => {
    setIsLoggedIn(true)
    setActiveTab("telegram")
    toast({
      title: "Login Successful!",
      description: "Welcome back! Please link your Telegram account.",
      className: "bg-green-900 border-green-700 text-green-100",
    })
  }

  const handleTelegramLink = () => {
    setIsLinkingTelegram(true)

    setTimeout(() => {
      setIsLinkingTelegram(false)
      setIsTelegramLinked(true)
      setActiveTab("otp")
      toast({
        title: "Telegram Linked!",
        description: "Your Telegram account has been connected successfully.",
        className: "bg-blue-900 border-blue-700 text-blue-100",
      })
    }, 2000)
  }

  const handleSendOTP = () => {
    setOtpSent(true)
    setResendCount(1)
    toast({
      title: "OTP Sent!",
      description: "Check your Telegram for the verification code.",
      className: "bg-blue-900 border-blue-700 text-blue-100",
    })
  }

  const handleResendOTP = () => {
    const newCount = resendCount + 1
    setResendCount(newCount)
    setIsResending(true)

    setTimeout(() => {
      setIsResending(false)
      toast({
        title: "OTP Resent!",
        description: `New code sent to your Telegram. (Attempt ${newCount})`,
        className: "bg-blue-900 border-blue-700 text-blue-100",
      })
    }, 1000)
  }

  const handleCaptchaVerify = (token: string) => {
    // After captcha verification, proceed with resend
    handleResendOTP()
    toast({
      title: "Security Verified!",
      description: "Captcha completed. OTP has been resent.",
      className: "bg-green-900 border-green-700 text-green-100",
    })
  }

  const handleCaptchaError = () => {
    toast({
      title: "Verification Failed",
      description: "Please try the security check again.",
      variant: "destructive",
      className: "bg-red-900 border-red-700 text-red-100",
    })
  }

  const handleOTPVerification = (e: React.FormEvent) => {
    e.preventDefault()
    if (otp.length === 6) {
      setShowDashboard(true)
      toast({
        title: "Verification Complete!",
        description: "Welcome to your dashboard.",
        className: "bg-green-900 border-green-700 text-green-100",
      })
    } else {
      toast({
        title: "Invalid OTP",
        description: "Please enter a valid 6-digit code.",
        variant: "destructive",
        className: "bg-red-900 border-red-700 text-red-100",
      })
    }
  }

  const handleLogout = () => {
    // Reset all states
    setShowDashboard(false)
    setActiveTab("auth")
    setIsLoggedIn(false)
    setIsTelegramLinked(false)
    setIsLinkingTelegram(false)
    setOtpSent(false)
    setOtp("")
    setResendCount(0)
    setIsResending(false)

    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
      className: "bg-blue-900 border-blue-700 text-blue-100",
    })
  }

  if (showDashboard) {
    return <Dashboard onLogout={handleLogout} />
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            SecureAuth
          </h1>
          <p className="text-gray-400 mt-2 text-sm sm:text-base">Secure authentication with Telegram verification</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gray-900 border border-gray-800 h-auto">
            <TabsTrigger
              value="auth"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white flex-col sm:flex-row gap-1 sm:gap-2 py-2 sm:py-3 text-xs sm:text-sm"
              disabled={isLoggedIn}
            >
              <User className="w-4 h-4" />
              <span>Auth</span>
            </TabsTrigger>
            <TabsTrigger
              value="telegram"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white flex-col sm:flex-row gap-1 sm:gap-2 py-2 sm:py-3 text-xs sm:text-sm"
              disabled={!isLoggedIn}
            >
              <MessageCircle className="w-4 h-4" />
              <span>Telegram</span>
            </TabsTrigger>
            <TabsTrigger
              value="otp"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white flex-col sm:flex-row gap-1 sm:gap-2 py-2 sm:py-3 text-xs sm:text-sm"
              disabled={!isTelegramLinked}
            >
              <Shield className="w-4 h-4" />
              <span>OTP</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="auth" className="mt-4 sm:mt-6">
            <LoginRegisterForm onLogin={handleLogin} onRegister={handleRegister} />
          </TabsContent>

          <TabsContent value="telegram" className="mt-4 sm:mt-6">
            <TelegramLink onLink={handleTelegramLink} isLinking={isLinkingTelegram} />
          </TabsContent>

          <TabsContent value="otp" className="mt-4 sm:mt-6">
            <OTPVerification
              otpSent={otpSent}
              otp={otp}
              setOtp={setOtp}
              resendCount={resendCount}
              isResending={isResending}
              onSendOTP={handleSendOTP}
              onResendOTP={handleResendOTP}
              onVerifyOTP={handleOTPVerification}
              onCaptchaVerify={handleCaptchaVerify}
              onCaptchaError={handleCaptchaError}
            />
          </TabsContent>
        </Tabs>
      </div>
      <Toaster />
    </div>
  )
}
