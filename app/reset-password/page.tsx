import { redirect } from 'next/navigation';

// Redirect to locale-aware reset-password page
// The middleware will handle locale detection and redirect appropriately
export default function ResetPasswordPage() {
  redirect('/zh/reset-password');
}
