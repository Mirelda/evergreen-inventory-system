import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get query parameters for filtering
    const { searchParams } = new URL(request.url);
    const userFilter = searchParams.get('user');
    const timeFilter = searchParams.get('timeRange') || '7'; // days
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 20;

    // Calculate time range
    const daysAgo = parseInt(timeFilter);
    const timeRangeStart = new Date();
    timeRangeStart.setDate(timeRangeStart.getDate() - daysAgo);

    // Build where clause
    const where = {
      timestamp: {
        gte: timeRangeStart
      }
    };

    // Filter by user if specified
    if (userFilter && userFilter !== 'all') {
      where.userId = userFilter;
    }

    // Filter to show only user-related activities
    where.category = {
      in: ['USER', 'AUTHENTICATION', 'ITEM', 'SALES', 'INVENTORY']
    };

    // Get total count for pagination
    const totalCount = await db.activityLog.count({ where });

    // Get user activities with pagination
    const activities = await db.activityLog.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        }
      },
      orderBy: {
        timestamp: 'desc'
      },
      skip: (page - 1) * limit,
      take: limit
    });

    // Get user statistics for the current time period
    const [
      totalActivities,
      uniqueUsers,
      authenticationCount,
      itemActivities,
      salesActivities,
      inventoryActivities
    ] = await Promise.all([
      db.activityLog.count({ 
        where: {
          timestamp: { gte: timeRangeStart }
        }
      }),
      db.activityLog.groupBy({
        by: ['userId'],
        where: {
          timestamp: { gte: timeRangeStart },
          userId: { not: null }
        },
        _count: true
      }),
      db.activityLog.count({
        where: {
          category: 'AUTHENTICATION',
          timestamp: { gte: timeRangeStart }
        }
      }),
      db.activityLog.count({
        where: {
          category: 'ITEM',
          timestamp: { gte: timeRangeStart }
        }
      }),
      db.activityLog.count({
        where: {
          category: 'SALES',
          timestamp: { gte: timeRangeStart }
        }
      }),
      db.activityLog.count({
        where: {
          category: 'INVENTORY',
          timestamp: { gte: timeRangeStart }
        }
      })
    ]);

    // Get all users for filter dropdown
    const allUsers = await db.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true
      },
      orderBy: {
        name: 'asc'
      }
    });

    // Activity by hour for chart (last 24 hours)
    const last24Hours = new Date();
    last24Hours.setHours(last24Hours.getHours() - 24);
    
    const hourlyActivities = await db.activityLog.groupBy({
      by: ['timestamp'],
      where: {
        timestamp: { gte: last24Hours }
      },
      _count: true
    });

    // Process hourly data for chart
    const hourlyChart = [];
    for (let i = 23; i >= 0; i--) {
      const hour = new Date();
      hour.setHours(hour.getHours() - i, 0, 0, 0);
      const nextHour = new Date(hour);
      nextHour.setHours(nextHour.getHours() + 1);
      
      const count = await db.activityLog.count({
        where: {
          timestamp: {
            gte: hour,
            lt: nextHour
          }
        }
      });

      hourlyChart.push({
        hour: hour.getHours(),
        count,
        label: `${hour.getHours()}:00`
      });
    }

    // Top active users
    const topUsers = await db.activityLog.groupBy({
      by: ['userId'],
      where: {
        timestamp: { gte: timeRangeStart },
        userId: { not: null }
      },
      _count: {
        _all: true
      },
      orderBy: {
        _count: {
          _all: 'desc'
        }
      },
      take: 5
    });

    // Get user details for top users
    const topUsersWithDetails = await Promise.all(
      topUsers.map(async (userStat) => {
        const user = await db.user.findUnique({
          where: { id: userStat.userId },
          select: { name: true, email: true, role: true }
        });
        return {
          ...user,
          activityCount: userStat._count._all
        };
      })
    );

    const stats = {
      totalActivities,
      uniqueUsersCount: uniqueUsers.length,
      authenticationCount,
      itemActivities,
      salesActivities,
      inventoryActivities,
      timeRange: `Last ${daysAgo} days`
    };

    // Format activities for frontend
    const formattedActivities = activities.map(activity => ({
      id: activity.id,
      timestamp: activity.timestamp,
      user: activity.user ? {
        name: activity.user.name,
        email: activity.user.email,
        role: activity.user.role
      } : null,
      category: activity.category,
      action: activity.action,
      message: activity.message,
      details: activity.details,
      level: activity.level,
      ip: activity.ip,
      userAgent: activity.userAgent
    }));

    return NextResponse.json({
      activities: formattedActivities,
      stats,
      users: allUsers,
      topUsers: topUsersWithDetails,
      hourlyChart,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit)
      }
    });

  } catch (error) {
    console.error("Error fetching user activities:", error);
    return NextResponse.json(
      { error: "Failed to fetch user activities" },
      { status: 500 }
    );
  }
} 