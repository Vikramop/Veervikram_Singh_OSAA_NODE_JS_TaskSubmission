'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, User, Settings, MessageCircle } from 'lucide-react';

interface SecurityPanelProps {
  isAdmin?: boolean;
}

export function SecurityPanel({ isAdmin = false }: SecurityPanelProps) {
  const containerClass = isAdmin
    ? 'space-y-4 sm:space-y-6'
    : 'grid grid-cols-1 sm:grid-cols-2 gap-4';

  const wrapperClass = isAdmin ? '' : 'flex justify-center ';

  return (
    <div className={wrapperClass}>
      <div className={containerClass}>
        {/* Security Status Card */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="pb-4">
            <CardTitle className="text-gray-100 flex items-center gap-2 text-lg">
              <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
              Security Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Two-Factor Auth</span>
                <Badge className="bg-green-600 text-white text-xs">
                  Enabled
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Telegram Linked</span>
                <Badge className="bg-green-600 text-white text-xs">
                  Active
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Last Login</span>
                <span className="text-sm text-gray-400">Just now</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Session Status</span>
                <Badge className="bg-blue-600 text-white text-xs">Active</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Account Status</span>
                <Badge className="bg-green-600 text-white text-xs">
                  Verified
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions Card */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="pb-4">
            <CardTitle className="text-gray-100 flex items-center gap-2 text-lg">
              <User className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 sm:space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start border-gray-700 text-gray-300 hover:bg-gray-800 bg-transparent text-sm"
              >
                <Settings className="w-4 h-4 mr-2" />
                Account Settings
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start border-gray-700 text-gray-300 hover:bg-gray-800 bg-transparent text-sm"
              >
                <Shield className="w-4 h-4 mr-2" />
                Security Settings
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start border-gray-700 text-gray-300 hover:bg-gray-800 bg-transparent text-sm"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Telegram Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
