import { redirect } from 'next/navigation';

const buildQueryString = (
  searchParams?: Record<string, string | string[] | undefined>
) => {
  if (!searchParams) return '';
  const params = new URLSearchParams();
  Object.entries(searchParams).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((entry) => {
        if (entry !== undefined) params.append(key, entry);
      });
      return;
    }
    if (value !== undefined) {
      params.set(key, value);
    }
  });
  const query = params.toString();
  return query ? `?${query}` : '';
};

// Redirect to locale-aware signup page
// The middleware will handle locale detection and redirect appropriately
export default function SignupRedirectPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const query = buildQueryString(searchParams);
  redirect(`/zh/signup${query}`);
}
