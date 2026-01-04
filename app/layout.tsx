// Root layout that passes through to [locale] layout
// All pages are now under app/[locale]/ for proper i18n SEO
// The [locale]/layout.tsx provides <html> and <body> with correct lang attribute

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
