/**
 * Types Index
 *
 * Description:
 * Central export file for all TypeScript type definitions used in the
 * Mine Demo Dashboard. Provides a single import point for all types.
 *
 * Sample Input:
 * import { ActivityRow, KPICard, ViewMode } from '@/types';
 *
 * Expected Output:
 * Consolidated type exports for easy consumption throughout the application.
 */

// Point Cloud Types
export type {
  PointCloudConfig,
  Annotation,
  AnnotationMetadata,
  AnnotationClickEvent,
  CameraState,
  PointCloudStats,
  VehicleMesh,
  HistoricalComparison,
  PointCloudDiff,
  Position3D,
  Position2D,
} from './pointcloud';

export {
  ViewMode,
  ColorMode,
  AnnotationType,
  VehicleType,
} from './pointcloud';

// KPI Types
export type {
  KPICard,
  WeatherKPI,
  HardwareKPI,
  HardwareUnit,
  KPIStrip,
  WeatherData,
  HardwareOverview,
  TowerInstallation,
  KPIThreshold,
} from './kpi';

export {
  KPIStatus,
  TrendDirection,
  HardwareType,
  WeatherCondition,
  KPIStripType,
  ThresholdOperator,
} from './kpi';

// Activity Types
export type {
  ActivityRow,
  ActivityMetadata,
  ActivityFilter,
  ActivitySummary,
  ActivityLogConfig,
} from './activity';

export {
  ActivityStatus,
  ActivityType,
  ActivitySortOrder,
  AlertCategory,
  ScanType,
} from './activity';
