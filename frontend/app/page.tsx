'use client';

import type React from 'react';
import { verifyOTP, resendOTP } from '@/lib/api/auth';

import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { User, MessageCircle, Shield } from 'lucide-react';

import { LoginRegisterForm } from '@/components/auth/login-register-form';
import { TelegramLink } from '@/components/auth/telegram-link';
import { OTPEntry } from '@/components/auth/otp-entry';
import { Dashboard } from '@/components/dashboard/dashboard';
import { login, register } from '@/lib/api/auth';

export default function AuthDashboard() {
  const [activeTab, setActiveTab] = useState('auth');
  const [isRegistered, setIsRegistered] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isTelegramLinked, setIsTelegramLinked] = useState(false);
  const [isLinkingTelegram, setIsLinkingTelegram] = useState(false);
  const [otp, setOtp] = useState('');
  const [showDashboard, setShowDashboard] = useState(false);
  const [resendCount, setResendCount] = useState(0);
  const [isResending, setIsResending] = useState(false);
  const [isLoginFlow, setIsLoginFlow] = useState(false);
  const [showLoginAfterTelegram, setShowLoginAfterTelegram] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { toast } = useToast();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setShowDashboard(true);
    }
    setIsLoading(false); // ✅ Mark loading complete
  }, []);

  const handleRegister = async (
    username: string,
    password: string,
    dob: string
  ) => {
    try {
      // 1️⃣ call the backend
      await register({ username, passcode: password, dob });

      // 2️⃣ persist username for the Telegram‑link step
      localStorage.setItem('username', username);

      // 3️⃣ UI state
      setIsRegistered(true);
      setIsLoginFlow(false);
      setActiveTab('telegram');

      toast({
        title: 'Registration Successful!',
        description: 'Please link your Telegram account to continue.',
        className: 'bg-green-900 border-green-700 text-green-100',
      });
    } catch (err: any) {
      toast({
        title: 'Registration Failed',
        description: err.message || 'An unexpected error occurred.',
        variant: 'destructive',
      });
    }
  };

  const handleLogin = async (username: string, password: string) => {
    try {
      const res = await login({ username, passcode: password });
      localStorage.setItem('username', username);

      setIsLoggedIn(true);
      setIsLoginFlow(true);
      setShowLoginAfterTelegram(false);
      setResendCount(1);
      setActiveTab('otp-entry');

      toast({
        title: 'Login Successful!',
        description: 'Please enter your OTP to complete login.',
        className: 'bg-green-900 border-green-700 text-green-100',
      });
    } catch (err: any) {
      toast({
        title: 'Login Failed',
        description: err.message || 'An error occurred during login.',
        variant: 'destructive',
      });
    }
  };

  const handleTelegramLink = () => {
    const username = localStorage.getItem('username');
    if (!username) {
      toast({
        title: 'Error',
        description: 'Username not found in session.',
        variant: 'destructive',
        className: 'bg-red-900 border-red-700 text-red-100',
      });
      return;
    }

    const telegramLink =
      process.env.NEXT_PUBLIC_TELEGRAM_BOT_LINK + encodeURIComponent(username);
    window.open(telegramLink, '_blank');

    setIsLinkingTelegram(true);

    setTimeout(() => {
      setIsLinkingTelegram(false);
      setIsTelegramLinked(true);

      if (isRegistered && !showLoginAfterTelegram) {
        setShowLoginAfterTelegram(true);
        setActiveTab('auth');
        toast({
          title: 'Telegram Linked Successfully!',
          description: 'Your account is ready. Please login to continue.',
          className: 'bg-green-900 border-green-700 text-green-100',
        });
      } else {
        toast({
          title: 'Telegram Linked!',
          description: 'Your Telegram account has been connected successfully.',
          className: 'bg-blue-900 border-blue-700 text-blue-100',
        });
      }
    }, 2000);
  };

  const handleOTPVerification = async (e: React.FormEvent) => {
    e.preventDefault();

    if (otp.length !== 6) {
      toast({
        title: 'Invalid OTP',
        description: 'Please enter a valid 6-digit code.',
        variant: 'destructive',
        className: 'bg-red-900 border-red-700 text-red-100',
      });
      // localStorage.setItem('token', res.token);
      return;
    }

    try {
      const username = localStorage.getItem('username');
      if (!username) throw new Error('Session expired');
      console.log('verify payload2:', { username, otp });

      const { token, refreshToken } = await verifyOTP(username, otp);

      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);

      setShowDashboard(true);
      toast({
        title: 'Verification Complete!',
        description: 'Welcome to your dashboard.',
        className: 'bg-green-900 border-green-700 text-green-100',
      });
    } catch (err: any) {
      toast({
        title: 'OTP Verification Failed',
        description: err.message || 'Something went wrong.',
        variant: 'destructive',
        className: 'bg-red-900 border-red-700 text-red-100',
      });
    }
  };

  const handleResendOTP = async () => {
    const username = localStorage.getItem('username');
    if (!username) {
      toast({
        title: 'Session Expired',
        description: 'Please log in again.',
        variant: 'destructive',
        className: 'bg-red-900 border-red-700 text-red-100',
      });
      return;
    }

    try {
      const newCount = resendCount + 1;
      setResendCount(newCount);
      setIsResending(true);

      await resendOTP(username);

      toast({
        title: 'OTP Resent!',
        description: `New code sent to your Telegram. (Attempt ${newCount})`,
        className: 'bg-blue-900 border-blue-700 text-blue-100',
      });
    } catch (err: any) {
      toast({
        title: 'Resend Failed',
        description: err.message || 'Something went wrong.',
        variant: 'destructive',
        className: 'bg-red-900 border-red-700 text-red-100',
      });
    } finally {
      setIsResending(false);
    }
  };

  const handleCaptchaVerify = (token: string) => {
    // After captcha verification, proceed with resend
    handleResendOTP();
    toast({
      title: 'Security Verified!',
      description: 'Captcha completed. OTP has been resent.',
      className: 'bg-green-900 border-green-700 text-green-100',
    });
  };

  const handleCaptchaError = () => {
    toast({
      title: 'Verification Failed',
      description: 'Please try the security check again.',
      variant: 'destructive',
      className: 'bg-red-900 border-red-700 text-red-100',
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('username');
    // Reset all states
    setShowDashboard(false);
    setActiveTab('auth');
    setIsRegistered(false);
    setIsLoggedIn(false);
    setIsTelegramLinked(false);
    setIsLinkingTelegram(false);
    setOtp('');
    setResendCount(0);
    setIsResending(false);
    setIsLoginFlow(false);
    setShowLoginAfterTelegram(false);

    toast({
      title: 'Logged Out',
      description: 'You have been successfully logged out.',
      className: 'bg-blue-900 border-blue-700 text-blue-100',
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (showDashboard) {
    return <Dashboard onLogout={handleLogout} />;
  }

  // Determine which tabs should be shown and enabled
  const getTabsConfig = () => {
    if (isLoginFlow) {
      // Login flow: Auth -> OTP Entry
      return {
        tabs: ['auth', 'otp-entry'],
        authDisabled: isLoggedIn,
        telegramDisabled: true,
        otpEntryDisabled: !isLoggedIn,
      };
    } else if (showLoginAfterTelegram) {
      // After telegram linking during registration, show only auth tab for login
      return {
        tabs: ['auth'],
        authDisabled: false,
        telegramDisabled: true,
        otpEntryDisabled: true,
      };
    } else {
      // Registration flow: Auth -> Telegram
      return {
        tabs: ['auth', 'telegram'],
        authDisabled: isRegistered,
        telegramDisabled: !isRegistered,
        otpEntryDisabled: true,
      };
    }
  };

  const tabsConfig = getTabsConfig();

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            SecureAuth
          </h1>
          <p className="text-gray-400 mt-2 text-sm sm:text-base">
            Secure authentication with Telegram verification
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList
            className={`grid w-full ${
              tabsConfig.tabs.length === 1
                ? 'grid-cols-1'
                : tabsConfig.tabs.length === 2
                ? 'grid-cols-2'
                : 'grid-cols-3'
            } bg-gray-900 border border-gray-800 h-auto`}
          >
            <TabsTrigger
              value="auth"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white flex-col sm:flex-row gap-1 sm:gap-2 py-2 sm:py-3 text-xs sm:text-sm"
              disabled={tabsConfig.authDisabled}
            >
              <User className="w-4 h-4" />
              <span>Auth</span>
            </TabsTrigger>

            {tabsConfig.tabs.includes('telegram') && (
              <TabsTrigger
                value="telegram"
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white flex-col sm:flex-row gap-1 sm:gap-2 py-2 sm:py-3 text-xs sm:text-sm"
                disabled={tabsConfig.telegramDisabled}
              >
                <MessageCircle className="w-4 h-4" />
                <span>Telegram</span>
              </TabsTrigger>
            )}

            {tabsConfig.tabs.includes('otp-entry') && (
              <TabsTrigger
                value="otp-entry"
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white flex-col sm:flex-row gap-1 sm:gap-2 py-2 sm:py-3 text-xs sm:text-sm"
                disabled={tabsConfig.otpEntryDisabled}
              >
                <Shield className="w-4 h-4" />
                <span>OTP</span>
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="auth" className="mt-4 sm:mt-6">
            <LoginRegisterForm
              onLogin={handleLogin}
              onRegister={handleRegister}
              showLoginMessage={showLoginAfterTelegram}
            />
          </TabsContent>

          {tabsConfig.tabs.includes('telegram') && (
            <TabsContent value="telegram" className="mt-4 sm:mt-6">
              <TelegramLink
                onLink={handleTelegramLink}
                isLinking={isLinkingTelegram}
              />
            </TabsContent>
          )}

          {tabsConfig.tabs.includes('otp-entry') && (
            <TabsContent value="otp-entry" className="mt-4 sm:mt-6">
              <OTPEntry
                otp={otp}
                setOtp={setOtp}
                resendCount={resendCount}
                isResending={isResending}
                onResendOTP={handleResendOTP}
                onVerifyOTP={handleOTPVerification}
                onCaptchaVerify={handleCaptchaVerify}
                onCaptchaError={handleCaptchaError}
                isLogin={isLoginFlow}
                onSuccess={(token, refreshToken) => {
                  console.log('Logged in with:', token, refreshToken);
                  setShowDashboard(true);
                }}
              />
            </TabsContent>
          )}
        </Tabs>
      </div>
      <Toaster />
    </div>
  );
}
