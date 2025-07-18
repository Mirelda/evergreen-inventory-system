import { NextResponse } from 'next/server';
import db from '@/lib/db';
import jwt from 'jsonwebtoken';
import { sendPasswordResetEmail } from '@/lib/email';

export async function POST(request) {
  try {
    const { email } = await request.json();

    // 1. Find user by email
    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      // It's good practice not to reveal if an email exists or not
      return NextResponse.json({ message: 'If your email is in our system, you will receive a password reset link.' }, { status: 200 });
    }

    // 2. Generate a short-lived JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '15m' } // Token expires in 15 minutes
    );

    // 3. Create reset link and send email
    const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${token}`;
    
    await sendPasswordResetEmail(user.email, user.name, resetLink);

    return NextResponse.json({ message: 'Password reset link sent successfully.' }, { status: 200 });

  } catch (error) {
    console.error('Forgot Password Error:', error);
    return NextResponse.json({ message: 'An internal server error occurred.' }, { status: 500 });
  }
} 