import { NextResponse } from 'next/server';
import db from '@/lib/db';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json({ message: 'Missing token or password.' }, { status: 400 });
    }

    // 1. Verify the JWT
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return NextResponse.json({ message: 'Invalid or expired token.' }, { status: 401 });
    }

    const { userId } = decoded;

    // 2. Find the user
    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ message: 'User not found.' }, { status: 404 });
    }

    // Check if the new password is the same as the old one
    const isSamePassword = await bcrypt.compare(password, user.password);
    if (isSamePassword) {
      return NextResponse.json({ message: 'New password cannot be the same as the old password.' }, { status: 400 });
    }

    // 3. Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Update the user's password and status in the database
    await db.user.update({
      where: { id: userId },
      data: { 
        password: hashedPassword,
        status: 'ACTIVE' // Reactivate the account
      },
    });

    return NextResponse.json({ message: 'Password has been reset successfully.' }, { status: 200 });

  } catch (error) {
    console.error('Reset Password Error:', error);
    return NextResponse.json({ message: 'An internal server error occurred.' }, { status: 500 });
  }
} 