'use client';

import { useAuth } from 'react-oidc-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DashboardPage() {
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!auth.isAuthenticated && !auth.isLoading) {
      router.push('/');
    }
  }, [auth.isAuthenticated, auth.isLoading, router]);

  if (auth.isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[calc(100vh-8rem)]">
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (auth.error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[calc(100vh-8rem)]">
          <p className="text-lg text-red-500">Error: {auth.error.message}</p>
        </div>
      </div>
    );
  }

  if (!auth.isAuthenticated) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>User Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="text-lg">{auth.user?.profile.email}</p>
            </div>
            {auth.user?.profile.name && (
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="text-lg">{auth.user.profile.name}</p>
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Authentication Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Access Token</p>
              <p className="text-xs font-mono bg-muted p-2 rounded-md overflow-x-auto">
                {auth.user?.access_token}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">ID Token</p>
              <p className="text-xs font-mono bg-muted p-2 rounded-md overflow-x-auto">
                {auth.user?.id_token}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 