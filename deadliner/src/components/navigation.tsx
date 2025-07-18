'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { MoonIcon, SunIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { useAuth } from 'react-oidc-context';
import { deleteCookie } from '@/lib/utils';

export function Navigation() {
  const auth = useAuth();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSignOut = useCallback(async () => {
    try {
      // Clear auth cookies before signing out
      deleteCookie('access_token');
      deleteCookie('id_token');
      
      // Use the proper OIDC signout method
      await auth.signoutRedirect({
        post_logout_redirect_uri: window.location.origin
      });
    } catch (error) {
      console.error('Error during sign out:', error);
    }
  }, [auth]);

  const handleSignIn = useCallback(() => {
    auth.signinRedirect();
  }, [auth]);

  if (!mounted) {
    return null;
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 border-b bg-background/80 backdrop-blur-sm z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            DeadlineRx
          </Link>

          <nav className="flex items-center space-x-4">
            {auth.isAuthenticated ? (
              <>
                <Link 
                  href="/dashboard"
                  className="px-4 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleSignOut}
                  className="px-4 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleSignIn}
                  className="px-4 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={handleSignIn}
                  className="px-4 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  Register
                </button>
              </>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="ml-2"
            >
              {theme === 'dark' ? (
                <SunIcon className="h-5 w-5" />
              ) : (
                <MoonIcon className="h-5 w-5" />
              )}
              <span className="sr-only">Toggle theme</span>
            </Button>
          </nav>
        </div>
      </header>
      {/* Add spacing below fixed header */}
      <div className="h-16" />
    </>
  );
} 