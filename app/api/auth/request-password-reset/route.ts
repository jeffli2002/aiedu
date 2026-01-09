import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, redirectTo } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Use better-auth's requestPasswordReset method via the internal handler
    // The [...all] route will proxy this to better-auth
    const internalRequest = new Request(
      `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3003'}/api/auth/forget-password`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          redirectTo: redirectTo || `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`,
        }),
      }
    );

    await fetch(internalRequest);

    // Always return success to prevent email enumeration
    return NextResponse.json({
      success: true,
      message: 'If this email exists in our system, a password reset link has been sent.',
    });
  } catch (error) {
    console.error('[request-password-reset] Error:', error);
    // Always return success to prevent email enumeration
    return NextResponse.json({
      success: true,
      message: 'If this email exists in our system, a password reset link has been sent.',
    });
  }
}
