import { redirect } from 'next/navigation';

// Signup redirects to signin - keep routing simple
export default function SignupPage() {
  redirect('/signin');
}
