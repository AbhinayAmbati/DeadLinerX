'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { signIn, signUp, signOut, getCurrentUser, confirmSignUp } from 'aws-amplify/auth';
import { configureAmplify } from '../aws-config';
import { Amplify } from 'aws-amplify';

// Configure Amplify on the client side
if (typeof window !== 'undefined') {
  Amplify.configure(configureAmplify(), { ssr: true });
}

interface User {
  email: string;
  isVerified: boolean;
}

interface AuthContextType {
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  verifyEmail: (code: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const cognitoUser = await getCurrentUser();
      setUser({
        email: cognitoUser.username,
        isVerified: true, // In Cognito, if we can get the user, they're verified
      });
    } catch (error) {
      setUser(null);
    }
  };

  const handleSignIn = async (email: string, password: string) => {
    try {
      await signIn({ username: email, password });
      await checkAuth();
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  };

  const handleSignUp = async (email: string, password: string) => {
    try {
      await signUp({
        username: email,
        password,
        options: {
          userAttributes: {
            email,
          },
        },
      });
      setUser({ email, isVerified: false });
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  };

  const handleVerifyEmail = async (code: string) => {
    if (!user) throw new Error('No user to verify');
    try {
      await confirmSignUp({
        username: user.email,
        confirmationCode: code
      });
      setUser({ ...user, isVerified: true });
    } catch (error) {
      console.error('Error verifying email:', error);
      throw error;
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        signIn: handleSignIn, 
        signUp: handleSignUp, 
        signOut: handleSignOut, 
        verifyEmail: handleVerifyEmail 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 