import { redirect } from 'next/navigation';

// Redirect to locale-aware signin page
// The middleware will handle locale detection and redirect appropriately
export default function SigninPage() {
  redirect('/zh/signin');
}
