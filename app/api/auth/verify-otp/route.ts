import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db';
import { verification, user, account } from '@/server/db/schema';
import { eq, and, gt } from 'drizzle-orm';
import { randomUUID } from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, otp } = body;

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    if (!otp || typeof otp !== 'string' || otp.length !== 6) {
      return NextResponse.json(
        { error: 'Invalid OTP format' },
        { status: 400 }
      );
    }

    // Find user by email
    const [foundUser] = await db
      .select()
      .from(user)
      .where(eq(user.email, email.toLowerCase()))
      .limit(1);

    if (!foundUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Verify OTP
    const identifier = `otp:${email.toLowerCase()}`;
    const [otpRecord] = await db
      .select()
      .from(verification)
      .where(
        and(
          eq(verification.identifier, identifier),
          eq(verification.value, otp),
          gt(verification.expiresAt, new Date())
        )
      )
      .orderBy(verification.createdAt)
      .limit(1);

    if (!otpRecord) {
      return NextResponse.json(
        { error: 'Invalid or expired OTP' },
        { status: 400 }
      );
    }

    // Verify email - use type assertion to work around Drizzle type inference issue
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await db
      .update(user)
      .set({
        emailVerified: true,
      } as any)
      .where(eq(user.id, foundUser.id));

    // Fetch updated user
    const [updatedUser] = await db
      .select()
      .from(user)
      .where(eq(user.id, foundUser.id))
      .limit(1);

    // Delete used OTP
    await db
      .delete(verification)
      .where(eq(verification.id, otpRecord.id));

    // Trigger afterEmailVerification flow manually to grant credits and send welcome email
    try {
      const { creditService } = await import('@/lib/credits');
      const { sendWelcomeEmail } = await import('@/lib/email');
      const { paymentConfig } = await import('@/config/payment.config');
      const { creditTransactions } = await import('@/server/db/schema');

      const freePlan = paymentConfig.plans.find((plan) => plan.id === 'free');
      const signupCredits = freePlan?.credits?.onSignup ?? 0;

      if (signupCredits && signupCredits > 0) {
        const signupReferenceId = `signup_${updatedUser.id}`;
        const [existingSignupTx] = await db
          .select({ id: creditTransactions.id })
          .from(creditTransactions)
          .where(eq(creditTransactions.referenceId, signupReferenceId))
          .limit(1);

        if (!existingSignupTx) {
          await creditService.getOrCreateCreditAccount(updatedUser.id);
          await creditService.earnCredits({
            userId: updatedUser.id,
            amount: signupCredits,
            source: 'bonus',
            description: 'Welcome bonus - thank you for signing up!',
            referenceId: signupReferenceId,
          });
        }
      }

      // Send welcome email
      await sendWelcomeEmail(updatedUser.email, updatedUser.name || 'User');
    } catch (error) {
      console.error('[OTP] Error granting signup credits:', error);
      // Don't fail the verification if credits/welcome email fails
    }

    // Get user's password from account table to create session
    const [userAccount] = await db
      .select({ password: account.password })
      .from(account)
      .where(
        and(
          eq(account.userId, updatedUser.id),
          eq(account.providerId, 'credential')
        )
      )
      .limit(1);

    if (!userAccount?.password) {
      return NextResponse.json(
        { error: 'User account not found or password not set' },
        { status: 400 }
      );
    }

    // Create a temporary session token that allows passwordless login
    // This token will be used by the client to automatically sign in
    const sessionToken = randomUUID();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await db.insert(verification).overridingSystemValue().values({
      id: randomUUID(),
      identifier: `otp-session:${updatedUser.id}`,
      value: sessionToken,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
    } as any);

    // Return session token for client to use for auto-login
    // Client will call a special API endpoint with this token to create session
    return NextResponse.json({
      success: true,
      message: 'Email verified successfully',
      sessionToken, // Temporary token for passwordless login (5 min expiry)
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        emailVerified: true,
      },
    });
  } catch (error) {
    console.error('[OTP] Error verifying OTP:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

