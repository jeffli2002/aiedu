import { auth } from '@/lib/auth/auth';
import { isCreemConfigured } from '@/lib/creem/creem-config';
import { creemService } from '@/lib/creem/creem-service';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const subscriptionSchema = z.object({
  priceId: z.string().min(1),
  trialPeriodDays: z.number().optional(),
  metadata: z.record(z.string()).optional(),
});

export async function POST(request: Request) {
  try {
    if (!isCreemConfigured) {
      return NextResponse.json({ error: 'Creem is not configured' }, { status: 503 });
    }

    const headersList = await headers();
    const session = await auth.api.getSession({
      headers: Object.fromEntries(headersList.entries()),
    });

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = subscriptionSchema.parse(body);

    // Note: Subscriptions are created via checkout sessions, not directly
    // This endpoint should redirect to checkout or return an error
    return NextResponse.json(
      { error: 'Subscriptions must be created via checkout session. Use /api/creem/checkout instead.' },
      { status: 400 }
    );
  } catch (error) {
    console.error('[Creem Subscription Create] Error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json({ error: 'Failed to create subscription' }, { status: 500 });
  }
}
