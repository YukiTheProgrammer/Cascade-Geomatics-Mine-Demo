/**
 * Constants Module
 *
 * Centralized constants for the Mine Demo Dashboard application.
 */

export const STATUS_COLORS = {
  Success: 'bg-green-500',
  Warning: 'bg-yellow-500',
  Error: 'bg-red-500',
  Info: 'bg-blue-500',
} as const;

export const STATUS_TEXT_COLORS = {
  Success: 'text-green-600',
  Warning: 'text-yellow-600',
  Error: 'text-red-600',
  Info: 'text-blue-600',
} as const;

export const STATUS_LABELS = {
  Success: 'Success',
  Warning: 'Warning',
  Error: 'Error',
  Info: 'Info',
} as const;

export type StatusType = keyof typeof STATUS_COLORS;

// =============================================================================
// Activity Configuration
// =============================================================================
// Defines activity types for the activity log system. Each type has an
// associated color for visual distinction in the ActivityRow component.

export const ACTIVITY_TYPES = {
  Scan: 'Scan',
  Alert: 'Alert',
  Sensor: 'Sensor',
  Model: 'Model',
  Human: 'Human',
} as const;

export const ACTIVITY_TYPE_COLORS = {
  Scan: 'bg-purple-100 text-purple-800',
  Alert: 'bg-red-100 text-red-800',
  Sensor: 'bg-blue-100 text-blue-800',
  Model: 'bg-green-100 text-green-800',
  Human: 'bg-gray-100 text-gray-800',
} as const;

export type ActivityType = keyof typeof ACTIVITY_TYPES;

// =============================================================================
// Hardware Configuration
// =============================================================================
// Defines hardware types for tower installations. Used by InstallationsPanel
// and installationsData for monitoring equipment status.

export const HARDWARE_TYPES = {
  LIDAR: 'LIDAR',
  Thermal: 'Thermal',
  Camera: 'Camera',
  Probes: 'Probes',
} as const;

export type HardwareType = keyof typeof HARDWARE_TYPES;

// =============================================================================
// Tower Configuration
// =============================================================================
// Tower identifiers and their associated colors for point cloud visualization.
// Each tower has a unique color for identification on the terrain view.

export const TOWER_IDS = [
  'Tower1',
  'Tower2',
  'Tower3',
  'Tower4',
  'Tower5',
] as const;

export const TOWER_COLORS = {
  Tower1: '#FF6B6B', // Red
  Tower2: '#4ECDC4', // Teal
  Tower3: '#45B7D1', // Blue
  Tower4: '#96CEB4', // Green
  Tower5: '#FFEAA7', // Yellow
} as const;

export type TowerId = (typeof TOWER_IDS)[number];

// =============================================================================
// Weather Configuration
// =============================================================================
// Weather data types and their display units for the WeatherKPI component
// and OnClickDataPanel weather information display.

export const WEATHER_TYPES = {
  Temperature: 'Temperature',
  Precipitation: 'Precipitation',
  WindSpeed: 'Wind Speed',
  WindDirection: 'Wind Direction',
  Humidity: 'Humidity',
  Pressure: 'Pressure',
} as const;

export const WEATHER_UNITS = {
  Temperature: '°C',
  Precipitation: 'mm',
  WindSpeed: 'km/h',
  WindDirection: '°',
  Humidity: '%',
  Pressure: 'hPa',
} as const;

export type WeatherType = keyof typeof WEATHER_TYPES;

// =============================================================================
// Vehicle Configuration
// =============================================================================
// Defines vehicle types for the tracking panel. Used by TrackingPanel
// and trackingData for monitoring equipment positions and status.

/** Vehicle type identifiers */
export const VEHICLE_TYPES = {
  HAUL_TRUCK: 'haul_truck',
  EXCAVATOR: 'excavator',
  DOZER: 'dozer',
  WATER_TRUCK: 'water_truck',
  LIGHT_VEHICLE: 'light_vehicle',
} as const;

/** Vehicle type display colors */
export const VEHICLE_COLORS: Record<string, string> = {
  [VEHICLE_TYPES.HAUL_TRUCK]: '#f59e0b', // amber
  [VEHICLE_TYPES.EXCAVATOR]: '#ef4444', // red
  [VEHICLE_TYPES.DOZER]: '#22c55e', // green
  [VEHICLE_TYPES.WATER_TRUCK]: '#3b82f6', // blue
  [VEHICLE_TYPES.LIGHT_VEHICLE]: '#a855f7', // purple
};

/** Vehicle type display labels */
export const VEHICLE_LABELS: Record<string, string> = {
  [VEHICLE_TYPES.HAUL_TRUCK]: 'Haul Truck',
  [VEHICLE_TYPES.EXCAVATOR]: 'Excavator',
  [VEHICLE_TYPES.DOZER]: 'Dozer',
  [VEHICLE_TYPES.WATER_TRUCK]: 'Water Truck',
  [VEHICLE_TYPES.LIGHT_VEHICLE]: 'Light Vehicle',
};

export type VehicleType = keyof typeof VEHICLE_TYPES;
