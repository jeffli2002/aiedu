'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function EmailVerifiedPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-white p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Email verified</CardTitle>
            <CardDescription>Your email is confirmed. You can sign in now.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button type="button" className="w-full btn-primary" onClick={() => router.replace('/signin')}>
              Go to sign in
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
