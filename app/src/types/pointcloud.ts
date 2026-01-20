/**
 * Point Cloud Type Definitions
 *
 * Description:
 * Type definitions for point cloud visualization, view modes, configurations,
 * and annotation system used in the Mine Demo Dashboard.
 *
 * Sample Input:
 * - View mode selection: "Height"
 * - Annotation data: { id: "ann-1", position: [100, 50, 200], label: "Risk Zone A" }
 * - Point cloud config: { lasFilePath: "/data/mine.las", colorMode: "RGB" }
 *
 * Expected Output:
 * Type-safe objects and enums for point cloud viewer component integration,
 * ensuring proper data structure for Three.js renderer and annotation system.
 */

// ============================================================================
// Enum Constants
// ============================================================================

/**
 * Available view modes for point cloud visualization.
 * Maps to different color modes in the renderer.
 */
export const ViewMode = {
  /** Default RGB color mode */
  DEFAULT: "default",
  /** Height-based color gradient */
  HEIGHT: "height",
  /** Cracking analysis visualization (requires renderer enhancement) */
  CRACKING: "cracking",
  /** Micro movement detection visualization (requires renderer enhancement) */
  MICRO_MOVEMENTS: "micro_movements",
  /** Risk assessment visualization (requires renderer enhancement) */
  RISK: "risk",
} as const;

export type ViewMode = (typeof ViewMode)[keyof typeof ViewMode];

/**
 * Color modes available in the Custom Pointcloud Renderer.
 * Used internally to map ViewMode to actual renderer capabilities.
 */
export const ColorMode = {
  RGB: "RGB",
  /** Neutral gray coloring (uniform) */
  GRAY: "Gray",
  HEIGHT: "Height",
  INTENSITY: "Intensity",
  CLASSIFICATION: "Classification",
  /** Cracking analysis with risk-based color palette for classifications 0-4 */
  CRACKING: "Cracking",
} as const;

export type ColorMode = (typeof ColorMode)[keyof typeof ColorMode];

/**
 * Optimizer downsampling modes for performance control.
 * - 'fps': Adaptive downsampling based on frame rate target
 * - 'zoom': Downsampling based on camera zoom level
 */
export const OptimizerMode = {
  /** Adaptive downsampling to maintain target FPS */
  FPS: "fps",
  /** Downsampling based on camera zoom level */
  ZOOM: "zoom",
} as const;

export type OptimizerMode = (typeof OptimizerMode)[keyof typeof OptimizerMode];

/**
 * Classification filter for point visibility.
 * Array of classification values to show, or null to show all points.
 * Example: [0, 1, 2, 3, 4] shows only points with these classification values.
 */
export type ClassificationFilter = number[] | null;

/**
 * Classification color range for filtered classification coloring.
 * Specifies min/max classification values to color; points outside get neutral gray.
 * Example: { min: 0, max: 4 } colors only classifications 0-4.
 */
export interface ClassificationColorRange {
  /** Minimum classification value (inclusive) */
  min: number;
  /** Maximum classification value (inclusive) */
  max: number;
}

/**
 * Types of annotations for different use cases.
 */
export const AnnotationType = {
  /** General risk zone marker */
  RISK_ZONE: "risk_zone",
  /** Hardware installation location */
  INSTALLATION: "installation",
  /** Historical event location */
  PAST_EVENT: "past_event",
  /** Tracked vehicle or machinery */
  TRACKED_VEHICLE: "tracked_vehicle",
  /** Area of interest for analysis */
  AOI: "area_of_interest",
  /** Custom user-defined marker */
  CUSTOM: "custom",
} as const;

export type AnnotationType = (typeof AnnotationType)[keyof typeof AnnotationType];

/**
 * Types of vehicles that can be tracked.
 */
export const VehicleType = {
  DUMP_TRUCK: "dump_truck",
  EXCAVATOR: "excavator",
  LOADER: "loader",
  DRILL_RIG: "drill_rig",
  BULLDOZER: "bulldozer",
  CRANE: "crane",
  OTHER: "other",
} as const;

export type VehicleType = (typeof VehicleType)[keyof typeof VehicleType];

// ============================================================================
// Configuration Interfaces
// ============================================================================

/**
 * Configuration for initializing the point cloud viewer.
 */
export interface PointCloudConfig {
  /** Path to the LAS/LAZ file in /public/data directory */
  lasFilePath: string;
  /** Initial color mode for rendering */
  colorMode?: ColorMode;
  /** Initial view mode for the viewer */
  viewMode?: ViewMode;
  /** Enable performance optimization */
  enableOptimizer?: boolean;
  /** Target frames per second for adaptive downsampling */
  targetFPS?: number;
  /** Camera initial position [x, y, z] */
  cameraPosition?: [number, number, number];
  /** Camera look-at target [x, y, z] */
  cameraTarget?: [number, number, number];
}

// ============================================================================
// Coordinate Types
// ============================================================================

/** 3D position coordinates in point cloud space [x, y, z] */
export type Position3D = [number, number, number];

/** 3D rotation angles in radians [x, y, z] */
export type Rotation3D = [number, number, number];

/** 2D position coordinates for screen space [x, y] */
export type Position2D = [number, number];

// ============================================================================
// Annotation Interfaces
// ============================================================================

/**
 * Annotation marker on the point cloud.
 * Represents points of interest with labels and associated data.
 */
export interface Annotation {
  /** Unique identifier for the annotation */
  id: string;
  /** Display label shown on the annotation */
  label: string;
  /** 3D position in point cloud coordinate system */
  position: Position3D;
  /** Type of annotation for visual styling */
  type?: AnnotationType;
  /** Additional metadata associated with the annotation */
  metadata?: AnnotationMetadata;
  /** Whether the annotation is currently visible */
  visible?: boolean;
  /** Whether the annotation is currently selected */
  selected?: boolean;
}

/**
 * Metadata associated with an annotation.
 * Flexible structure for various data types.
 */
export interface AnnotationMetadata {
  /** Description or notes about the annotation */
  description?: string;
  /** Timestamp of creation or relevance */
  timestamp?: Date | string;
  /** Severity level (1-5, where 5 is highest) */
  severity?: number;
  /** Related data such as KPI values */
  data?: Record<string, unknown>;
  /** Color override for the annotation marker */
  color?: string;
  /** Associated icon identifier */
  icon?: string;
}

/**
 * Click event data when an annotation is selected.
 */
export interface AnnotationClickEvent {
  /** The annotation that was clicked */
  annotation: Annotation;
  /** Screen coordinates of the click */
  screenPosition: Position2D;
  /** 3D position in world space */
  worldPosition: Position3D;
  /** Timestamp of the click event */
  timestamp: number;
}

// ============================================================================
// Viewer State Interfaces
// ============================================================================

/**
 * Camera state in the 3D viewer.
 */
export interface CameraState {
  /** Camera position in 3D space */
  position: Position3D;
  /** Point the camera is looking at */
  target: Position3D;
  /** Distance from target */
  distance: number;
  /** Field of view in degrees */
  fov: number;
  /** Camera rotation angles in radians */
  rotation: Rotation3D;
}

/**
 * Point cloud rendering statistics for performance monitoring.
 */
export interface PointCloudStats {
  /** Total number of points in the point cloud */
  totalPoints: number;
  /** Number of points currently rendered */
  renderedPoints: number;
  /** Current frames per second */
  fps: number;
  /** Memory usage in MB */
  memoryUsage?: number;
  /** Last update timestamp */
  lastUpdate: number;
}

// ============================================================================
// Vehicle and Tracking Interfaces
// ============================================================================

/**
 * Vehicle mesh overlay for tracking panel.
 */
export interface VehicleMesh {
  /** Unique identifier for the vehicle */
  id: string;
  /** Display name of the vehicle */
  name: string;
  /** Type of vehicle (truck, excavator, etc.) */
  type: VehicleType;
  /** Current position in 3D space */
  position: Position3D;
  /** Rotation angles in radians */
  rotation: Rotation3D;
  /** Scale factor for the mesh */
  scale?: number;
  /** Color for the vehicle marker */
  color: string;
  /** Whether the vehicle is currently active */
  active: boolean;
  /** Last update timestamp */
  lastUpdate: Date | string;
}

// ============================================================================
// Historical Data Interfaces
// ============================================================================

/**
 * Historical comparison data for past events.
 */
export interface HistoricalComparison {
  /** Unique identifier for the comparison */
  id: string;
  /** Display name of the historical event */
  name: string;
  /** Date of the historical event */
  eventDate: Date | string;
  /** Path to the historical LAS file */
  lasFilePath: string;
  /** Similarity percentage to current terrain (0-100) */
  similarity: number;
  /** Type of event that occurred */
  eventType: string;
  /** Description of the event */
  description?: string;
}

/**
 * Point cloud difference visualization data.
 * Used for comparing current terrain with historical data.
 */
export interface PointCloudDiff {
  /** Areas where terrain increased (growth) */
  additions: Position3D[];
  /** Areas where terrain decreased (erosion) */
  removals: Position3D[];
  /** Areas with minimal change */
  unchanged: Position3D[];
  /** Maximum displacement detected */
  maxDisplacement: number;
  /** Comparison timestamp */
  timestamp: Date | string;
}
