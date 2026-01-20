/**
 * Activity Data Module
 *
 * Provides placeholder activity data for the Mine Demo Dashboard activity log.
 */

import { type ActivityRow, ActivityType, ActivityStatus } from '../types/activity';

/**
 * Generates a timestamp within the last N hours from now
 * @param hoursAgo - Number of hours before current time
 * @returns ISO string timestamp
 */
const getTimestamp = (hoursAgo: number): string => {
  const now = new Date();
  const timestamp = new Date(now.getTime() - hoursAgo * 60 * 60 * 1000);
  return timestamp.toISOString();
};

/**
 * Placeholder activity data representing recent system events
 */
const placeholderActivities: ActivityRow[] = [
  {
    id: 'act-001',
    timestamp: getTimestamp(0.1),
    type: ActivityType.SCAN,
    status: ActivityStatus.SUCCESS,
    message: 'Full terrain scan completed successfully',
    user: 'System',
    details: 'Processed 2.4 million points with 99.8% coverage',
    relatedEntity: 'Tower1',
    severity: 1,
    acknowledged: true,
    metadata: {
      duration: 180000,
      files: ['scan_20260118_0930.las'],
      hardwareIds: ['LIDAR-T1-001'],
    },
  },
  {
    id: 'act-002',
    timestamp: getTimestamp(0.5),
    type: ActivityType.ALERT,
    status: ActivityStatus.WARNING,
    message: 'Elevated displacement detected in Zone B-4',
    user: 'System',
    details: 'Movement of 12mm detected over 24-hour period. Threshold is 15mm.',
    relatedEntity: 'Zone-B4',
    severity: 3,
    acknowledged: false,
    metadata: {
      location: {
        latitude: -23.5505,
        longitude: 46.6333,
        elevation: 245.5,
      },
      tags: ['displacement', 'monitoring', 'zone-b'],
    },
  },
  {
    id: 'act-003',
    timestamp: getTimestamp(1.2),
    type: ActivityType.SENSOR,
    status: ActivityStatus.SUCCESS,
    message: 'Thermal imaging calibration completed',
    user: 'System',
    details: 'All thermal sensors recalibrated within tolerance',
    relatedEntity: 'Tower2',
    severity: 1,
    acknowledged: true,
    metadata: {
      duration: 45000,
      hardwareIds: ['THERMAL-T2-001', 'THERMAL-T2-002'],
    },
  },
  {
    id: 'act-004',
    timestamp: getTimestamp(2.0),
    type: ActivityType.MODEL,
    status: ActivityStatus.SUCCESS,
    message: 'Risk assessment model updated',
    user: 'System',
    details: 'Integrated latest scan data into predictive model. Risk levels recalculated.',
    severity: 2,
    acknowledged: true,
    metadata: {
      duration: 320000,
      files: ['risk_model_v2.4.json'],
      tags: ['risk-analysis', 'predictive'],
    },
  },
  {
    id: 'act-005',
    timestamp: getTimestamp(2.5),
    type: ActivityType.HUMAN,
    status: ActivityStatus.INFO,
    message: 'Manual inspection scheduled for North Face',
    user: 'J. Martinez',
    details: 'Scheduled routine visual inspection following automated alert',
    relatedEntity: 'North-Face',
    severity: 2,
    acknowledged: true,
  },
  {
    id: 'act-006',
    timestamp: getTimestamp(3.0),
    type: ActivityType.ALERT,
    status: ActivityStatus.ERROR,
    message: 'Critical: Sensor communication lost with Tower 3',
    user: 'System',
    details: 'Unable to establish connection with LIDAR unit. Last contact 15 minutes ago.',
    relatedEntity: 'Tower3',
    severity: 5,
    acknowledged: false,
    metadata: {
      errorCode: 'COMM_TIMEOUT_001',
      errorDetails: 'Connection timeout after 3 retry attempts',
      hardwareIds: ['LIDAR-T3-001'],
    },
  },
  {
    id: 'act-007',
    timestamp: getTimestamp(4.2),
    type: ActivityType.SCAN,
    status: ActivityStatus.WARNING,
    message: 'Partial scan completed - obstruction detected',
    user: 'System',
    details: 'Scan coverage reduced to 78% due to dust obstruction on sensor lens',
    relatedEntity: 'Tower1',
    severity: 3,
    acknowledged: true,
    metadata: {
      duration: 195000,
      files: ['scan_20260118_0530.las'],
      hardwareIds: ['LIDAR-T1-001'],
      tags: ['maintenance-required'],
    },
  },
  {
    id: 'act-008',
    timestamp: getTimestamp(5.5),
    type: ActivityType.SENSOR,
    status: ActivityStatus.INFO,
    message: 'Ground probe data synchronized',
    user: 'System',
    details: 'Received data from 12 embedded ground probes',
    severity: 1,
    acknowledged: true,
    metadata: {
      hardwareIds: ['PROBE-001', 'PROBE-002', 'PROBE-003', 'PROBE-004', 'PROBE-005', 'PROBE-006', 'PROBE-007', 'PROBE-008', 'PROBE-009', 'PROBE-010', 'PROBE-011', 'PROBE-012'],
      duration: 5000,
    },
  },
  {
    id: 'act-009',
    timestamp: getTimestamp(6.8),
    type: ActivityType.MODEL,
    status: ActivityStatus.WARNING,
    message: 'Stability analysis indicates potential concern',
    user: 'System',
    details: 'Slope stability factor decreased from 1.8 to 1.4 in Sector C',
    relatedEntity: 'Sector-C',
    severity: 4,
    acknowledged: false,
    metadata: {
      location: {
        latitude: -23.5510,
        longitude: 46.6340,
        elevation: 198.2,
      },
      tags: ['stability', 'slope-analysis', 'sector-c'],
    },
  },
  {
    id: 'act-010',
    timestamp: getTimestamp(8.0),
    type: ActivityType.HUMAN,
    status: ActivityStatus.SUCCESS,
    message: 'Maintenance completed on Tower 2 camera',
    user: 'R. Thompson',
    details: 'Replaced damaged lens cover and recalibrated focus',
    relatedEntity: 'Tower2',
    severity: 2,
    acknowledged: true,
    metadata: {
      duration: 2700000,
      hardwareIds: ['CAM-T2-001'],
    },
  },
  {
    id: 'act-011',
    timestamp: getTimestamp(10.5),
    type: ActivityType.ALERT,
    status: ActivityStatus.INFO,
    message: 'Weather advisory: High wind conditions expected',
    user: 'System',
    details: 'Forecast indicates wind speeds up to 45 km/h over next 6 hours',
    severity: 2,
    acknowledged: true,
    metadata: {
      tags: ['weather', 'advisory'],
    },
  },
  {
    id: 'act-012',
    timestamp: getTimestamp(12.0),
    type: ActivityType.SCAN,
    status: ActivityStatus.SUCCESS,
    message: 'Comparative analysis scan completed',
    user: 'System',
    details: 'Baseline comparison shows 0.3% volumetric change since last week',
    severity: 1,
    acknowledged: true,
    metadata: {
      duration: 240000,
      files: ['comparison_20260118.json', 'baseline_20260111.las'],
    },
  },
  {
    id: 'act-013',
    timestamp: getTimestamp(14.2),
    type: ActivityType.SENSOR,
    status: ActivityStatus.ERROR,
    message: 'Accelerometer data anomaly detected',
    user: 'System',
    details: 'Sensor ACC-005 reporting values outside calibrated range',
    relatedEntity: 'Zone-A2',
    severity: 4,
    acknowledged: false,
    metadata: {
      hardwareIds: ['ACC-005'],
      errorCode: 'SENSOR_RANGE_001',
      tags: ['calibration', 'anomaly'],
    },
  },
  {
    id: 'act-014',
    timestamp: getTimestamp(16.0),
    type: ActivityType.MODEL,
    status: ActivityStatus.INFO,
    message: 'Machine learning model retraining initiated',
    user: 'System',
    details: 'Incorporating 30 days of new observation data',
    severity: 1,
    acknowledged: true,
    metadata: {
      duration: 7200000,
      tags: ['ml-training', 'scheduled'],
    },
  },
  {
    id: 'act-015',
    timestamp: getTimestamp(18.5),
    type: ActivityType.HUMAN,
    status: ActivityStatus.INFO,
    message: 'Shift change: Night monitoring team active',
    user: 'A. Chen',
    details: 'Handover completed. All systems nominal.',
    severity: 1,
    acknowledged: true,
  },
  {
    id: 'act-016',
    timestamp: getTimestamp(20.0),
    type: ActivityType.ALERT,
    status: ActivityStatus.SUCCESS,
    message: 'Previous alert resolved: Tower 3 connection restored',
    user: 'System',
    details: 'Communication re-established after network switch replacement',
    relatedEntity: 'Tower3',
    severity: 2,
    acknowledged: true,
    metadata: {
      hardwareIds: ['LIDAR-T3-001'],
      tags: ['resolved', 'connectivity'],
    },
  },
  {
    id: 'act-017',
    timestamp: getTimestamp(21.5),
    type: ActivityType.SCAN,
    status: ActivityStatus.SUCCESS,
    message: 'High-resolution scan of critical area completed',
    user: 'System',
    details: 'Targeted scan of North Face with 2x point density',
    relatedEntity: 'North-Face',
    severity: 2,
    acknowledged: true,
    metadata: {
      duration: 420000,
      files: ['hr_scan_northface_20260117.las'],
      hardwareIds: ['LIDAR-T1-001', 'LIDAR-T2-001'],
    },
  },
  {
    id: 'act-018',
    timestamp: getTimestamp(22.8),
    type: ActivityType.SENSOR,
    status: ActivityStatus.SUCCESS,
    message: 'Daily sensor health check completed',
    user: 'System',
    details: 'All 47 sensors reporting within normal parameters',
    severity: 1,
    acknowledged: true,
    metadata: {
      duration: 120000,
      tags: ['health-check', 'daily'],
    },
  },
  {
    id: 'act-019',
    timestamp: getTimestamp(23.2),
    type: ActivityType.HUMAN,
    status: ActivityStatus.WARNING,
    message: 'Vehicle proximity alert acknowledged',
    user: 'M. Davis',
    details: 'Excavator EX-04 operating near monitoring zone boundary',
    relatedEntity: 'Zone-B2',
    severity: 3,
    acknowledged: true,
    metadata: {
      tags: ['vehicle', 'proximity', 'safety'],
    },
  },
  {
    id: 'act-020',
    timestamp: getTimestamp(23.8),
    type: ActivityType.MODEL,
    status: ActivityStatus.SUCCESS,
    message: 'Erosion prediction model generated weekly report',
    user: 'System',
    details: 'Predicted erosion rates within acceptable limits for all zones',
    severity: 1,
    acknowledged: true,
    metadata: {
      files: ['erosion_report_week03.pdf'],
      tags: ['erosion', 'weekly-report'],
    },
  },
];

/**
 * Returns the placeholder activity data array sorted by timestamp (newest first)
 */
export function getPlaceholderActivities(): ActivityRow[] {
  return [...placeholderActivities].sort((a, b) => {
    const dateA = new Date(a.timestamp);
    const dateB = new Date(b.timestamp);
    return dateB.getTime() - dateA.getTime();
  });
}
