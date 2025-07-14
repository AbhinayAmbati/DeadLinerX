'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useTokens } from '@/hooks/useTokens';

export default function Home() {
  const { isAuthenticated, isLoading } = useTokens();

  return (
    <div className="min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
        Set it. Forget it.{' '}
        <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Get reminded.
        </span>{' '}
        ⏰
      </h1>
      <p className="mt-6 text-xl text-muted-foreground max-w-2xl">
        Never miss a deadline again. DeadlineRx sends you smart reminders 24 hours
        before your tasks are due, so you can stay focused on what matters.
      </p>
      <div className="mt-10 flex gap-4">
        {!isLoading && !isAuthenticated ? (
          <>
            <Link href="/register">
              <Button size="lg">Get Started</Button>
            </Link>
            <Link href="/signin">
              <Button variant="outline" size="lg">
                Sign In
              </Button>
            </Link>
          </>
        ) : isAuthenticated ? (
          <Link href="/dashboard">
            <Button size="lg">Go to Dashboard</Button>
          </Link>
        ) : null}
      </div>
    </div>
  );
}
