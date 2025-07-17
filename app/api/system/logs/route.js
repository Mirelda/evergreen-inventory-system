import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(request) {
  try {
    // Get query parameters for filtering
    const { searchParams } = new URL(request.url);
    const level = searchParams.get('level');
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;

    // Build where clause for filtering
    const where = {};
    
    if (level && level !== 'all') {
      where.level = level;
    }
    
    if (category && category !== 'all') {
      where.category = category;
    }
    
    if (search) {
      where.OR = [
        { message: { contains: search, mode: 'insensitive' } },
        { details: { contains: search, mode: 'insensitive' } },
        { action: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Get total count for pagination
    const totalCount = await db.activityLog.count({ where });

    // Get logs with pagination
    const logs = await db.activityLog.findMany({
      where,
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        timestamp: 'desc'
      },
      skip: (page - 1) * limit,
      take: limit
    });

    // Calculate statistics
    const [
      totalLogs,
      errorCount,
      warningCount,
      infoCount,
      categories,
      levels
    ] = await Promise.all([
      db.activityLog.count(),
      db.activityLog.count({ where: { level: 'ERROR' } }),
      db.activityLog.count({ where: { level: 'WARNING' } }),
      db.activityLog.count({ where: { level: 'INFO' } }),
      db.activityLog.groupBy({
        by: ['category'],
        _count: true
      }),
      db.activityLog.groupBy({
        by: ['level'],
        _count: true
      })
    ]);

    const stats = {
      total: totalLogs,
      filtered: totalCount,
      errors: errorCount,
      warnings: warningCount,
      info: infoCount,
      categories: categories.map(c => c.category),
      levels: levels.map(l => l.level)
    };

    // Format logs for frontend
    const formattedLogs = logs.map(log => ({
      id: log.id,
      timestamp: log.timestamp,
      level: log.level,
      category: log.category,
      action: log.action,
      message: log.message,
      details: log.details || '',
      user: log.user ? `${log.user.name} (${log.user.email})` : 'System',
      ip: log.ip || '127.0.0.1',
      userAgent: log.userAgent || 'System'
    }));

    return NextResponse.json({
      logs: formattedLogs,
      stats,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit)
      }
    });

  } catch (error) {
    console.error("Error fetching system logs:", error);
    return NextResponse.json(
      { error: "Failed to fetch system logs" },
      { status: 500 }
    );
  }
} 