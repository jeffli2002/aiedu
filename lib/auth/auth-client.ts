import { env } from '@/env';
import { adminClient } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';

// Use dynamic baseURL to support both www and non-www subdomains
// In production, this will match the current origin
// In development, falls back to env variable
const getBaseURL = () => {
  if (typeof window !== 'undefined') {
    // Client-side: use current origin to avoid CORS issues with subdomains
    const origin = window.location.origin;
    console.log('[Auth Client] Using baseURL:', origin);
    return origin;
  }
  // Server-side: use environment variable
  const baseURL = env.NEXT_PUBLIC_APP_URL;
  console.log('[Auth Client] Using baseURL from env:', baseURL);
  return baseURL;
};

export const authClient = createAuthClient({
  baseURL: getBaseURL(),
  plugins: [adminClient()],
});
