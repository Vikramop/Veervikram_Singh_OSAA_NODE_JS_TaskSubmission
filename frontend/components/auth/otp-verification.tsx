"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Shield, CheckCircle, Send, Loader2, AlertTriangle } from "lucide-react"
import { CloudflareTurnstile } from "./cloudflare-turnstile"

interface OTPVerificationProps {
  otpSent: boolean
  otp: string
  setOtp: (value: string) => void
  resendCount: number
  isResending: boolean
  onSendOTP: () => void
  onResendOTP: () => void
  onVerifyOTP: (e: React.FormEvent) => void
  onCaptchaVerify: (token: string) => void
  onCaptchaError: () => void
}

export function OTPVerification({
  otpSent,
  otp,
  setOtp,
  resendCount,
  isResending,
  onSendOTP,
  onResendOTP,
  onVerifyOTP,
  onCaptchaVerify,
  onCaptchaError,
}: OTPVerificationProps) {
  const [showCaptcha, setShowCaptcha] = useState(false)
  const [captchaVerified, setCaptchaVerified] = useState(false)

  const needsCaptcha = resendCount > 0 && resendCount % 3 === 0
  const shouldShowCaptcha = needsCaptcha && !captchaVerified

  const handleResendClick = () => {
    if (shouldShowCaptcha) {
      setShowCaptcha(true)
      return
    }
    onResendOTP()
  }

  const handleCaptchaVerify = (token: string) => {
    setCaptchaVerified(true)
    setShowCaptcha(false)
    onCaptchaVerify(token)
    // Reset captcha verification for next cycle
    setTimeout(() => setCaptchaVerified(false), 1000)
  }

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader className="px-4 sm:px-6">
        <CardTitle className="text-center text-gray-100 flex items-center justify-center gap-2 text-lg sm:text-xl">
          <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />
          OTP Verification
        </CardTitle>
        <CardDescription className="text-center text-gray-400 text-sm">
          {!otpSent ? "Send an OTP to your linked Telegram account" : "Enter the 6-digit code sent to your Telegram"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6">
        {!otpSent ? (
          <div className="text-center space-y-4">
            <div className="bg-gray-800 rounded-lg p-4 sm:p-6">
              <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-base sm:text-lg font-semibold text-gray-100 mb-2">Telegram Linked Successfully</h3>
              <p className="text-gray-400 text-sm">
                Your Telegram account is now connected. Click below to receive your OTP.
              </p>
            </div>

            <Button
              onClick={onSendOTP}
              className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto"
              size="lg"
            >
              <Send className="w-4 h-4 mr-2" />
              Send OTP
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <form onSubmit={onVerifyOTP} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp" className="text-gray-200 text-sm">
                  Enter 6-Digit OTP
                </Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="123456"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  className="text-center text-xl sm:text-2xl tracking-widest bg-gray-800 border-gray-700 text-gray-100 focus:border-green-500"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                disabled={otp.length !== 6}
              >
                Verify OTP
              </Button>
            </form>

            {/* Resend Section */}
            <div className="space-y-4">
              {shouldShowCaptcha && (
                <div className="bg-orange-900/20 border border-orange-700 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-orange-400" />
                    <span className="text-orange-300 text-sm font-medium">Security Check Required</span>
                  </div>
                  <p className="text-orange-200 text-xs mb-3">
                    You've made {resendCount} resend attempts. Please complete the security verification below.
                  </p>
                </div>
              )}

              {showCaptcha && (
                <div className="space-y-3">
                  <CloudflareTurnstile onVerify={handleCaptchaVerify} onError={onCaptchaError} />
                </div>
              )}

              <Button
                type="button"
                variant="outline"
                onClick={handleResendClick}
                disabled={isResending}
                className="w-full border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isResending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Resending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Resend OTP {resendCount > 0 && `(${resendCount})`}
                  </>
                )}
              </Button>

              {resendCount > 0 && (
                <div className="text-center">
                  <p className="text-xs text-gray-500">
                    {resendCount % 3 === 0 ? (
                      <span className="text-orange-400">Security verification required for next resend</span>
                    ) : (
                      `${3 - (resendCount % 3)} attempts until security check`
                    )}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
