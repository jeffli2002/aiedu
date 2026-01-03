'use client';

import { redirect } from 'next/navigation';

export default function SignupRedirectPage() {
  // Keep routing simple: reuse the existing signin page
  redirect('/signin');
}

