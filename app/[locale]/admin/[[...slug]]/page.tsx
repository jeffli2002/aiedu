import { redirect } from 'next/navigation';

interface AdminLocaleRedirectPageProps {
  params: {
    slug?: string[];
  };
}

export default function AdminLocaleRedirectPage({
  params,
}: AdminLocaleRedirectPageProps) {
  const slug = params.slug ?? [];
  if (slug.length === 0) {
    redirect('/admin/dashboard');
  }
  redirect(`/admin/${slug.join('/')}`);
}
