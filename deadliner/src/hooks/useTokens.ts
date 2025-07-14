import { useEffect } from 'react';
import { useAuth } from 'react-oidc-context';
import { setCookie, deleteCookie } from '@/lib/utils';

export function useTokens() {
  const auth = useAuth();

  useEffect(() => {
    if (auth.user?.access_token) {
      // Store tokens in cookies when user is loaded
      setCookie('access_token', auth.user.access_token);
      setCookie('id_token', auth.user.id_token!);
    } else {
      // Clear tokens when user is not available
      deleteCookie('access_token');
      deleteCookie('id_token');
    }
  }, [auth.user]);

  return {
    accessToken: auth.user?.access_token,
    idToken: auth.user?.id_token,
    isAuthenticated: auth.isAuthenticated,
    isLoading: auth.isLoading,
    error: auth.error
  };
} 