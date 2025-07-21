import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const activeUsers = await prisma.user.count({
      where: {
        status: 'ACTIVE',
      },
    });

    return NextResponse.json({
      activeUsers,
      systemStatus: 'Online',
    });

  } catch (error) {
    console.error('Error fetching system stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch system stats.' },
      { status: 500 }
    );
  }
} 