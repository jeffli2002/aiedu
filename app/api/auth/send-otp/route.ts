import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { db } from '@/server/db';
import { verification } from '@/server/db/schema';
import { eq, and, gt } from 'drizzle-orm';
import { randomUUID } from 'crypto';
import { sendEmail } from '@/lib/email';

const OTP_EXPIRES_IN_MS = 10 * 60 * 1000; // 10 minutes
const OTP_COOLDOWN_MS = 60 * 1000; // 1 minute between resends

/**
 * Generate a random 6-digit OTP
 */
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Send OTP email
 */
async function sendOTPEmail(email: string, userName: string, otp: string) {
  const APP_NAME = 'Future AI Creators';
  const APP_URL = process.env.NEXT_PUBLIC_APP_URL?.startsWith('https://www.futurai.org') 
    ? process.env.NEXT_PUBLIC_APP_URL 
    : 'https://www.futurai.org';

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${APP_NAME} - Verification Code</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 40px 20px; text-align: center; background-color: #ffffff;">
        <table role="presentation" style="max-width: 600px; margin: 0 auto; border-collapse: collapse;">
          <!-- Header -->
          <tr>
            <td style="padding: 20px 0; text-align: center; border-bottom: 2px solid #8b5cf6;">
              <h1 style="margin: 0; background: linear-gradient(to right, #8b5cf6, #3b82f6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; font-size: 28px; font-weight: 600;">${APP_NAME}</h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 20px; color: #333333; line-height: 1.6;">
              <h2 style="color: #111827; margin: 0 0 20px 0; font-size: 24px;">Check your email to continue</h2>
              
              <p style="margin: 0 0 20px 0; color: #374151;">
                Hi ${userName || 'there'},
              </p>
              
              <p style="margin: 0 0 20px 0; color: #374151;">
                We've sent a one-time password to your email. Please check your inbox at <strong>${email}</strong>.
              </p>
              
              <div style="background-color: #f0f9ff; border: 2px solid #8b5cf6; border-radius: 8px; padding: 30px; margin: 30px 0; text-align: center;">
                <p style="margin: 0 0 10px 0; color: #6b21a8; font-weight: 600; font-size: 14px; text-transform: uppercase; letter-spacing: 2px;">
                  Your Verification Code
                </p>
                <p style="margin: 0; color: #7c3aed; font-size: 36px; font-weight: 700; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                  ${otp}
                </p>
                <p style="margin: 15px 0 0 0; color: #6b7280; font-size: 12px;">
                  This code will expire in 10 minutes
                </p>
              </div>
              
              <p style="margin: 20px 0 0 0; color: #6b7280; font-size: 14px;">
                If you didn't request this code, you can safely ignore this email.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 20px; text-align: center; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
              <p style="margin: 0 0 10px 0;">
                Need help? Contact us at <a href="mailto:support@futurai.org" style="color: #8b5cf6; text-decoration: none;">support@futurai.org</a>
              </p>
              <p style="margin: 0;">
                © ${new Date().getFullYear()} ${APP_NAME}. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  return sendEmail({
    to: email,
    subject: 'Your verification code',
    html,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Check if user exists
    const session = await auth.api.getSession({ headers: request.headers });
    let user = null;
    
    if (session?.user) {
      user = session.user;
    } else {
      // Try to find user by email (for signup flow)
      const { user: userTable } = await import('@/server/db/schema');
      const [foundUser] = await db
        .select()
        .from(userTable)
        .where(eq(userTable.email, email.toLowerCase()))
        .limit(1);
      
      if (foundUser) {
        user = foundUser;
      }
    }

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check cooldown
    const identifier = `otp:${email.toLowerCase()}`;
    const [recentEntry] = await db
      .select({ createdAt: verification.createdAt })
      .from(verification)
      .where(eq(verification.identifier, identifier))
      .orderBy(verification.createdAt)
      .limit(1);

    if (recentEntry?.createdAt) {
      const createdAtDate = new Date(recentEntry.createdAt);
      const elapsedMs = Date.now() - createdAtDate.getTime();
      if (elapsedMs < OTP_COOLDOWN_MS) {
        const remainingSeconds = Math.ceil((OTP_COOLDOWN_MS - elapsedMs) / 1000);
        return NextResponse.json(
          { error: `Please wait ${remainingSeconds} seconds before requesting a new code` },
          { status: 429 }
        );
      }
    }

    // Generate OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + OTP_EXPIRES_IN_MS);

    // Store OTP in database
    await db.insert(verification).values({
      id: randomUUID(),
      identifier,
      value: otp,
      expiresAt,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Send OTP email
    const sent = await sendOTPEmail(email, user.name || 'User', otp);
    
    if (!sent) {
      return NextResponse.json(
        { error: 'Failed to send OTP email' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'OTP sent successfully',
    });
  } catch (error) {
    console.error('[OTP] Error sending OTP:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

