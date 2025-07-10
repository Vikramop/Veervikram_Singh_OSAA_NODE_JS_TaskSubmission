'use client';

import { useEffect, useState } from 'react';
import { getUsers, updateUserRole, setBanStatus } from '@/lib/api/admin';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';

interface User {
  _id: string;
  username: string;
  role: string;
  isBanned: boolean;
}

export function AdminPanel({ token }: { token: string }) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const data = await getUsers(token);
      setUsers(data);
    } catch (err: any) {
      toast({ title: 'Failed to fetch users', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, role: string) => {
    try {
      await updateUserRole(userId, role, token);
      fetchUsers(); // refresh
      toast({ title: `Role updated to ${role}` });
    } catch {
      toast({ title: 'Error updating role', variant: 'destructive' });
    }
  };

  const handleBanToggle = async (userId: string, ban: boolean) => {
    try {
      await setBanStatus(userId, ban, token);
      fetchUsers(); // refresh
      toast({ title: ban ? 'User banned' : 'User unbanned' });
    } catch {
      toast({ title: 'Error updating ban status', variant: 'destructive' });
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return <p className="text-gray-400">Loading users...</p>;

  return (
    <div className="space-y-4">
      {users.map((user) => (
        <div
          key={user._id}
          className="bg-gray-800 p-4 rounded-lg flex justify-between items-center"
        >
          <div>
            <p className="text-gray-100 font-medium">{user.username}</p>
            <p className="text-gray-400 text-sm">Role: {user.role}</p>
            <p className="text-gray-400 text-sm">
              Status: {user.isBanned ? '🚫 Banned' : '✅ Active'}
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() =>
                handleRoleChange(
                  user._id,
                  user.role === 'admin' ? 'user' : 'admin'
                )
              }
              variant="secondary"
            >
              {user.role === 'admin' ? 'Demote' : 'Promote'}
            </Button>
            <Button
              onClick={() => handleBanToggle(user._id, !user.isBanned)}
              variant={user.isBanned ? 'default' : 'destructive'}
            >
              {user.isBanned ? 'Unban' : 'Ban'}
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
