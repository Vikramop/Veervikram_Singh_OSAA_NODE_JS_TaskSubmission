'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, ExternalLink, Loader2 } from 'lucide-react';

interface TelegramLinkProps {
  onLink: () => void;
  isLinking: boolean;
}

export function TelegramLink({ onLink, isLinking }: TelegramLinkProps) {
  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader className="px-4 sm:px-6">
        <CardTitle className="text-center text-gray-100 flex items-center justify-center gap-2 text-lg sm:text-xl">
          <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
          Link Telegram Account
        </CardTitle>
        <CardDescription className="text-center text-gray-400 text-sm">
          Connect your Telegram account for secure OTP verification
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center space-y-4 sm:space-y-6 px-4 sm:px-6">
        <div className="bg-gray-800 rounded-lg p-4 sm:p-6">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          </div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-100 mb-2">
            Telegram Bot Integration
          </h3>
          <p className="text-gray-400 mb-4 text-sm">
            Click the button below to open our Telegram bot and link your
            account
          </p>
          <Badge
            variant="outline"
            className="border-blue-500 text-blue-400 text-xs"
          >
            @SecureAuthBot
          </Badge>
        </div>

        <Button
          onClick={onLink}
          className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
          size="lg"
          disabled={isLinking}
        >
          {isLinking ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Linking Account...
            </>
          ) : (
            <>
              <ExternalLink className="w-4 h-4 mr-2" />
              Link Telegram Account
            </>
          )}
        </Button>

        <p className="text-xs sm:text-sm text-gray-500">
          This will open Telegram in a new window
        </p>
      </CardContent>
    </Card>
  );
}
