import { NextResponse } from "next/server";
import db from "@/lib/db";
import { logDatabase, ActivityLevel } from "@/lib/activityLogger";
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

    // Get backup history from ActivityLog
    const backupLogs = await db.activityLog.findMany({
      where: {
        category: 'DATABASE',
        action: 'BACKUP'
      },
      orderBy: {
        timestamp: 'desc'
      },
      take: 20,
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });

    // Calculate database statistics
    const [
      totalItems,
      totalSales, 
      totalUsers,
      totalCategories,
      totalBrands,
      totalWarehouses
    ] = await Promise.all([
      db.item.count(),
      db.sale.count(),
      db.user.count(),
      db.category.count(),
      db.brand.count(),
      db.warehouse.count()
    ]);

    const stats = {
      totalRecords: totalItems + totalSales + totalUsers + totalCategories + totalBrands + totalWarehouses,
      collections: {
        items: totalItems,
        sales: totalSales,
        users: totalUsers,
        categories: totalCategories,
        brands: totalBrands,
        warehouses: totalWarehouses
      },
      lastBackup: backupLogs[0]?.timestamp || null,
      backupCount: backupLogs.length
    };

    return NextResponse.json({
      stats,
      backupHistory: backupLogs.map(log => ({
        id: log.id,
        timestamp: log.timestamp,
        status: log.level === 'INFO' ? 'success' : 'failed',
        size: log.details ? JSON.parse(log.details).size : 'Unknown',
        duration: log.details ? JSON.parse(log.details).duration : 'Unknown',
        user: log.user ? `${log.user.name} (${log.user.email})` : 'System',
        message: log.message
      }))
    });

  } catch (error) {
    console.error("Error fetching backup info:", error);
    return NextResponse.json(
      { error: "Failed to fetch backup information" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { action } = await request.json();

    if (action === 'create') {
      return await createBackup(session);
    } else if (action === 'restore') {
      return NextResponse.json(
        { 
          error: "Restore functionality is disabled for security reasons",
          message: "Contact system administrator for data restoration" 
        },
        { status: 403 }
      );
    } else {
      return NextResponse.json(
        { error: "Invalid action" },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error("Error processing backup request:", error);
    return NextResponse.json(
      { error: "Failed to process backup request" },
      { status: 500 }
    );
  }
}

async function createBackup(session) {
  const startTime = Date.now();
  
  try {
    // Log backup start
    await logDatabase(
      ActivityLevel.INFO,
      'BACKUP_START',
      'Database backup initiated',
      { userId: session.user.id, timestamp: new Date().toISOString() }
    );

    // Get all data from main collections
    const [
      items,
      sales,
      users,
      categories,
      brands,
      warehouses,
      adjustments
    ] = await Promise.all([
      db.item.findMany({ include: { category: true, brand: true, unit: true } }),
      db.sale.findMany({ include: { items: true } }),
      db.user.findMany({ select: { id: true, name: true, email: true, role: true, createdAt: true } }),
      db.category.findMany(),
      db.brand.findMany(),
      db.warehouse.findMany(),
      db.addStockAdjustment.findMany({ include: { item: true } })
    ]);

    const backupData = {
      timestamp: new Date().toISOString(),
      version: "1.0",
      data: {
        items,
        sales,
        users,
        categories,
        brands,
        warehouses,
        adjustments
      },
      metadata: {
        totalRecords: items.length + sales.length + users.length + categories.length + brands.length + warehouses.length + adjustments.length,
        createdBy: session.user.email,
        createdAt: new Date().toISOString()
      }
    };

    const duration = Date.now() - startTime;
    const sizeInBytes = JSON.stringify(backupData).length;
    const sizeInMB = (sizeInBytes / (1024 * 1024)).toFixed(2);

    // Log successful backup
    await logDatabase(
      ActivityLevel.INFO,
      'BACKUP',
      'Database backup completed successfully',
      {
        size: `${sizeInMB} MB`,
        duration: `${duration} ms`,
        records: backupData.metadata.totalRecords,
        userId: session.user.id
      }
    );

    // Return the backup data for download
    return NextResponse.json({
      success: true,
      message: "Backup created successfully",
      backup: {
        id: `backup_${Date.now()}`,
        timestamp: new Date().toISOString(),
        size: `${sizeInMB} MB`,
        duration: `${duration} ms`,
        records: backupData.metadata.totalRecords,
        filename: `backup_${new Date().toISOString().split('T')[0]}_${Date.now()}.json`
      },
      downloadData: backupData // Full backup data for download
    });

  } catch (error) {
    const duration = Date.now() - startTime;
    
    // Log failed backup
    await logDatabase(
      ActivityLevel.ERROR,
      'BACKUP',
      'Database backup failed',
      {
        error: error.message,
        duration: `${duration} ms`,
        userId: session.user.id
      }
    );

    throw error;
  }
}

async function restoreBackup(session) {
  try {
    // Log restore attempt
    await logDatabase(
      ActivityLevel.WARNING,
      'RESTORE',
      'Database restore initiated',
      { userId: session.user.id, timestamp: new Date().toISOString() }
    );

    // In a real application, you would:
    // 1. Upload and validate the backup file
    // 2. Create a backup of current data before restore
    // 3. Clear existing data (with confirmation)
    // 4. Import the backup data
    // 5. Verify data integrity

    // For now, we'll just simulate the process
    return NextResponse.json({
      success: true,
      message: "Restore functionality is not yet implemented",
      note: "In production, this would restore data from a backup file"
    });

  } catch (error) {
    // Log failed restore
    await logDatabase(
      ActivityLevel.ERROR,
      'RESTORE',
      'Database restore failed',
      {
        error: error.message,
        userId: session.user.id
      }
    );

    throw error;
  }
} 