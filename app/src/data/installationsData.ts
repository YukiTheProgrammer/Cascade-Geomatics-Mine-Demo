/**
 * Installations Data Module
 *
 * Description:
 * Provides placeholder installation data for the Mine Demo Dashboard tower monitoring panel.
 * Contains deterministic hardware status data for 5 tower installations, each with 4 hardware
 * types (LIDAR, Thermal, Camera, Probes). Data is designed for development and demonstration
 * purposes with varied statuses to showcase all UI states.
 *
 * Sample Input:
 * import { getTowerInstallations, getTowerById } from '@/data/installationsData';
 * const towers = getTowerInstallations();
 * const tower1 = getTowerById('Tower1');
 *
 * Expected Output:
 * An array of TowerInstallation objects with:
 *   - 5 tower installations with unique colors
 *   - 4 hardware units per tower (LIDAR, Thermal, Camera, Probes)
 *   - Mix of statuses (success, warning, error, unknown)
 *   - Deterministic data for consistent UI rendering
 */

import { type TowerInstallation, type HardwareUnit, KPIStatus } from '../types/kpi';
import { TOWER_COLORS, TOWER_IDS, HARDWARE_TYPES } from '../utils/constants';

/**
 * Hardware status type for installation panel display
 */
export type HardwareStatus = 'operational' | 'warning' | 'error' | 'offline';

/**
 * Maps KPIStatus to HardwareStatus for display purposes
 */
export const kpiStatusToHardwareStatus = (status: KPIStatus): HardwareStatus => {
  switch (status) {
    case KPIStatus.SUCCESS:
      return 'operational';
    case KPIStatus.WARNING:
      return 'warning';
    case KPIStatus.ERROR:
      return 'error';
    case KPIStatus.UNKNOWN:
    default:
      return 'offline';
  }
};

/**
 * Maps HardwareStatus to KPIStatus for type compatibility
 */
export const hardwareStatusToKpiStatus = (status: HardwareStatus): KPIStatus => {
  switch (status) {
    case 'operational':
      return KPIStatus.SUCCESS;
    case 'warning':
      return KPIStatus.WARNING;
    case 'error':
      return KPIStatus.ERROR;
    case 'offline':
    default:
      return KPIStatus.UNKNOWN;
  }
};

/**
 * Generates a timestamp within the last N minutes from now
 * @param minutesAgo - Number of minutes before current time
 * @returns ISO string timestamp
 */
const getTimestamp = (minutesAgo: number): string => {
  const now = new Date();
  const timestamp = new Date(now.getTime() - minutesAgo * 60 * 1000);
  return timestamp.toISOString();
};

/**
 * Creates a hardware unit with the specified parameters
 */
const createHardwareUnit = (
  towerId: string,
  type: string,
  status: KPIStatus,
  minutesAgo: number,
  suffix: string = '001'
): HardwareUnit => ({
  id: `${type.toUpperCase()}-${towerId.replace('Tower', 'T')}-${suffix}`,
  name: type,
  status,
  lastContact: getTimestamp(minutesAgo),
  location: towerId,
  metadata: {
    firmwareVersion: '2.4.1',
    signalStrength: status === KPIStatus.SUCCESS ? 95 : status === KPIStatus.WARNING ? 72 : 0,
  },
});

/**
 * Calculates overall tower status based on hardware unit statuses
 * @param units - Array of hardware units
 * @returns The most severe status among all units
 */
const calculateTowerStatus = (units: HardwareUnit[]): KPIStatus => {
  const statuses = units.map((u) => u.status);

  if (statuses.includes(KPIStatus.ERROR)) {
    return KPIStatus.ERROR;
  }
  if (statuses.includes(KPIStatus.WARNING)) {
    return KPIStatus.WARNING;
  }
  if (statuses.includes(KPIStatus.UNKNOWN)) {
    return KPIStatus.WARNING;
  }
  return KPIStatus.SUCCESS;
};

/**
 * Placeholder tower installation data with varied statuses
 * Tower 1: All operational
 * Tower 2: Warning on Thermal
 * Tower 3: Error on LIDAR, Warning on Camera
 * Tower 4: Offline Probes
 * Tower 5: Warning on LIDAR, Error on Thermal
 *
 * Note: worldPosition values use normalized coordinates (0-1 range) that will be
 * mapped to actual point cloud bounds by the annotation system. This ensures
 * annotations appear correctly regardless of point cloud size/position.
 * Format: { x: 0-1, y: 0-1, z: 0-1 } where 0 = min bound, 1 = max bound
 */
const createTowerInstallations = (): TowerInstallation[] => {
  const towers: TowerInstallation[] = [];

  // Tower 1 - All Operational (Green status) - North Ridge (front-left area)
  const tower1Lidar = createHardwareUnit('Tower1', HARDWARE_TYPES.LIDAR, KPIStatus.SUCCESS, 2);
  const tower1Thermal = createHardwareUnit('Tower1', HARDWARE_TYPES.Thermal, KPIStatus.SUCCESS, 3);
  const tower1Camera = createHardwareUnit('Tower1', HARDWARE_TYPES.Camera, KPIStatus.SUCCESS, 1);
  const tower1Probes = createHardwareUnit('Tower1', HARDWARE_TYPES.Probes, KPIStatus.SUCCESS, 5);

  towers.push({
    id: TOWER_IDS[0],
    name: 'Tower 1 - North Ridge',
    color: TOWER_COLORS.Tower1,
    status: KPIStatus.SUCCESS,
    lidar: tower1Lidar,
    thermalCamera: tower1Thermal,
    camera: tower1Camera,
    probes: tower1Probes,
    location: {
      latitude: -23.5489,
      longitude: 46.6312,
      elevation: 312.5,
    },
    // Normalized position: front-left corner of point cloud
    worldPosition: {
      x: 0.2,
      y: 0.7,
      z: 0.2,
    },
    lastMaintenance: getTimestamp(10080), // 7 days ago
    nextMaintenance: getTimestamp(-20160), // 14 days from now
  });

  // Tower 2 - Warning on Thermal (Yellow overall status) - East Slope (right side)
  const tower2Lidar = createHardwareUnit('Tower2', HARDWARE_TYPES.LIDAR, KPIStatus.SUCCESS, 4);
  const tower2Thermal = createHardwareUnit('Tower2', HARDWARE_TYPES.Thermal, KPIStatus.WARNING, 45);
  const tower2Camera = createHardwareUnit('Tower2', HARDWARE_TYPES.Camera, KPIStatus.SUCCESS, 2);
  const tower2Probes = createHardwareUnit('Tower2', HARDWARE_TYPES.Probes, KPIStatus.SUCCESS, 8);

  towers.push({
    id: TOWER_IDS[1],
    name: 'Tower 2 - East Slope',
    color: TOWER_COLORS.Tower2,
    status: calculateTowerStatus([tower2Lidar, tower2Thermal, tower2Camera, tower2Probes]),
    lidar: tower2Lidar,
    thermalCamera: tower2Thermal,
    camera: tower2Camera,
    probes: tower2Probes,
    location: {
      latitude: -23.5512,
      longitude: 46.6345,
      elevation: 287.2,
    },
    // Normalized position: right side of point cloud
    worldPosition: {
      x: 0.8,
      y: 0.5,
      z: 0.5,
    },
    lastMaintenance: getTimestamp(4320), // 3 days ago
    nextMaintenance: getTimestamp(-17280), // 12 days from now
  });

  // Tower 3 - Error on LIDAR, Warning on Camera (Red overall status) - South Face (back area)
  const tower3Lidar = createHardwareUnit('Tower3', HARDWARE_TYPES.LIDAR, KPIStatus.ERROR, 180);
  const tower3Thermal = createHardwareUnit('Tower3', HARDWARE_TYPES.Thermal, KPIStatus.SUCCESS, 6);
  const tower3Camera = createHardwareUnit('Tower3', HARDWARE_TYPES.Camera, KPIStatus.WARNING, 30);
  const tower3Probes = createHardwareUnit('Tower3', HARDWARE_TYPES.Probes, KPIStatus.SUCCESS, 12);

  towers.push({
    id: TOWER_IDS[2],
    name: 'Tower 3 - South Face',
    color: TOWER_COLORS.Tower3,
    status: calculateTowerStatus([tower3Lidar, tower3Thermal, tower3Camera, tower3Probes]),
    lidar: tower3Lidar,
    thermalCamera: tower3Thermal,
    camera: tower3Camera,
    probes: tower3Probes,
    location: {
      latitude: -23.5534,
      longitude: 46.6298,
      elevation: 245.8,
    },
    // Normalized position: back-center of point cloud
    worldPosition: {
      x: 0.5,
      y: 0.4,
      z: 0.8,
    },
    lastMaintenance: getTimestamp(21600), // 15 days ago
    nextMaintenance: getTimestamp(-1440), // 1 day from now (overdue soon)
  });

  // Tower 4 - Offline Probes (Warning overall status) - West Quarry (left side)
  const tower4Lidar = createHardwareUnit('Tower4', HARDWARE_TYPES.LIDAR, KPIStatus.SUCCESS, 3);
  const tower4Thermal = createHardwareUnit('Tower4', HARDWARE_TYPES.Thermal, KPIStatus.SUCCESS, 5);
  const tower4Camera = createHardwareUnit('Tower4', HARDWARE_TYPES.Camera, KPIStatus.SUCCESS, 2);
  const tower4Probes = createHardwareUnit('Tower4', HARDWARE_TYPES.Probes, KPIStatus.UNKNOWN, 1440);

  towers.push({
    id: TOWER_IDS[3],
    name: 'Tower 4 - West Quarry',
    color: TOWER_COLORS.Tower4,
    status: calculateTowerStatus([tower4Lidar, tower4Thermal, tower4Camera, tower4Probes]),
    lidar: tower4Lidar,
    thermalCamera: tower4Thermal,
    camera: tower4Camera,
    probes: tower4Probes,
    location: {
      latitude: -23.5501,
      longitude: 46.6267,
      elevation: 198.4,
    },
    // Normalized position: left side of point cloud
    worldPosition: {
      x: 0.15,
      y: 0.3,
      z: 0.6,
    },
    lastMaintenance: getTimestamp(8640), // 6 days ago
    nextMaintenance: getTimestamp(-11520), // 8 days from now
  });

  // Tower 5 - Warning on LIDAR, Error on Thermal (Red overall status) - Central Hub (center)
  const tower5Lidar = createHardwareUnit('Tower5', HARDWARE_TYPES.LIDAR, KPIStatus.WARNING, 60);
  const tower5Thermal = createHardwareUnit('Tower5', HARDWARE_TYPES.Thermal, KPIStatus.ERROR, 240);
  const tower5Camera = createHardwareUnit('Tower5', HARDWARE_TYPES.Camera, KPIStatus.SUCCESS, 4);
  const tower5Probes = createHardwareUnit('Tower5', HARDWARE_TYPES.Probes, KPIStatus.SUCCESS, 10);

  towers.push({
    id: TOWER_IDS[4],
    name: 'Tower 5 - Central Hub',
    color: TOWER_COLORS.Tower5,
    status: calculateTowerStatus([tower5Lidar, tower5Thermal, tower5Camera, tower5Probes]),
    lidar: tower5Lidar,
    thermalCamera: tower5Thermal,
    camera: tower5Camera,
    probes: tower5Probes,
    location: {
      latitude: -23.5498,
      longitude: 46.6320,
      elevation: 265.0,
    },
    // Normalized position: center of point cloud
    worldPosition: {
      x: 0.5,
      y: 0.6,
      z: 0.4,
    },
    lastMaintenance: getTimestamp(2880), // 2 days ago
    nextMaintenance: getTimestamp(-5760), // 4 days from now
  });

  return towers;
};

/**
 * Cached tower installations data
 */
let cachedTowers: TowerInstallation[] | null = null;

/**
 * Returns the placeholder tower installation data array
 * Uses caching to ensure consistent data across component renders
 *
 * @returns Array of TowerInstallation objects for the installations panel
 */
export const getTowerInstallations = (): TowerInstallation[] => {
  if (!cachedTowers) {
    cachedTowers = createTowerInstallations();
  }
  return cachedTowers;
};

/**
 * Returns a specific tower by ID
 *
 * @param towerId - The tower identifier (e.g., 'Tower1')
 * @returns TowerInstallation object or undefined if not found
 */
export const getTowerById = (towerId: string): TowerInstallation | undefined => {
  return getTowerInstallations().find((tower) => tower.id === towerId);
};

/**
 * Returns towers filtered by status
 *
 * @param status - The KPI status to filter by
 * @returns Filtered array of TowerInstallation objects
 */
export const getTowersByStatus = (status: KPIStatus): TowerInstallation[] => {
  return getTowerInstallations().filter((tower) => tower.status === status);
};

/**
 * Returns count of towers with each status
 *
 * @returns Object with counts for each status type
 */
export const getTowerStatusCounts = (): Record<string, number> => {
  const towers = getTowerInstallations();
  return {
    operational: towers.filter((t) => t.status === KPIStatus.SUCCESS).length,
    warning: towers.filter((t) => t.status === KPIStatus.WARNING).length,
    error: towers.filter((t) => t.status === KPIStatus.ERROR).length,
    offline: towers.filter((t) => t.status === KPIStatus.UNKNOWN).length,
    total: towers.length,
  };
};

/**
 * Returns all hardware units across all towers with issues (non-success status)
 *
 * @returns Array of objects containing tower info and problematic hardware
 */
export const getHardwareWithIssues = (): Array<{
  towerId: string;
  towerName: string;
  hardware: HardwareUnit;
  hardwareType: string;
}> => {
  const issues: Array<{
    towerId: string;
    towerName: string;
    hardware: HardwareUnit;
    hardwareType: string;
  }> = [];

  getTowerInstallations().forEach((tower) => {
    const hardwareUnits = [
      { unit: tower.lidar, type: HARDWARE_TYPES.LIDAR },
      { unit: tower.thermalCamera, type: HARDWARE_TYPES.Thermal },
      { unit: tower.camera, type: HARDWARE_TYPES.Camera },
      { unit: tower.probes, type: HARDWARE_TYPES.Probes },
    ];

    hardwareUnits.forEach(({ unit, type }) => {
      if (unit.status !== KPIStatus.SUCCESS) {
        issues.push({
          towerId: tower.id,
          towerName: tower.name,
          hardware: unit,
          hardwareType: type,
        });
      }
    });
  });

  return issues;
};

/**
 * Clears the cached tower data (useful for testing or refreshing data)
 */
export const clearTowerCache = (): void => {
  cachedTowers = null;
};

export default getTowerInstallations;
