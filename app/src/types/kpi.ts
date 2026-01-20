/**
 * KPI (Key Performance Indicator) Type Definitions
 *
 * Description:
 * Type definitions for all KPI cards displayed in the Quick Overview page,
 * including hardware status indicators and weather condition data.
 *
 * Sample Input:
 * - Hardware KPI: { title: "Towers Online", value: "4/5", status: "warning", lastUpdated: "2026-01-18T10:30:00Z" }
 * - Weather KPI: { title: "Temperature", value: "23", unit: "°C", icon: "Thermometer" }
 *
 * Expected Output:
 * Type-safe KPI card data structures for consistent rendering across the dashboard,
 * supporting both hardware monitoring and weather condition displays.
 */

// ============================================================================
// Enum Constants
// ============================================================================

/**
 * Status levels for KPI cards.
 * Determines visual styling and urgency indication.
 */
export const KPIStatus = {
  /** System operating normally */
  SUCCESS: "success",
  /** Warning condition detected */
  WARNING: "warning",
  /** Error or critical condition */
  ERROR: "error",
  /** Informational status */
  INFO: "info",
  /** Status unknown or unavailable */
  UNKNOWN: "unknown",
} as const;

export type KPIStatus = (typeof KPIStatus)[keyof typeof KPIStatus];

/**
 * Trend direction for KPI values.
 */
export const TrendDirection = {
  /** Value increasing */
  UP: "up",
  /** Value decreasing */
  DOWN: "down",
  /** Value stable */
  STABLE: "stable",
} as const;

export type TrendDirection = (typeof TrendDirection)[keyof typeof TrendDirection];

/**
 * Types of hardware monitored in the system.
 */
export const HardwareType = {
  TOWER: "tower",
  SERVER: "server",
  MODEL: "model",
  LIDAR: "lidar",
  THERMAL_CAMERA: "thermal_camera",
  CAMERA: "camera",
  PROBE: "probe",
} as const;

export type HardwareType = (typeof HardwareType)[keyof typeof HardwareType];

/**
 * Weather condition categories for contextual information.
 */
export const WeatherCondition = {
  CLEAR: "clear",
  CLOUDY: "cloudy",
  RAINY: "rainy",
  STORMY: "stormy",
  SNOWY: "snowy",
  FOGGY: "foggy",
  WINDY: "windy",
} as const;

export type WeatherCondition = (typeof WeatherCondition)[keyof typeof WeatherCondition];

/**
 * Types of KPI strips for organizing different data categories.
 */
export const KPIStripType = {
  HARDWARE: "hardware",
  WEATHER: "weather",
  OPERATIONS: "operations",
  SAFETY: "safety",
  CUSTOM: "custom",
} as const;

export type KPIStripType = (typeof KPIStripType)[keyof typeof KPIStripType];

/**
 * Comparison operators for threshold evaluation.
 */
export const ThresholdOperator = {
  GREATER_THAN: "gt",
  LESS_THAN: "lt",
  EQUAL_TO: "eq",
  NOT_EQUAL_TO: "neq",
  GREATER_THAN_OR_EQUAL: "gte",
  LESS_THAN_OR_EQUAL: "lte",
} as const;

export type ThresholdOperator = (typeof ThresholdOperator)[keyof typeof ThresholdOperator];

/**
 * Event types for past geological events.
 * Used to categorize historical incidents in the mine.
 */
export const EventType = {
  /** Rock mass detachment from slope face */
  ROCKFALL: "rockfall",
  /** Large-scale slope failure */
  LANDSLIDE: "landslide",
  /** Ground surface settling or sinking */
  SUBSIDENCE: "subsidence",
  /** Gradual wearing away of material */
  EROSION: "erosion",
} as const;

export type EventTypeValue = (typeof EventType)[keyof typeof EventType];

// ============================================================================
// Common Types
// ============================================================================

/** Geographic coordinates with elevation */
export interface GeoLocation {
  latitude: number;
  longitude: number;
  elevation: number;
}

/** 3D position in world/point cloud space */
export interface WorldPosition {
  x: number;
  y: number;
  z: number;
}

/** Numeric range with min and max bounds */
export interface NumericRange {
  min: number;
  max: number;
}

// ============================================================================
// Base KPI Interfaces
// ============================================================================

/**
 * Base KPI card data structure.
 * Used for hardware status and general metrics.
 */
export interface KPICard {
  /** Unique identifier for the KPI card */
  id: string;
  /** Display title of the KPI */
  title: string;
  /** Current value or status */
  value: string | number;
  /** Optional unit of measurement */
  unit?: string;
  /** Status indicator for visual feedback */
  status?: KPIStatus;
  /** Icon identifier from Lucide icons */
  icon?: string;
  /** Timestamp of last data update */
  lastUpdated: Date | string;
  /** Optional description or tooltip text */
  description?: string;
  /** Optional trend indicator */
  trend?: TrendDirection;
  /** Optional previous value for comparison */
  previousValue?: string | number;
}

// ============================================================================
// Hardware Interfaces
// ============================================================================

/**
 * Individual hardware unit status.
 */
export interface HardwareUnit {
  /** Unique identifier for the unit */
  id: string;
  /** Display name of the unit */
  name: string;
  /** Current operational status */
  status: KPIStatus;
  /** Last communication timestamp */
  lastContact: Date | string;
  /** Optional location information */
  location?: string;
  /** Additional metadata */
  metadata?: Record<string, unknown>;
}

/**
 * Hardware-specific KPI data.
 * Used for monitoring towers, servers, and models.
 */
export interface HardwareKPI extends KPICard {
  /** Type of hardware being monitored */
  hardwareType: HardwareType;
  /** Number of online units */
  onlineCount?: number;
  /** Total number of units */
  totalCount?: number;
  /** Detailed status for each unit */
  units?: HardwareUnit[];
  /** System health percentage (0-100) */
  healthPercentage?: number;
}

// ============================================================================
// Weather Interfaces
// ============================================================================

/**
 * Weather-specific KPI data.
 * Used for displaying environmental conditions.
 */
export interface WeatherKPI {
  /** Unique identifier for the weather metric */
  id: string;
  /** Display title (e.g., "Temperature", "Humidity") */
  title: string;
  /** Current measurement value */
  value: number;
  /** Unit of measurement */
  unit: string;
  /** Icon identifier from Lucide icons */
  icon: string;
  /** Optional description */
  description?: string;
  /** Timestamp of measurement */
  timestamp?: Date | string;
  /** Weather condition category */
  condition?: WeatherCondition;
  /** Min/max range for the day */
  range?: NumericRange;
}

// ============================================================================
// Container Interfaces
// ============================================================================

/**
 * Container for a strip of KPI cards.
 */
export interface KPIStrip {
  /** Unique identifier for the strip */
  id: string;
  /** Display title for the strip section */
  title: string;
  /** Type of KPIs in this strip */
  type: KPIStripType;
  /** Array of KPI cards to display */
  cards: KPICard[] | WeatherKPI[];
  /** Optional description for the strip */
  description?: string;
  /** Last update timestamp for the entire strip */
  lastUpdated: Date | string;
}

/**
 * Weather data aggregate for comprehensive environmental monitoring.
 */
export interface WeatherData {
  /** Temperature in Celsius */
  temperature: WeatherKPI;
  /** Humidity percentage */
  humidity: WeatherKPI;
  /** Wind speed */
  windSpeed: WeatherKPI;
  /** Precipitation amount */
  precipitation: WeatherKPI;
  /** Atmospheric pressure */
  pressure: WeatherKPI;
  /** Visibility distance */
  visibility: WeatherKPI;
  /** Overall weather condition */
  condition: WeatherCondition;
  /** Timestamp of weather data collection */
  timestamp: Date | string;
}

/**
 * Hardware system overview for monitoring dashboard health.
 */
export interface HardwareOverview {
  /** Tower installations monitoring */
  towers: HardwareKPI;
  /** Server status monitoring */
  server: HardwareKPI;
  /** Analysis model status */
  model: HardwareKPI;
  /** Overall system health (0-100) */
  systemHealth: number;
  /** Total number of active alerts */
  activeAlerts: number;
  /** Last system check timestamp */
  lastChecked: Date | string;
}

// ============================================================================
// Tower Installation Interfaces
// ============================================================================

/**
 * Tower installation details for monitoring hardware at specific locations.
 */
export interface TowerInstallation {
  /** Unique identifier for the tower */
  id: string;
  /** Display name of the tower */
  name: string;
  /** Color code for visual identification */
  color: string;
  /** Overall tower status */
  status: KPIStatus;
  /** LIDAR system status */
  lidar: HardwareUnit;
  /** Thermal camera status */
  thermalCamera: HardwareUnit;
  /** Regular camera status */
  camera: HardwareUnit;
  /** Ground probe sensors status */
  probes: HardwareUnit;
  /** Physical location coordinates */
  location?: GeoLocation;
  /** 3D world position for point cloud annotation */
  worldPosition?: WorldPosition;
  /** Last maintenance date */
  lastMaintenance?: Date | string;
  /** Next scheduled maintenance */
  nextMaintenance?: Date | string;
}

// ============================================================================
// Threshold Configuration
// ============================================================================

/**
 * KPI threshold configuration for alert generation.
 */
export interface KPIThreshold {
  /** Metric identifier */
  metricId: string;
  /** Warning threshold value */
  warningThreshold: number;
  /** Error/critical threshold value */
  errorThreshold: number;
  /** Comparison operator */
  operator: ThresholdOperator;
  /** Whether threshold is currently enabled */
  enabled: boolean;
}

// ============================================================================
// Past Events Interfaces
// ============================================================================

/**
 * Past event interface for historical geological events.
 * Used to display similar past incidents in the Past Events Panel.
 */
export interface PastEvent {
  /** Unique identifier for the event */
  id: string;
  /** Display name of the event */
  name: string;
  /** Type of geological event */
  eventType: EventTypeValue;
  /** Date when the event occurred */
  date: Date | string;
  /** Location description within the mine */
  location: string;
  /** Similarity percentage to current conditions (0-100) */
  similarityPercentage: number;
  /** Optional detailed description of the event */
  description?: string;
  /** Optional affected area in square meters */
  affectedArea?: number;
  /** Optional severity classification */
  severity?: KPIStatus;
}

// ============================================================================
// Vehicle Tracking Interfaces
// ============================================================================

/**
 * Vehicle type values for tracked equipment.
 * Used for categorizing mining vehicles on the tracking panel.
 */
export const VehicleType = {
  HAUL_TRUCK: 'haul_truck',
  EXCAVATOR: 'excavator',
  DOZER: 'dozer',
  WATER_TRUCK: 'water_truck',
  LIGHT_VEHICLE: 'light_vehicle',
} as const;

export type VehicleTypeValue = (typeof VehicleType)[keyof typeof VehicleType];

/**
 * Vehicle operational status values.
 * Determines the current state of a tracked vehicle.
 */
export const VehicleStatus = {
  /** Vehicle is actively operating */
  ACTIVE: 'active',
  /** Vehicle is stationary but operational */
  IDLE: 'idle',
  /** Vehicle is not reporting/communicating */
  OFFLINE: 'offline',
  /** Vehicle is undergoing scheduled or unscheduled maintenance */
  MAINTENANCE: 'maintenance',
} as const;

export type VehicleStatusValue = (typeof VehicleStatus)[keyof typeof VehicleStatus];

/**
 * Tracked vehicle interface for equipment monitoring.
 * Used to display vehicle positions and status in the Tracking Panel.
 */
export interface TrackedVehicle {
  /** Unique identifier for the vehicle */
  id: string;
  /** Display name of the vehicle (e.g., "HT-101") */
  name: string;
  /** Type of vehicle */
  vehicleType: VehicleTypeValue;
  /** Current operational status */
  status: VehicleStatusValue;
  /** Name of the current operator, if assigned */
  operator?: string;
  /** Timestamp of last position/status update */
  lastUpdate: Date | string;
  /** Normalized position within point cloud bounds (0-1 range) */
  position: {
    x: number;
    y: number;
    z: number;
  };
  /** Current speed in km/h */
  speed?: number;
  /** Current heading in degrees (0-360) */
  heading?: number;
  /** Current fuel level as percentage (0-100) */
  fuelLevel?: number;
}
