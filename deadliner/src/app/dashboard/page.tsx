'use client';

import { useAuth } from 'react-oidc-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Toaster } from 'sonner';
import { TaskForm } from '@/components/tasks/TaskForm';
import { TaskList } from '@/components/tasks/TaskList';
import { useTokens } from '@/hooks/useTokens';

interface IdTokenClaims {
  email: string;
  sub: string;
  [key: string]: any;
}

export default function DashboardPage() {
  const { isAuthenticated, isLoading, error, idToken } = useTokens();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      router.push('/');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[calc(100vh-8rem)]">
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[calc(100vh-8rem)]">
          <p className="text-lg text-red-500">Error: {error.message}</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !idToken) {
    return null;
  }

  const claims = idToken as unknown as IdTokenClaims;
  const userEmail = claims.email;

  return (
    <div className="container mx-auto px-4 py-8">
      <Toaster position="top-right" />
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Welcome, {userEmail}!</h1>
        <p className="text-gray-600 mt-2">
          Manage your tasks and deadlines below.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <TaskForm />
        </div>
        <div>
          <TaskList />
        </div>
      </div>
    </div>
  );
} 