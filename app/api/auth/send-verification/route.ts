import { NextRequest, NextResponse } from 'next/server';
import { sendVerificationEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const { email, confirmationUrl } = await request.json();

    if (!email || !confirmationUrl) {
      return NextResponse.json(
        { error: 'Email and confirmationUrl are required' },
        { status: 400 }
      );
    }

    await sendVerificationEmail(email, confirmationUrl);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending verification email:', error);
    return NextResponse.json(
      { error: 'Failed to send verification email' },
      { status: 500 }
    );
  }
}
