'use client';

import React, { useState } from 'react';
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
import { User, Lock, CheckCircle } from 'lucide-react';

interface LoginRegisterFormProps {
  onLogin: (username: string, password: string) => void;
  onRegister: (username: string, password: string, dob: string) => void;
  showLoginMessage?: boolean;
}

export function LoginRegisterForm({
  onLogin,
  onRegister,
  showLoginMessage = false,
}: LoginRegisterFormProps) {
  const [authMode, setAuthMode] = useState<'login' | 'register'>(
    showLoginMessage ? 'login' : 'login'
  );
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [dob, setDob] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (authMode === 'login' || showLoginMessage) {
      onLogin(username, password);
    } else {
      onRegister(username, password, dob);
    }
  };

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader className="px-4 sm:px-6">
        {showLoginMessage && (
          <div className="bg-green-900/20 border border-green-700 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-green-300 text-sm font-medium">
                Account Setup Complete!
              </span>
            </div>
            <p className="text-green-200 text-xs">
              Your Telegram account has been linked successfully. Please login
              to access your dashboard.
            </p>
          </div>
        )}

        {!showLoginMessage && (
          <div className="flex justify-center mb-4">
            <div className="flex bg-gray-800 rounded-lg p-1">
              <Button
                variant={authMode === 'login' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setAuthMode('login')}
                className={`text-xs sm:text-sm ${
                  authMode === 'login'
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'hover:bg-gray-700'
                }`}
              >
                Login
              </Button>
              <Button
                variant={authMode === 'register' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setAuthMode('register')}
                className={`text-xs sm:text-sm ${
                  authMode === 'register'
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'hover:bg-gray-700'
                }`}
              >
                Register
              </Button>
            </div>
          </div>
        )}

        <CardTitle className="text-center text-gray-100 text-lg sm:text-xl">
          {showLoginMessage
            ? 'Login to Continue'
            : authMode === 'login'
            ? 'Welcome Back'
            : 'Create Account'}
        </CardTitle>
        <CardDescription className="text-center text-gray-400 text-sm">
          {showLoginMessage
            ? 'Use your credentials to access your account'
            : authMode === 'login'
            ? 'Enter your credentials to access your account'
            : 'Fill in your details to create a new account'}
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4 sm:px-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-gray-200 text-sm">
              Username
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="johndoe"
                className="pl-10 bg-gray-800 border-gray-700 text-gray-100 focus:border-blue-500"
                required
              />
            </div>
          </div>

          {authMode === 'register' && !showLoginMessage && (
            <div className="space-y-2">
              <Label htmlFor="dob" className="text-gray-200 text-sm">
                Date of Birth
              </Label>
              <Input
                id="dob"
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="bg-gray-800 border-gray-700 text-gray-100 focus:border-blue-500"
                required
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-200 text-sm">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="pl-10 bg-gray-800 border-gray-700 text-gray-100 focus:border-blue-500"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            {showLoginMessage
              ? 'Login'
              : authMode === 'login'
              ? 'Sign In'
              : 'Create Account'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
