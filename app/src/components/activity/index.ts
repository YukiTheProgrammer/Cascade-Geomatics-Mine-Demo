/**
 * Activity Components Index
 *
 * Description:
 * Barrel export file for activity log components in the Mine Demo Dashboard.
 * Provides a single import point for all activity-related components used
 * to display system events, alerts, scans, and user actions in the dashboard.
 * Includes ActivityRow (individual activity entry) and ActivityLog (container
 * component for scrollable activity list).
 *
 * Sample Input:
 * import { ActivityRow, ActivityLog } from '@/components/activity';
 *
 * Expected Output:
 * Access to all exported activity components and their associated types.
 */

export { ActivityRow } from './ActivityRow.js';
export type { ActivityRowProps } from './ActivityRow.js';

export { ActivityLog } from './ActivityLog.js';
export type { ActivityLogProps } from './ActivityLog.js';
