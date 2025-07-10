"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Shield, CheckCircle, Loader2, RefreshCw } from "lucide-react"

interface CloudflareTurnstileProps {
  onVerify: (token: string) => void
  onError: () => void
}

export function CloudflareTurnstile({ onVerify, onError }: CloudflareTurnstileProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isVerified, setIsVerified] = useState(false)

  useEffect(() => {
    // Simulate loading the captcha
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  const handleVerify = () => {
    setIsVerified(true)
    // Simulate successful verification
    setTimeout(() => {
      onVerify("mock-captcha-token-12345")
    }, 500)
  }

  const handleRefresh = () => {
    setIsLoading(true)
    setIsVerified(false)
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  if (isLoading) {
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 flex items-center justify-center min-h-[80px]">
        <div className="flex items-center gap-3">
          <Loader2 className="w-5 h-5 animate-spin text-blue-400" />
          <span className="text-gray-300 text-sm">Loading security check...</span>
        </div>
      </div>
    )
  }

  if (isVerified) {
    return (
      <div className="bg-green-900/20 border border-green-700 rounded-lg p-4 flex items-center justify-center min-h-[80px]">
        <div className="flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-400" />
          <span className="text-green-300 text-sm">Security check completed</span>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-orange-400" />
          <span className="text-gray-300 text-sm font-medium">Security Verification</span>
        </div>
        <Button variant="ghost" size="sm" onClick={handleRefresh} className="text-gray-400 hover:text-gray-200 p-1">
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-3">
        <div className="bg-gray-900 border border-gray-600 rounded p-3 text-center">
          <div className="w-8 h-8 bg-orange-500 rounded mx-auto mb-2 flex items-center justify-center">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <p className="text-xs text-gray-400 mb-2">Verify you're human</p>
          <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
            <span>Protected by</span>
            <span className="font-semibold text-orange-400">Cloudflare</span>
          </div>
        </div>

        <Button
          onClick={handleVerify}
          className="w-full bg-orange-600 hover:bg-orange-700 text-white text-sm"
          size="sm"
        >
          <Shield className="w-4 h-4 mr-2" />
          Verify
        </Button>
      </div>
    </div>
  )
}
