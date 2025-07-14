'use client';

import { Navigation } from '@/components/navigation';
import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from 'react-oidc-context';
import { Toaster } from 'sonner';
import './globals.css';

const cognitoAuthConfig = {
  authority: `https://cognito-idp.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${process.env.NEXT_PUBLIC_AWS_USER_POOL_ID}`,
  client_id: process.env.NEXT_PUBLIC_AWS_CLIENT_ID!,
  redirect_uri: typeof window !== 'undefined' ? window.location.origin : '',
  response_type: 'code',
  scope: 'openid',
  loadUserInfo: true,
  onSigninCallback: () => {
    window.history.replaceState({}, document.title, window.location.pathname);
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider {...cognitoAuthConfig}>
            <Navigation />
            <main className="container mx-auto px-4 py-8">
              {children}
            </main>
            <Toaster position="bottom-right" />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
