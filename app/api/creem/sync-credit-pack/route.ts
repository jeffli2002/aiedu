import { getSessionFromRequest } from '@/lib/auth/auth-utils';
import { creemService } from '@/lib/creem/creem-service';
import { handleCreditPackPurchase } from '@/app/api/webhooks/creem/route';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const session = await getSessionFromRequest(request.headers);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const { checkoutId } = body as { checkoutId?: string };

    if (!checkoutId) {
      return NextResponse.json({ error: 'Missing checkoutId' }, { status: 400 });
    }

    const checkoutResult = await creemService.getCheckout(checkoutId);
    if (!checkoutResult.success || !checkoutResult.checkout) {
      return NextResponse.json(
        { error: checkoutResult.error || 'Failed to fetch checkout' },
        { status: 400 }
      );
    }

    const checkout = checkoutResult.checkout as {
      status?: string;
      id?: string;
    };

    if (checkout.status && checkout.status !== 'completed') {
      return NextResponse.json(
        { error: 'Checkout is not completed yet' },
        { status: 409 }
      );
    }

    const rawResult = await creemService.handleWebhookEvent({
      type: 'checkout.completed',
      data: { object: checkout },
    });

    if (!rawResult || typeof rawResult !== 'object' || !('type' in rawResult)) {
      return NextResponse.json({ error: 'Unable to parse checkout payload' }, { status: 400 });
    }

    if ((rawResult as { type?: string }).type !== 'credit_pack_purchase') {
      return NextResponse.json(
        { error: 'Checkout does not match a credit pack purchase' },
        { status: 400 }
      );
    }

    const userId = (rawResult as { userId?: string }).userId;
    if (!userId) {
      return NextResponse.json({ error: 'Missing userId for credit pack' }, { status: 400 });
    }

    if (userId !== session.user.id) {
      return NextResponse.json({ error: 'Checkout user mismatch' }, { status: 403 });
    }

    const payload = rawResult as Parameters<typeof handleCreditPackPurchase>[0];

    await handleCreditPackPurchase({
      ...payload,
      planId: typeof payload.planId === 'string' ? payload.planId : undefined,
      eventId: `sync_${checkoutId}`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Creem Sync Credit Pack] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to sync credit pack' },
      { status: 500 }
    );
  }
}
