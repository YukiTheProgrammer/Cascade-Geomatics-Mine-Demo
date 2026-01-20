/**
 * Data Annotations Data Module
 *
 * Description:
 * Provides data annotation definitions for points of interest on the mine terrain.
 * These annotations represent monitoring points, sensor stations, and analysis zones
 * that are displayed when the "Data" tab is selected in the InformationMenu.
 *
 * Sample Input:
 * import { getDataAnnotations, getDataAnnotationById } from '@/data/dataAnnotationsData';
 * const annotations = getDataAnnotations();
 *
 * Expected Output:
 * An array of DataAnnotation objects with:
 *   - 3 data point annotations with unique colors and positions
 *   - Normalized world positions (0-1 range) mapped to point cloud bounds
 *   - Metadata including descriptions for display in the Data tab
 */

/**
 * Data annotation type for monitoring points and sensor stations
 */
export interface DataAnnotation {
  /** Unique identifier */
  id: string;
  /** Display name for the annotation */
  name: string;
  /** Color for the annotation marker (hex string) */
  color: string;
  /** Type of data point */
  type: 'monitoring' | 'sensor' | 'analysis';
  /** Description for the Data tab display */
  description: string;
  /**
   * Normalized position in the point cloud (0-1 range)
   * x: 0 = min X bound, 1 = max X bound
   * y: 0 = min Y bound, 1 = max Y bound (not used for placement - terrain height is auto-detected)
   * z: 0 = min Z bound, 1 = max Z bound
   */
  worldPosition: {
    x: number;
    y: number;
    z: number;
  };
}

/**
 * Data annotation definitions
 * These represent monitoring and analysis points of interest on the terrain
 */
const dataAnnotations: DataAnnotation[] = [
  {
    id: 'data-monitoring-a',
    name: 'Monitoring Point A',
    color: '#10b981', // emerald-500
    type: 'monitoring',
    description: 'Primary ground movement monitoring station - tracks vertical and horizontal displacement',
    worldPosition: {
      x: 0.3,
      y: 0.5,
      z: 0.25,
    },
  },
  {
    id: 'data-sensor-b',
    name: 'Sensor Station B',
    color: '#3b82f6', // blue-500
    type: 'sensor',
    description: 'Environmental sensor array - measures vibration, temperature, and moisture levels',
    worldPosition: {
      x: 0.65,
      y: 0.5,
      z: 0.35,
    },
  },
  {
    id: 'data-analysis-c',
    name: 'Analysis Zone C',
    color: '#f59e0b', // amber-500
    type: 'analysis',
    description: 'High-risk analysis zone - historical rockfall activity area under continuous observation',
    worldPosition: {
      x: 0.45,
      y: 0.5,
      z: 0.65,
    },
  },
];

/**
 * Returns all data annotations
 * @returns Array of DataAnnotation objects
 */
export const getDataAnnotations = (): DataAnnotation[] => {
  return dataAnnotations;
};

/**
 * Returns a specific data annotation by ID
 * @param id - The annotation identifier
 * @returns DataAnnotation object or undefined if not found
 */
export const getDataAnnotationById = (id: string): DataAnnotation | undefined => {
  return dataAnnotations.find((annotation) => annotation.id === id);
};

export default getDataAnnotations;
