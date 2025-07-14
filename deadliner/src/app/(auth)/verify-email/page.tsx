'use client';

import { useEffect } from 'react';
import { useAuth } from 'react-oidc-context';
import { useRouter } from 'next/navigation';

export default function VerifyEmailPage() {
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If already authenticated, redirect to dashboard
    if (auth.isAuthenticated) {
      router.push('/dashboard');
      return;
    }

    // Redirect to Cognito hosted UI
    auth.signinRedirect();
  }, [auth, router]);

  return (
    <div className="container relative flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center">
      <div className="text-center">
        <p className="text-lg">Redirecting to verification...</p>
      </div>
    </div>
  );
} 