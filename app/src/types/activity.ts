/**
 * Activity Log Type Definitions
 *
 * Description:
 * Type definitions for the activity log system that tracks all system events,
 * alerts, scans, and user actions in the Mine Demo Dashboard.
 *
 * Sample Input:
 * - Activity row: { id: "act-1", timestamp: "2026-01-18T10:30:00Z", type: "scan",
 *   status: "success", message: "Daily terrain scan completed", user: "System" }
 *
 * Expected Output:
 * Type-safe activity log entries for displaying chronological system events
 * with appropriate status indicators and categorization.
 */

/**
 * Status levels for activity outcomes.
 * Determines visual styling and filtering.
 */
export const ActivityStatus = {
  /** Activity completed successfully */
  SUCCESS: "success",
  /** Activity completed with warnings */
  WARNING: "warning",
  /** Activity failed or encountered errors */
  ERROR: "error",
  /** Informational activity (no action required) */
  INFO: "info",
  /** Activity currently in progress */
  IN_PROGRESS: "in_progress",
  /** Activity pending execution */
  PENDING: "pending",
} as const;

export type ActivityStatus = (typeof ActivityStatus)[keyof typeof ActivityStatus];

/**
 * Categories of activities tracked in the system.
 */
export const ActivityType = {
  /** Automated terrain scan */
  SCAN: "scan",
  /** System or safety alert generated */
  ALERT: "alert",
  /** Sensor data collection */
  SENSOR: "sensor",
  /** Analysis model execution */
  MODEL: "model",
  /** Human user action or intervention */
  HUMAN: "human",
  /** System maintenance activity */
  MAINTENANCE: "maintenance",
  /** Configuration change */
  CONFIG: "config",
  /** Data export or report generation */
  EXPORT: "export",
  /** Data import or upload */
  IMPORT: "import",
  /** System startup or shutdown */
  SYSTEM: "system",
  /** Hardware status change */
  HARDWARE: "hardware",
  /** Weather event or condition change */
  WEATHER: "weather",
} as const;

export type ActivityType = (typeof ActivityType)[keyof typeof ActivityType];

/**
 * Sorting options for activity log.
 */
export const ActivitySortOrder = {
  /** Most recent first */
  NEWEST_FIRST: "newest_first",
  /** Oldest first */
  OLDEST_FIRST: "oldest_first",
  /** Highest severity first */
  SEVERITY_DESC: "severity_desc",
  /** Lowest severity first */
  SEVERITY_ASC: "severity_asc",
  /** By activity type */
  TYPE: "type",
  /** By status */
  STATUS: "status",
} as const;

export type ActivitySortOrder = (typeof ActivitySortOrder)[keyof typeof ActivitySortOrder];

/**
 * Categories of alerts in the system.
 */
export const AlertCategory = {
  GEOLOGICAL_RISK: "geological_risk",
  HARDWARE_FAILURE: "hardware_failure",
  WEATHER_HAZARD: "weather_hazard",
  SAFETY_VIOLATION: "safety_violation",
  DATA_QUALITY: "data_quality",
  PERFORMANCE: "performance",
  SECURITY: "security",
  MAINTENANCE_REQUIRED: "maintenance_required",
} as const;

export type AlertCategory = (typeof AlertCategory)[keyof typeof AlertCategory];

/**
 * Types of scans performed by the system.
 */
export const ScanType = {
  FULL_TERRAIN: "full_terrain",
  PARTIAL: "partial",
  HIGH_RESOLUTION: "high_resolution",
  QUICK_SCAN: "quick_scan",
  THERMAL: "thermal",
  COMPARISON: "comparison",
} as const;

export type ScanType = (typeof ScanType)[keyof typeof ScanType];

/**
 * Activity log entry representing a single event or action.
 */
export interface ActivityRow {
  /** Unique identifier for the activity */
  id: string;
  /** Timestamp when the activity occurred */
  timestamp: Date | string;
  /** Type of activity for categorization */
  type: ActivityType;
  /** Status outcome of the activity */
  status: ActivityStatus;
  /** Human-readable message describing the activity */
  message: string;
  /** User or system that initiated the activity */
  user: string;
  /** Optional detailed description or notes */
  details?: string;
  /** Related entity identifier (e.g., tower ID, file name) */
  relatedEntity?: string;
  /** Severity level for prioritization (1-5) */
  severity?: number;
  /** Whether the activity has been acknowledged */
  acknowledged?: boolean;
  /** Additional metadata */
  metadata?: ActivityMetadata;
}

/**
 * Additional metadata for activity entries.
 */
export interface ActivityMetadata {
  /** Duration of the activity in milliseconds */
  duration?: number;
  /** Associated file paths or names */
  files?: string[];
  /** Related hardware component identifiers */
  hardwareIds?: string[];
  /** Geographic coordinates if location-relevant */
  location?: {
    latitude: number;
    longitude: number;
    elevation?: number;
  };
  /** Tags for filtering and categorization */
  tags?: string[];
  /** Error code or reference */
  errorCode?: string;
  /** Stack trace or detailed error information */
  errorDetails?: string;
  /** Custom key-value pairs */
  custom?: Record<string, unknown>;
}

/**
 * Filter criteria for activity log queries.
 */
export interface ActivityFilter {
  /** Filter by activity types */
  types?: ActivityType[];
  /** Filter by status levels */
  statuses?: ActivityStatus[];
  /** Filter by date range */
  dateRange?: {
    start: Date | string;
    end: Date | string;
  };
  /** Filter by severity level (minimum) */
  minSeverity?: number;
  /** Filter by user */
  users?: string[];
  /** Filter by related entity */
  relatedEntities?: string[];
  /** Filter by acknowledgment status */
  acknowledgedOnly?: boolean;
  /** Search query for message text */
  searchQuery?: string;
  /** Limit number of results */
  limit?: number;
  /** Offset for pagination */
  offset?: number;
}

/**
 * Summary statistics for activity log.
 */
export interface ActivitySummary {
  /** Total number of activities */
  total: number;
  /** Count by status */
  byStatus: Record<ActivityStatus, number>;
  /** Count by type */
  byType: Record<ActivityType, number>;
  /** Number of unacknowledged activities */
  unacknowledged: number;
  /** Number of high-severity activities (4-5) */
  highSeverity: number;
  /** Time range of activities */
  timeRange: {
    earliest: Date | string;
    latest: Date | string;
  };
  /** Most common activity type */
  mostCommonType?: ActivityType;
  /** Current system health based on recent activities */
  systemHealth?: number;
}

/**
 * Activity log configuration.
 */
export interface ActivityLogConfig {
  /** Maximum number of activities to display */
  maxDisplayed: number;
  /** Auto-refresh interval in milliseconds */
  refreshInterval?: number;
  /** Whether to show in-progress activities */
  showInProgress: boolean;
  /** Whether to show acknowledged activities */
  showAcknowledged: boolean;
  /** Default sorting order */
  sortOrder: ActivitySortOrder;
  /** Filter preset */
  defaultFilter?: ActivityFilter;
  /** Whether to enable real-time updates */
  realTimeUpdates: boolean;
}
