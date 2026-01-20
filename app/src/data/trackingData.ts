/**
 * Tracking Data Module
 *
 * Description:
 * Provides placeholder tracked vehicle data for the Mine Demo Dashboard Tracking Panel.
 * Contains vehicle records for development and demonstration purposes.
 * Vehicles include haul trucks, excavators, dozers, water trucks, and light vehicles
 * with varied statuses and positions across the mine site.
 *
 * Sample Input:
 * import { getTrackedVehicles, getVehicleById, getVehiclesByType } from '@/data/trackingData';
 * const vehicles = getTrackedVehicles();
 * const vehicle1 = getVehicleById('HT-101');
 * const haulTrucks = getVehiclesByType('haul_truck');
 *
 * Expected Output:
 * An array of TrackedVehicle objects with:
 *   - 6 vehicles with unique identifiers
 *   - Varied vehicle types (haul_truck, excavator, dozer, water_truck, light_vehicle)
 *   - Mixed operational statuses (active, idle, offline, maintenance)
 *   - Positions spread across point cloud (normalized 0-1 coordinates)
 *   - Realistic operator names and equipment details
 */

import {
  type TrackedVehicle,
  type VehicleTypeValue,
  type VehicleStatusValue,
  VehicleType,
  VehicleStatus,
} from '../types/kpi';

/**
 * Generates a timestamp N minutes ago from current time
 * @param minutesAgo - Number of minutes before current time
 * @returns ISO string timestamp
 */
const getTimestampMinutesAgo = (minutesAgo: number): string => {
  const now = new Date();
  const pastTime = new Date(now.getTime() - minutesAgo * 60 * 1000);
  return pastTime.toISOString();
};

/**
 * Creates the placeholder tracked vehicles data
 * Includes a mix of vehicle types and operational statuses
 * Positions are normalized (0-1) for point cloud coordinate mapping
 */
const createTrackedVehicles = (): TrackedVehicle[] => {
  const vehicles: TrackedVehicle[] = [];

  // HT-101 - Haul Truck, active, hauling from east pit
  vehicles.push({
    id: 'HT-101',
    name: 'HT-101',
    vehicleType: VehicleType.HAUL_TRUCK,
    status: VehicleStatus.ACTIVE,
    operator: 'J. Smith',
    lastUpdate: getTimestampMinutesAgo(2),
    position: { x: 0.3, y: 0.5, z: 0.4 },
    speed: 28,
    heading: 145,
    fuelLevel: 72,
  });

  // HT-102 - Haul Truck, active, returning to loading zone
  vehicles.push({
    id: 'HT-102',
    name: 'HT-102',
    vehicleType: VehicleType.HAUL_TRUCK,
    status: VehicleStatus.ACTIVE,
    operator: 'M. Jones',
    lastUpdate: getTimestampMinutesAgo(1),
    position: { x: 0.7, y: 0.4, z: 0.6 },
    speed: 35,
    heading: 270,
    fuelLevel: 58,
  });

  // EX-201 - Excavator, active, loading at primary face
  vehicles.push({
    id: 'EX-201',
    name: 'EX-201',
    vehicleType: VehicleType.EXCAVATOR,
    status: VehicleStatus.ACTIVE,
    operator: 'R. Brown',
    lastUpdate: getTimestampMinutesAgo(1),
    position: { x: 0.5, y: 0.6, z: 0.3 },
    speed: 0,
    heading: 90,
    fuelLevel: 64,
  });

  // DZ-05 - Dozer, idle, awaiting next assignment
  vehicles.push({
    id: 'DZ-05',
    name: 'DZ-05',
    vehicleType: VehicleType.DOZER,
    status: VehicleStatus.IDLE,
    operator: undefined,
    lastUpdate: getTimestampMinutesAgo(15),
    position: { x: 0.2, y: 0.3, z: 0.7 },
    speed: 0,
    heading: 180,
    fuelLevel: 45,
  });

  // WT-01 - Water Truck, active, dust suppression route
  vehicles.push({
    id: 'WT-01',
    name: 'WT-01',
    vehicleType: VehicleType.WATER_TRUCK,
    status: VehicleStatus.ACTIVE,
    operator: 'K. Lee',
    lastUpdate: getTimestampMinutesAgo(3),
    position: { x: 0.6, y: 0.5, z: 0.5 },
    speed: 22,
    heading: 320,
    fuelLevel: 81,
  });

  // LV-12 - Light Vehicle, offline (in maintenance bay)
  vehicles.push({
    id: 'LV-12',
    name: 'LV-12',
    vehicleType: VehicleType.LIGHT_VEHICLE,
    status: VehicleStatus.MAINTENANCE,
    operator: undefined,
    lastUpdate: getTimestampMinutesAgo(180), // Last seen 3 hours ago
    position: { x: 0.1, y: 0.2, z: 0.1 },
    speed: 0,
    heading: 0,
    fuelLevel: 92,
  });

  return vehicles;
};

/**
 * Cached tracked vehicles data
 */
let cachedVehicles: TrackedVehicle[] | null = null;

/**
 * Returns the placeholder tracked vehicles data array
 * Uses caching to ensure consistent data across component renders
 *
 * @returns Array of TrackedVehicle objects for the tracking panel
 */
export const getTrackedVehicles = (): TrackedVehicle[] => {
  if (!cachedVehicles) {
    cachedVehicles = createTrackedVehicles();
  }
  return cachedVehicles;
};

/**
 * Returns a specific tracked vehicle by ID
 *
 * @param vehicleId - The vehicle identifier (e.g., 'HT-101')
 * @returns TrackedVehicle object or undefined if not found
 */
export const getVehicleById = (vehicleId: string): TrackedVehicle | undefined => {
  return getTrackedVehicles().find((vehicle) => vehicle.id === vehicleId);
};

/**
 * Returns tracked vehicles filtered by vehicle type
 *
 * @param vehicleType - The vehicle type to filter by
 * @returns Filtered array of TrackedVehicle objects
 */
export const getVehiclesByType = (vehicleType: VehicleTypeValue): TrackedVehicle[] => {
  return getTrackedVehicles().filter((vehicle) => vehicle.vehicleType === vehicleType);
};

/**
 * Returns tracked vehicles filtered by operational status
 *
 * @param status - The vehicle status to filter by
 * @returns Filtered array of TrackedVehicle objects
 */
export const getVehiclesByStatus = (status: VehicleStatusValue): TrackedVehicle[] => {
  return getTrackedVehicles().filter((vehicle) => vehicle.status === status);
};

/**
 * Returns count of vehicles by status
 *
 * @returns Object with counts for each vehicle status
 */
export const getVehicleStatusCounts = (): Record<string, number> => {
  const vehicles = getTrackedVehicles();
  return {
    active: vehicles.filter((v) => v.status === VehicleStatus.ACTIVE).length,
    idle: vehicles.filter((v) => v.status === VehicleStatus.IDLE).length,
    offline: vehicles.filter((v) => v.status === VehicleStatus.OFFLINE).length,
    maintenance: vehicles.filter((v) => v.status === VehicleStatus.MAINTENANCE).length,
    total: vehicles.length,
  };
};

/**
 * Returns count of vehicles by type
 *
 * @returns Object with counts for each vehicle type
 */
export const getVehicleTypeCounts = (): Record<string, number> => {
  const vehicles = getTrackedVehicles();
  return {
    haul_truck: vehicles.filter((v) => v.vehicleType === VehicleType.HAUL_TRUCK).length,
    excavator: vehicles.filter((v) => v.vehicleType === VehicleType.EXCAVATOR).length,
    dozer: vehicles.filter((v) => v.vehicleType === VehicleType.DOZER).length,
    water_truck: vehicles.filter((v) => v.vehicleType === VehicleType.WATER_TRUCK).length,
    light_vehicle: vehicles.filter((v) => v.vehicleType === VehicleType.LIGHT_VEHICLE).length,
    total: vehicles.length,
  };
};

/**
 * Clears the cached vehicles data (useful for testing or refreshing data)
 */
export const clearTrackingCache = (): void => {
  cachedVehicles = null;
};

export default getTrackedVehicles;
