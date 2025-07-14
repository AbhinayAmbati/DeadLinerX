import { type ResourcesConfig } from 'aws-amplify';
import { createServerRunner } from '@aws-amplify/adapter-nextjs';

const config: ResourcesConfig = {
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_AWS_USER_POOL_ID!,
      userPoolClientId: process.env.NEXT_PUBLIC_AWS_CLIENT_ID!,
      signUpVerificationMethod: 'code',
    }
  }
};

export const { runWithAmplifyServerContext, createAuthRouteHandlers } = createServerRunner({
  config,
  runtimeOptions: {
    cookies: {
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    }
  }
});

export function configureAmplify() {
  return config;
} 