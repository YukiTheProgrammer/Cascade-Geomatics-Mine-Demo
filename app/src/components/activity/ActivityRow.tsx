/**
 * ActivityRow Component
 *
 * Description:
 * A single row component for the activity log displaying system events, alerts,
 * scans, and user actions in the Mine Demo Dashboard. Features a status indicator,
 * timestamp, activity type tag, and description. Designed with an industrial-utilitarian
 * aesthetic that emphasizes clarity and scientific precision for quarry operators
 * monitoring critical geological data.
 *
 * Sample Input:
 * <ActivityRow
 *   activity={{
 *     id: "act-1",
 *     timestamp: "2026-01-18T10:30:00Z",
 *     type: "scan",
 *     status: "success",
 *     message: "Daily terrain scan completed successfully",
 *     user: "System"
 *   }}
 * />
 *
 * Expected Output:
 * A styled row element displaying:
 *   - Green status indicator dot (success status)
 *   - Formatted timestamp "10:30 AM"
 *   - Purple "Scan" type tag
 *   - Activity message text
 *   - Proper spacing and alignment
 */

import { useMemo } from 'react';
import {
  type ActivityRow as ActivityRowType,
  type ActivityStatus as ActivityStatusType,
  type ActivityType as ActivityTypeEnum,
} from '../../types/activity';
import {
  STATUS_COLORS,
  ACTIVITY_TYPE_COLORS,
  type StatusType,
  type ActivityType as ActivityTypeConstant,
} from '../../utils/constants';

interface ActivityRowProps {
  /** Activity data object containing all row information */
  activity: ActivityRowType;
  /** Optional additional CSS classes */
  className?: string;
}

/**
 * Maps lowercase activity status values to PascalCase constant keys
 * This bridges the gap between activity.ts types and constants.ts keys
 */
const STATUS_KEY_MAP: Record<string, StatusType> = {
  success: 'Success',
  warning: 'Warning',
  error: 'Error',
  info: 'Info',
  in_progress: 'Info',
  pending: 'Info',
};

/**
 * Maps lowercase activity type values to PascalCase constant keys
 * This bridges the gap between activity.ts types and constants.ts keys
 */
const TYPE_KEY_MAP: Record<string, ActivityTypeConstant> = {
  scan: 'Scan',
  alert: 'Alert',
  sensor: 'Sensor',
  model: 'Model',
  human: 'Human',
  maintenance: 'Human',
  config: 'Human',
  export: 'Model',
  import: 'Model',
  system: 'Sensor',
  hardware: 'Sensor',
  weather: 'Alert',
};

/**
 * Formats a timestamp into a compact human-readable format
 * Shows time for today, or short date for older entries
 *
 * @param timestamp - Date object or ISO string
 * @returns Formatted string like "3:30 PM" or "Jan 17"
 */
const formatTimestamp = (timestamp: Date | string): string => {
  const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
  const now = new Date();

  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  if (isToday) {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  }

  // For non-today dates, show compact date only
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Retrieves the appropriate status indicator color class
 *
 * @param status - Activity status value from activity types
 * @returns Tailwind CSS class for background color
 */
const getStatusColor = (status: ActivityStatusType): string => {
  const key = STATUS_KEY_MAP[status] || 'Info';
  return STATUS_COLORS[key] || STATUS_COLORS.Info;
};

/**
 * Retrieves the appropriate activity type tag styling
 *
 * @param type - Activity type value from activity types
 * @returns Tailwind CSS classes for tag styling
 */
const getTypeTagStyles = (type: ActivityTypeEnum): string => {
  const key = TYPE_KEY_MAP[type] || 'Human';
  return ACTIVITY_TYPE_COLORS[key] || ACTIVITY_TYPE_COLORS.Human;
};

/**
 * Retrieves the display label for an activity type
 *
 * @param type - Activity type value from activity types
 * @returns Human-readable type label
 */
const getTypeLabel = (type: ActivityTypeEnum): string => {
  const key = TYPE_KEY_MAP[type] || 'Human';
  return key;
};

/**
 * ActivityRow - Displays a single activity log entry
 *
 * Features:
 * - Status indicator with appropriate color coding
 * - Human-readable timestamp formatting
 * - Activity type tag with distinct coloring
 * - Clean, scannable layout for quick information retrieval
 * - Responsive design with proper text truncation
 * - Accessible with proper ARIA attributes
 */
const ActivityRow = ({ activity, className = '' }: ActivityRowProps) => {
  const { timestamp, type, status, message } = activity;

  const formattedTime = useMemo(() => formatTimestamp(timestamp), [timestamp]);
  const statusColor = useMemo(() => getStatusColor(status), [status]);
  const typeTagStyles = useMemo(() => getTypeTagStyles(type), [type]);
  const typeLabel = useMemo(() => getTypeLabel(type), [type]);

  return (
    <div
      role="listitem"
      className={`
        flex items-center gap-3 px-3 py-2.5
        odd:bg-slate-800/30
        ${className}
      `}
    >
      {/* Status Indicator */}
      <div
        className={`flex-shrink-0 w-2 h-2 rounded-full ${statusColor}`}
        title={`Status: ${status}`}
        aria-label={`Status: ${status}`}
      />

      {/* Timestamp */}
      <time
        dateTime={typeof timestamp === 'string' ? timestamp : timestamp.toISOString()}
        className="flex-shrink-0 w-16 text-xs text-slate-500 font-mono"
      >
        {formattedTime}
      </time>

      {/* Activity Type Tag */}
      <span className={`flex-shrink-0 px-2 py-0.5 text-xs font-medium rounded ${typeTagStyles}`}>
        {typeLabel}
      </span>

      {/* Description / Message */}
      <p className="flex-1 min-w-0 text-sm text-slate-300 truncate" title={message}>
        {message}
      </p>
    </div>
  );
};

export { ActivityRow };
export type { ActivityRowProps };
