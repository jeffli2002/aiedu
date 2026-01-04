import { redirect } from 'next/navigation';

// Redirect to locale-aware signup page
// The middleware will handle locale detection and redirect appropriately
export default function SignupRedirectPage() {
  redirect('/zh/signup');
}

