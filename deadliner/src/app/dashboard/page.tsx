'use client';

import { useAuth } from 'react-oidc-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTokens } from '@/hooks/useTokens';

export default function DashboardPage() {
  const { isAuthenticated, isLoading, error, accessToken, idToken } = useTokens();
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

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Authentication Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Access Token</p>
              <p className="text-xs font-mono bg-muted p-2 rounded-md overflow-x-auto">
                {accessToken}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">ID Token</p>
              <p className="text-xs font-mono bg-muted p-2 rounded-md overflow-x-auto">
                {idToken}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 