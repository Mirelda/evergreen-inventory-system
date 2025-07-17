import db from "./db";

/**
 * Activity Logger Utility
 * Logs user activities to the database for system monitoring
 */

export const ActivityLevel = {
  INFO: 'INFO',
  WARNING: 'WARNING',
  ERROR: 'ERROR'
};

export const ActivityCategory = {
  AUTHENTICATION: 'AUTHENTICATION',
  USER: 'USER',
  ITEM: 'ITEM',
  INVENTORY: 'INVENTORY',
  SALES: 'SALES',
  PURCHASE: 'PURCHASE',
  DATABASE: 'DATABASE',
  SYSTEM: 'SYSTEM',
  API: 'API'
};

/**
 * Log an activity to the database
 * @param {Object} options - Activity log options
 * @param {string} options.level - Activity level (INFO, WARNING, ERROR)
 * @param {string} options.category - Activity category
 * @param {string} options.action - Action performed (CREATE, UPDATE, DELETE, etc.)
 * @param {string} options.message - Human readable message
 * @param {string} [options.details] - Additional details
 * @param {string} [options.userId] - ID of the user who performed the action
 * @param {string} [options.ip] - IP address
 * @param {string} [options.userAgent] - User agent string
 * @param {string} [options.entityType] - Type of entity affected
 * @param {string} [options.entityId] - ID of the affected entity
 * @param {Object} [options.oldValues] - Previous values
 * @param {Object} [options.newValues] - New values
 */
export async function logActivity({
  level,
  category,
  action,
  message,
  details = null,
  userId = null,
  ip = null,
  userAgent = null,
  entityType = null,
  entityId = null,
  oldValues = null,
  newValues = null
}) {
  try {
    await db.activityLog.create({
      data: {
        level,
        category,
        action,
        message,
        details: details ? JSON.stringify(details) : null,
        userId,
        ip,
        userAgent,
        entityType,
        entityId,
        oldValues: oldValues ? JSON.stringify(oldValues) : null,
        newValues: newValues ? JSON.stringify(newValues) : null
      }
    });
  } catch (error) {
    // Don't throw errors for logging failures, just log to console
    console.error('Failed to log activity:', error);
  }
}

/**
 * Log user authentication events
 */
export async function logAuth(action, userId, userEmail, success, ip, userAgent, details = null) {
  await logActivity({
    level: success ? ActivityLevel.INFO : ActivityLevel.ERROR,
    category: ActivityCategory.AUTHENTICATION,
    action,
    message: success 
      ? `${action} successful for user: ${userEmail}`
      : `${action} failed for user: ${userEmail}`,
    details,
    userId: success ? userId : null,
    ip,
    userAgent
  });
}

/**
 * Log item operations
 */
export async function logItem(action, itemId, itemTitle, userId, ip, userAgent, oldValues = null, newValues = null) {
  await logActivity({
    level: ActivityLevel.INFO,
    category: ActivityCategory.ITEM,
    action,
    message: `Item ${action.toLowerCase()}: ${itemTitle}`,
    userId,
    ip,
    userAgent,
    entityType: 'Item',
    entityId: itemId,
    oldValues,
    newValues
  });
}

/**
 * Log inventory operations
 */
export async function logInventory(action, itemTitle, quantity, userId, ip, userAgent, details = null) {
  await logActivity({
    level: ActivityLevel.INFO,
    category: ActivityCategory.INVENTORY,
    action,
    message: `Stock ${action.toLowerCase()} for item: ${itemTitle}`,
    details: details || `Quantity: ${quantity}`,
    userId,
    ip,
    userAgent,
    entityType: 'Inventory'
  });
}

/**
 * Log sales operations
 */
export async function logSale(action, saleId, amount, itemCount, userId, ip, userAgent) {
  await logActivity({
    level: ActivityLevel.INFO,
    category: ActivityCategory.SALES,
    action,
    message: `Sale ${action.toLowerCase()}${saleId ? ` (${saleId})` : ''}`,
    details: `Amount: $${amount}, Items: ${itemCount}`,
    userId,
    ip,
    userAgent,
    entityType: 'Sale',
    entityId: saleId
  });
}

/**
 * Log user operations
 */
export async function logUser(action, targetUserId, targetUserEmail, userId, ip, userAgent, oldValues = null, newValues = null) {
  await logActivity({
    level: ActivityLevel.INFO,
    category: ActivityCategory.USER,
    action,
    message: `User ${action.toLowerCase()}: ${targetUserEmail}`,
    userId,
    ip,
    userAgent,
    entityType: 'User',
    entityId: targetUserId,
    oldValues,
    newValues
  });
}

/**
 * Log system events
 */
export async function logSystem(level, action, message, details = null) {
  await logActivity({
    level,
    category: ActivityCategory.SYSTEM,
    action,
    message,
    details,
    ip: '127.0.0.1',
    userAgent: 'System'
  });
}

/**
 * Log API events
 */
export async function logAPI(level, action, endpoint, message, ip, userAgent, userId = null, details = null) {
  await logActivity({
    level,
    category: ActivityCategory.API,
    action,
    message: `${action} ${endpoint}: ${message}`,
    details,
    userId,
    ip,
    userAgent
  });
}

/**
 * Log database events
 */
export async function logDatabase(level, action, message, details = null) {
  await logActivity({
    level,
    category: ActivityCategory.DATABASE,
    action,
    message,
    details,
    ip: '127.0.0.1',
    userAgent: 'System'
  });
}

/**
 * Helper function to get client IP and User Agent from request
 */
export function getClientInfo(request) {
  const ip = request.headers.get('x-forwarded-for') || 
             request.headers.get('x-real-ip') || 
             request.ip || 
             '127.0.0.1';
  
  const userAgent = request.headers.get('user-agent') || 'Unknown';
  
  return { ip, userAgent };
} 