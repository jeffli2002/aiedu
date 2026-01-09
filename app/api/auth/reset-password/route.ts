import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, newPassword } = body;

    if (!token) {
      return NextResponse.json(
        { error: 'Reset token is required' },
        { status: 400 }
      );
    }

    if (!newPassword) {
      return NextResponse.json(
        { error: 'New password is required' },
        { status: 400 }
      );
    }

    // Proxy to better-auth's reset-password endpoint
    const internalRequest = new Request(
      `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3003'}/api/auth/reset-password/${token}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          newPassword,
        }),
      }
    );

    const response = await fetch(internalRequest);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData?.error || 'Unable to reset password. The link may be expired or invalid.' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Password updated successfully. You can now sign in with your new password.',
    });
  } catch (error) {
    console.error('[reset-password] Error:', error);
    return NextResponse.json(
      { error: 'Unable to reset password. The link may be expired or invalid.' },
      { status: 400 }
    );
  }
}
