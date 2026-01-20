/**
 * useAnnotations Hook
 *
 * Description:
 * A React hook that integrates the Custom Pointcloud Renderer's annotation system
 * with the Mine Demo application. Creates and manages annotations for tower installations,
 * data points, and tracked vehicles that are rendered directly on the point cloud using
 * 3D markers and CSS2D labels. Supports grouping annotations (towers, data, tracking)
 * and showing/hiding based on active tab.
 *
 * Sample Input:
 * const { selectedAnnotation, updateAnnotations, isInitialized } = useAnnotations({
 *   isPointCloudLoaded: true,
 *   towers: getTowerInstallations(),
 *   dataAnnotations: getDataAnnotations(),
 *   trackedVehicles: getTrackedVehicles(),
 *   activeTab: 'tracking',
 *   onAnnotationSelect: (annotation) => setSelectedAnnotation(annotation)
 * });
 *
 * Expected Output:
 * - Annotations rendered at tower, data point, and vehicle positions on the point cloud
 * - Tower annotations visible only when 'installations' tab is active
 * - Data annotations visible only when 'data' tab is active
 * - Vehicle annotations visible only when 'tracking' tab is active
 * - Click handling to select annotations and open corresponding panel
 * - updateAnnotations function to call in render loop
 */

import { useEffect, useRef, useCallback, useState } from 'react';
import type { TowerInstallation, TrackedVehicle } from '@/types/kpi';
import type { AnnotationInput } from '@/components/pointcloud/OnClickDataPanel';
import type { DataAnnotation } from '@/data/dataAnnotationsData';
import { VEHICLE_COLORS } from '@/utils/constants';

/** Annotation group identifiers */
export const ANNOTATION_GROUPS = {
  TOWERS: 'towers',
  DATA: 'data',
  TRACKING: 'tracking',
} as const;

/** Tab identifiers that map to annotation groups */
export type TabId = 'data' | 'installations' | 'events' | 'tracking';

/**
 * Options for the useAnnotations hook
 */
interface UseAnnotationsOptions {
  /** Whether the point cloud has finished loading */
  isPointCloudLoaded: boolean;
  /** Array of tower installations to create annotations for */
  towers: TowerInstallation[];
  /** Array of data annotations to create */
  dataAnnotations?: DataAnnotation[];
  /** Array of tracked vehicles to create annotations for */
  trackedVehicles?: TrackedVehicle[];
  /** Currently active tab - determines which annotation group is visible */
  activeTab?: TabId;
  /** Callback when an annotation is clicked/selected */
  onAnnotationSelect?: (annotation: AnnotationInput | null) => void;
  /** Container element for handling click events */
  containerRef?: React.RefObject<HTMLDivElement | null>;
}

/**
 * Return type for the useAnnotations hook
 */
interface UseAnnotationsReturn {
  /** Currently selected annotation (if any) */
  selectedAnnotation: AnnotationInput | null;
  /** Function to call in render loop to update annotation positions */
  updateAnnotations: () => void;
  /** Whether the annotation system has been initialized */
  isInitialized: boolean;
  /** Clear all annotations and reset state */
  clearAllAnnotations: () => void;
  /** Deselect the current annotation */
  deselectAnnotation: () => void;
}

/**
 * Converts a TowerInstallation to AnnotationInput format for the data panel
 */
function towerToAnnotationInput(tower: TowerInstallation): AnnotationInput {
  const towerDescription = tower.name.split(' - ')[1] || 'Tower installation';
  return {
    id: tower.id,
    label: tower.name,
    text: tower.name,
    position: tower.worldPosition || { x: 0, y: 0, z: 0 },
    type: 'installation',
    color: tower.color,
    metadata: {
      description: `${towerDescription} - Status: ${tower.status}`,
      towerId: tower.id,
    },
  };
}

/**
 * Converts a DataAnnotation to AnnotationInput format for the data panel
 */
function dataAnnotationToAnnotationInput(dataAnnotation: DataAnnotation): AnnotationInput {
  return {
    id: dataAnnotation.id,
    label: dataAnnotation.name,
    text: dataAnnotation.name,
    position: dataAnnotation.worldPosition,
    type: dataAnnotation.type,
    color: dataAnnotation.color,
    metadata: {
      description: dataAnnotation.description,
      annotationType: dataAnnotation.type,
    },
  };
}

/**
 * Converts a TrackedVehicle to AnnotationInput format for the data panel
 */
function vehicleToAnnotationInput(vehicle: TrackedVehicle): AnnotationInput {
  const vehicleColor = VEHICLE_COLORS[vehicle.vehicleType] || '#94a3b8';
  return {
    id: vehicle.id,
    label: vehicle.name,
    text: vehicle.name,
    position: vehicle.position,
    type: 'vehicle',
    color: vehicleColor,
    metadata: {
      description: `${vehicle.name} - ${vehicle.vehicleType} (${vehicle.status})${vehicle.operator ? ` - Operator: ${vehicle.operator}` : ''}`,
      vehicleId: vehicle.id,
      vehicleType: vehicle.vehicleType,
      status: vehicle.status,
      operator: vehicle.operator,
      speed: vehicle.speed,
      heading: vehicle.heading,
      fuelLevel: vehicle.fuelLevel,
    },
  };
}

// Note: normalizedToWorldPosition is no longer needed since addAnnotation
// now handles finding the nearest actual point from X,Z coordinates directly.

/**
 * Type for the addAnnotation function from the renderer
 * Updated signature: addAnnotation(pointIndex, text, color, worldPosition, options)
 * When worldPosition is provided, it finds the nearest actual point in geometry
 */
type AddAnnotationFn = (
  pointIndex: number,
  text: string,
  color?: string,
  worldPosition?: { x: number; y: number; z: number } | null,
  options?: { useTopmost?: boolean; group?: string; visible?: boolean }
) => unknown;

/**
 * Type for the setAnnotationGroupVisible function from the renderer
 */
type SetAnnotationGroupVisibleFn = (group: string, visible: boolean) => void;

/**
 * useAnnotations - Hook for managing point cloud annotations
 *
 * Features:
 * - Creates 3D annotations attached to point cloud positions
 * - Converts tower installation data to annotation markers
 * - Converts data annotations to annotation markers
 * - Converts tracked vehicles to annotation markers
 * - Groups annotations by type (towers, data, tracking) for visibility control
 * - Shows/hides annotation groups based on active tab
 * - Handles click events to select annotations
 * - Provides updateAnnotations function for render loop integration
 * - Labels track with the point cloud as it rotates/zooms
 */
export function useAnnotations({
  isPointCloudLoaded,
  towers,
  dataAnnotations = [],
  trackedVehicles = [],
  activeTab = 'data',
  onAnnotationSelect,
  containerRef,
}: UseAnnotationsOptions): UseAnnotationsReturn {
  const [selectedAnnotation, setSelectedAnnotation] = useState<AnnotationInput | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Store tower mapping for click detection (keyed by name for label matching)
  const towerPointIndexMapRef = useRef<Map<string, TowerInstallation>>(new Map());
  // Store data annotation mapping for click detection (keyed by name for label matching)
  const dataAnnotationMapRef = useRef<Map<string, DataAnnotation>>(new Map());
  // Store vehicle mapping for click detection (keyed by name for label matching)
  const vehicleMapRef = useRef<Map<string, TrackedVehicle>>(new Map());
  // Store annotation module references
  const annotationModuleRef = useRef<{
    addAnnotation: AddAnnotationFn;
    clearAnnotations: () => void;
    updateAnnotationMarkers: () => void;
    onAnnotationChange: (callback: (annotations: unknown[]) => void) => void;
    getData: () => { bounds: { min: { x: number; y: number; z: number }; max: { x: number; y: number; z: number } } } | null;
    initLabelRenderer?: () => void;
    setLabelRendererContainer?: (container: HTMLElement) => void;
    resizeLabelRenderer?: () => void;
    setAnnotationGroupVisible?: SetAnnotationGroupVisibleFn;
  } | null>(null);

  // Track if annotations have been created to avoid duplicates
  const annotationsCreatedRef = useRef(false);
  // Track the last active tab to detect changes
  const lastActiveTabRef = useRef<TabId | null>(null);

  /**
   * Initialize annotations when point cloud loads
   */
  useEffect(() => {
    if (!isPointCloudLoaded || annotationsCreatedRef.current) {
      return;
    }

    const initializeAnnotations = async () => {
      try {
        // Dynamic import to avoid SSR issues
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const rendererModule = await import('custom-pointcloud-renderer') as any;

        const {
          addAnnotation,
          clearAnnotations,
          updateAnnotationMarkers,
          onAnnotationChange,
          getData,
          setLabelRendererContainer,
          resizeLabelRenderer,
          setAnnotationGroupVisible,
        } = rendererModule;

        annotationModuleRef.current = {
          addAnnotation: addAnnotation as AddAnnotationFn,
          clearAnnotations,
          updateAnnotationMarkers,
          onAnnotationChange,
          getData,
          setLabelRendererContainer,
          resizeLabelRenderer,
          setAnnotationGroupVisible: setAnnotationGroupVisible as SetAnnotationGroupVisibleFn,
        };

        console.log('[useAnnotations] Renderer module imported successfully');

        // Set the label renderer container to ensure CSS2D labels are positioned correctly
        // This prevents lag when the viewer is embedded in a container
        const container = containerRef?.current;
        if (container && setLabelRendererContainer) {
          setLabelRendererContainer(container);
          console.log('[useAnnotations] Label renderer container set');
        }

        // Get point cloud data for bounds
        const data = getData();
        if (!data?.bounds) {
          console.warn('[useAnnotations] Point cloud data not available yet');
          return;
        }

        const bounds = data.bounds;
        console.log('[useAnnotations] Point cloud bounds:', bounds);

        // Clear any existing annotations
        clearAnnotations();
        towerPointIndexMapRef.current.clear();
        dataAnnotationMapRef.current.clear();
        vehicleMapRef.current.clear();

        // Determine initial visibility based on active tab
        const towersVisible = activeTab === 'installations';
        const dataVisible = activeTab === 'data';
        const trackingVisible = activeTab === 'tracking';

        // Create annotations for each tower
        // We convert normalized positions to world X,Z coordinates
        // and let addAnnotation find the nearest ACTUAL point in the geometry.
        // This ensures annotations are attached to real points and move exactly
        // with the point cloud during transforms.
        towers.forEach((tower) => {
          if (!tower.worldPosition) {
            console.warn(`[useAnnotations] Tower ${tower.id} has no worldPosition`);
            return;
          }

          // Convert normalized position (0-1) to world X,Z coordinates
          const worldX = bounds.min.x + tower.worldPosition.x * (bounds.max.x - bounds.min.x);
          const worldZ = bounds.min.z + tower.worldPosition.z * (bounds.max.z - bounds.min.z);
          const targetPosition = { x: worldX, y: 0, z: worldZ };

          // Add annotation with 'towers' group and initial visibility
          const annotation = addAnnotation(
            0, // Will be replaced with actual point index
            tower.name,
            tower.color || '#ff6b6b',
            targetPosition,
            { useTopmost: true, group: ANNOTATION_GROUPS.TOWERS, visible: towersVisible }
          );

          if (annotation) {
            console.log(`[useAnnotations] Created tower annotation for ${tower.name} at target (${worldX.toFixed(2)}, ${worldZ.toFixed(2)}), visible: ${towersVisible}`);
            // Store tower by its name for click detection (we match by label text)
            towerPointIndexMapRef.current.set(tower.name, tower);
          } else {
            console.warn(`[useAnnotations] Failed to create annotation for ${tower.name}`);
          }
        });

        // Create annotations for each data point
        dataAnnotations.forEach((dataAnnotation) => {
          // Convert normalized position (0-1) to world X,Z coordinates
          const worldX = bounds.min.x + dataAnnotation.worldPosition.x * (bounds.max.x - bounds.min.x);
          const worldZ = bounds.min.z + dataAnnotation.worldPosition.z * (bounds.max.z - bounds.min.z);
          const targetPosition = { x: worldX, y: 0, z: worldZ };

          // Add annotation with 'data' group and initial visibility
          const annotation = addAnnotation(
            0, // Will be replaced with actual point index
            dataAnnotation.name,
            dataAnnotation.color,
            targetPosition,
            { useTopmost: true, group: ANNOTATION_GROUPS.DATA, visible: dataVisible }
          );

          if (annotation) {
            console.log(`[useAnnotations] Created data annotation for ${dataAnnotation.name} at target (${worldX.toFixed(2)}, ${worldZ.toFixed(2)}), visible: ${dataVisible}`);
            // Store data annotation by its name for click detection
            dataAnnotationMapRef.current.set(dataAnnotation.name, dataAnnotation);
          } else {
            console.warn(`[useAnnotations] Failed to create data annotation for ${dataAnnotation.name}`);
          }
        });

        // Create annotations for each tracked vehicle
        trackedVehicles.forEach((vehicle) => {
          // Convert normalized position (0-1) to world X,Z coordinates
          const worldX = bounds.min.x + vehicle.position.x * (bounds.max.x - bounds.min.x);
          const worldZ = bounds.min.z + vehicle.position.z * (bounds.max.z - bounds.min.z);
          const targetPosition = { x: worldX, y: 0, z: worldZ };

          // Get vehicle color from constants
          const vehicleColor = VEHICLE_COLORS[vehicle.vehicleType] || '#94a3b8';

          // Add annotation with 'tracking' group and initial visibility
          const annotation = addAnnotation(
            0, // Will be replaced with actual point index
            vehicle.name,
            vehicleColor,
            targetPosition,
            { useTopmost: true, group: ANNOTATION_GROUPS.TRACKING, visible: trackingVisible }
          );

          if (annotation) {
            console.log(`[useAnnotations] Created vehicle annotation for ${vehicle.name} at target (${worldX.toFixed(2)}, ${worldZ.toFixed(2)}), visible: ${trackingVisible}`);
            // Store vehicle by its name for click detection
            vehicleMapRef.current.set(vehicle.name, vehicle);
          } else {
            console.warn(`[useAnnotations] Failed to create vehicle annotation for ${vehicle.name}`);
          }
        });

        // Note: Visibility is now set at creation time via the `visible` option.
        // The calls below are kept as a safety net to ensure consistency.
        setAnnotationGroupVisible(ANNOTATION_GROUPS.TOWERS, towersVisible);
        setAnnotationGroupVisible(ANNOTATION_GROUPS.DATA, dataVisible);
        setAnnotationGroupVisible(ANNOTATION_GROUPS.TRACKING, trackingVisible);
        lastActiveTabRef.current = activeTab;

        annotationsCreatedRef.current = true;
        setIsInitialized(true);
        console.log(`[useAnnotations] Created ${towers.length} tower annotations, ${dataAnnotations.length} data annotations, and ${trackedVehicles.length} vehicle annotations`);
        console.log(`[useAnnotations] Initial visibility - towers: ${towersVisible}, data: ${dataVisible}, tracking: ${trackingVisible}`);
      } catch (err) {
        console.error('[useAnnotations] Error initializing annotations:', err);
      }
    };

    initializeAnnotations();
  }, [isPointCloudLoaded, towers, dataAnnotations, trackedVehicles, activeTab]);

  /**
   * Handle visibility changes when active tab changes
   */
  useEffect(() => {
    // Skip if not initialized or if tab hasn't changed
    if (!isInitialized || !annotationModuleRef.current?.setAnnotationGroupVisible) {
      return;
    }
    if (lastActiveTabRef.current === activeTab) {
      return;
    }

    const { setAnnotationGroupVisible } = annotationModuleRef.current;

    // Show towers only when 'installations' tab is active
    const showTowers = activeTab === 'installations';
    // Show data points only when 'data' tab is active
    const showData = activeTab === 'data';
    // Show vehicles only when 'tracking' tab is active
    const showTracking = activeTab === 'tracking';

    setAnnotationGroupVisible(ANNOTATION_GROUPS.TOWERS, showTowers);
    setAnnotationGroupVisible(ANNOTATION_GROUPS.DATA, showData);
    setAnnotationGroupVisible(ANNOTATION_GROUPS.TRACKING, showTracking);

    lastActiveTabRef.current = activeTab;
    console.log(`[useAnnotations] Tab changed to '${activeTab}' - towers: ${showTowers}, data: ${showData}, tracking: ${showTracking}`);
  }, [activeTab, isInitialized]);

  /**
   * Handle click events on the point cloud container to detect annotation clicks
   */
  useEffect(() => {
    const container = containerRef?.current;
    if (!container || !isInitialized) {
      return;
    }

    const handleClick = (event: MouseEvent) => {
      const modules = annotationModuleRef.current;
      if (!modules) return;

      // Check if we clicked on an annotation label element
      const target = event.target as HTMLElement;
      if (target.classList.contains('annotation-label')) {
        // Find which annotation was clicked by checking the label text
        const labelText = target.textContent;

        // Check tower annotations first
        const tower = towerPointIndexMapRef.current.get(labelText || '');
        if (tower) {
          const annotationInput = towerToAnnotationInput(tower);
          setSelectedAnnotation(annotationInput);
          onAnnotationSelect?.(annotationInput);
          return;
        }

        // Check data annotations
        const dataAnnotation = dataAnnotationMapRef.current.get(labelText || '');
        if (dataAnnotation) {
          const annotationInput = dataAnnotationToAnnotationInput(dataAnnotation);
          setSelectedAnnotation(annotationInput);
          onAnnotationSelect?.(annotationInput);
          return;
        }

        // Check vehicle annotations
        const vehicle = vehicleMapRef.current.get(labelText || '');
        if (vehicle) {
          const annotationInput = vehicleToAnnotationInput(vehicle);
          setSelectedAnnotation(annotationInput);
          onAnnotationSelect?.(annotationInput);
          return;
        }
      }
    };

    // Add click listener to document to catch annotation label clicks
    // (labels are rendered via CSS2DRenderer which may be outside the container)
    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [containerRef, isInitialized, onAnnotationSelect]);

  /**
   * Function to call in render loop to update annotation positions and render labels
   */
  const updateAnnotations = useCallback(() => {
    if (annotationModuleRef.current?.updateAnnotationMarkers) {
      annotationModuleRef.current.updateAnnotationMarkers();
    }
  }, []);

  /**
   * Clear all annotations and reset state
   */
  const clearAllAnnotations = useCallback(() => {
    if (annotationModuleRef.current?.clearAnnotations) {
      annotationModuleRef.current.clearAnnotations();
    }
    towerPointIndexMapRef.current.clear();
    dataAnnotationMapRef.current.clear();
    vehicleMapRef.current.clear();
    annotationsCreatedRef.current = false;
    lastActiveTabRef.current = null;
    setIsInitialized(false);
    setSelectedAnnotation(null);
  }, []);

  /**
   * Deselect the current annotation
   */
  const deselectAnnotation = useCallback(() => {
    setSelectedAnnotation(null);
    onAnnotationSelect?.(null);
  }, [onAnnotationSelect]);

  /**
   * Handle container resize to keep label renderer in sync
   */
  useEffect(() => {
    const container = containerRef?.current;
    if (!container || !isInitialized) {
      return;
    }

    const resizeObserver = new ResizeObserver(() => {
      if (annotationModuleRef.current?.resizeLabelRenderer) {
        annotationModuleRef.current.resizeLabelRenderer();
      }
    });

    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
    };
  }, [containerRef, isInitialized]);

  // Cleanup on unmount
  useEffect(() => {
    // Copy refs to local variables for cleanup function
    const moduleRef = annotationModuleRef;
    const towerMapRef = towerPointIndexMapRef;
    const dataMapRef = dataAnnotationMapRef;
    const vehicleMapRefLocal = vehicleMapRef;
    const createdRef = annotationsCreatedRef;
    const lastTabRef = lastActiveTabRef;

    return () => {
      if (moduleRef.current?.clearAnnotations) {
        moduleRef.current.clearAnnotations();
      }
      towerMapRef.current.clear();
      dataMapRef.current.clear();
      vehicleMapRefLocal.current.clear();
      createdRef.current = false;
      lastTabRef.current = null;
    };
  }, []);

  return {
    selectedAnnotation,
    updateAnnotations,
    isInitialized,
    clearAllAnnotations,
    deselectAnnotation,
  };
}

export type { UseAnnotationsOptions, UseAnnotationsReturn };
