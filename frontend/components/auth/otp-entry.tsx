'use client';

import React from 'react';
import { verifyOTP, resendOTP } from '@/lib/api/auth';
import { toast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, Send, Loader2, AlertTriangle } from 'lucide-react';
import { CloudflareTurnstile } from './cloudflare-turnstile';

interface OTPEntryProps {
  username: string; // ⬅️ pass this from parent
  onSuccess: (token: string, refresh: string) => void; // move to dashboard
}

export function OTPEntry({ username, onSuccess }: OTPEntryProps) {
  const [otp, setOtp] = React.useState('');
  const [resendCount, setResendCount] = React.useState(0);
  const [isResending, setIsResending] = React.useState(false);
  const [showCaptcha, setShowCaptcha] = React.useState(false);
  const [captchaVerified, setCaptchaVerified] = React.useState(false);

  /* ---------------- verification -------------- */
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const username = localStorage.getItem('username');
      if (!username) throw new Error('Session expired');
      console.log('verify payload:', { username, otp });

      const response = await verifyOTP({ username, otp });

      console.log('22');
      if (!response?.token || !response?.refreshToken) {
        throw new Error('Invalid OTP or server error.');
      }

      const { token, refreshToken } = response;

      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
      toast({ title: 'OTP verified – welcome!' });
      onSuccess(token, refreshToken);
    } catch (err: any) {
      toast({
        title: 'Invalid OTP',
        description: err.message,
        variant: 'destructive',
      });
    }
  };

  /* ---------------- resend -------------------- */
  const doResend = async () => {
    try {
      setIsResending(true);
      const username = localStorage.getItem('username')!;
      await resendOTP(username);
      setResendCount((c) => c + 1);
      toast({ title: 'OTP resent to Telegram 🚀' });
    } catch (err: any) {
      toast({
        title: 'Resend failed',
        description: err.message,
        variant: 'destructive',
      });
    } finally {
      setIsResending(false);
    }
  };

  /*  every 3rd resend needs captcha  */
  const needsCaptcha = resendCount > 0 && resendCount % 3 === 0;
  const shouldShowCaptcha = needsCaptcha && !captchaVerified;

  const handleResendClick = () => {
    if (shouldShowCaptcha) {
      setShowCaptcha(true);
      return;
    }
    doResend();
  };

  const handleCaptchaVerify = () => {
    setShowCaptcha(false);

    // Show loading for 2 seconds before proceeding
    setTimeout(() => {
      setCaptchaVerified(true);
      doResend();

      // Reset captchaVerified after 1 second
      setTimeout(() => setCaptchaVerified(false), 1000);
    }, 1000); // ⏳ wait 2 seconds before verifying
  };

  /* ---------------- UI ------------------------ */
  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader className="px-4 sm:px-6">
        <CardTitle className="flex items-center justify-center gap-2 text-lg sm:text-xl text-gray-100">
          <Shield className="w-5 h-5 text-green-400" /> OTP Verification
        </CardTitle>
        <CardDescription className="text-center text-gray-400 text-sm">
          Enter the 6‑digit code sent to your Telegram
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6 px-4 sm:px-6">
        {/* ---------- OTP form ----------- */}
        <form onSubmit={handleVerifyOTP} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="otp" className="text-gray-200 text-sm">
              6‑Digit OTP
            </Label>
            <Input
              id="otp"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              className="text-center text-2xl tracking-widest bg-gray-800 border-gray-700 focus:border-green-500 text-yellow-200"
              required
            />
          </div>
          <Button
            type="submit"
            disabled={otp.length !== 6}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            Verify OTP
          </Button>
        </form>

        {/* ---------- resend + captcha ----------- */}
        <div className="space-y-4">
          {shouldShowCaptcha && (
            <div className="bg-orange-900/20 border border-orange-700 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-orange-400" />
                <span className="text-orange-300 text-sm font-medium">
                  Security Check
                </span>
              </div>
              <p className="text-orange-200 text-xs mb-3">
                You've made {resendCount} resend attempts. Complete the check
                below.
              </p>
            </div>
          )}

          {showCaptcha && (
            <CloudflareTurnstile
              onVerify={handleCaptchaVerify}
              onError={() =>
                toast({ title: 'Captcha error', variant: 'destructive' })
              }
            />
          )}

          <Button
            type="button"
            variant="outline"
            onClick={handleResendClick}
            disabled={isResending}
            className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
          >
            {isResending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Resending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Resend OTP ({resendCount})
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
