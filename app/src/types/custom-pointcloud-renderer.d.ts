/**
 * Custom Pointcloud Renderer Type Declarations
 *
 * Description:
 * Type declarations for the custom-pointcloud-renderer npm package. Provides
 * TypeScript type information for the renderer's exported modules and functions.
 *
 * Sample Input:
 * import { scene, camera, renderer } from 'custom-pointcloud-renderer';
 *
 * Expected Output:
 * Properly typed access to the renderer's Three.js scene, camera, renderer,
 * controls, file loading functions, and optimizer instance.
 */

declare module 'custom-pointcloud-renderer' {
  import type { Scene, PerspectiveCamera, WebGLRenderer, ShaderMaterial, Points, BufferGeometry } from 'three';
  import type { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

  /**
   * Three.js Scene instance
   */
  export const scene: Scene;

  /**
   * Three.js PerspectiveCamera instance
   */
  export const camera: PerspectiveCamera;

  /**
   * Three.js WebGLRenderer instance
   */
  export const renderer: WebGLRenderer;

  /**
   * Three.js OrbitControls instance
   */
  export const controls: OrbitControls;

  /**
   * Custom shader material for point cloud rendering
   */
  export const material: ShaderMaterial;

  /**
   * Update the shader time uniform
   */
  export function updateTime(time: number): void;

  /**
   * Set the point scale factor
   */
  export function setPointScale(scale: number): void;

  /**
   * Set Level of Detail distance
   */
  export function setLOD(distance: number): void;

  /**
   * Enable Level of Detail
   */
  export function enableLOD(): void;

  /**
   * Disable Level of Detail
   */
  export function disableLOD(): void;

  /**
   * Get current LOD state
   */
  export function getLODState(): { enabled: boolean; maxDistance: number };

  /**
   * Update frustum planes for GPU culling
   */
  export function updateFrustumPlanes(planes: unknown[]): void;

  /**
   * Enable/disable frustum culling
   */
  export function setFrustumCullingEnabled(enabled: boolean): void;

  /**
   * Point cloud data from LAS file
   */
  interface PointCloudData {
    positions: Float32Array;
    colors: Float32Array;
    intensities?: Float32Array;
    classifications?: Uint8Array;
    pointCount: number;
    hasColor: boolean;
    bounds: {
      min: { x: number; y: number; z: number };
      max: { x: number; y: number; z: number };
    };
    header: {
      versionMajor: number;
      versionMinor: number;
      pointDataFormat: number;
    };
    gridInfo?: {
      dimensions: { x: number; y: number; z: number };
      spacing: { x: number; y: number; z: number };
      min: { x: number; y: number; z: number };
    };
  }

  /**
   * Display a point cloud from loaded data
   */
  export function displayPointCloud(data: PointCloudData): number;

  /**
   * Update point cloud colors based on mode
   * @param mode - Color mode
   * @param classificationRange - Optional classification range for filtered coloring
   */
  export function updateColors(
    mode: 'rgb' | 'gray' | 'height' | 'intensity' | 'classification' | 'cracking',
    classificationRange?: { min: number; max: number } | null
  ): void;

  /**
   * Set classification color range for filtered classification coloring
   * @param range - { min, max } or null to clear
   */
  export function setClassificationColorRange(range: { min: number; max: number } | null): void;

  /**
   * Get current classification color range
   * @returns Current range or null
   */
  export function getClassificationColorRange(): { min: number; max: number } | null;

  /**
   * Get current points mesh
   */
  export function getPoints(): Points | null;

  /**
   * Get current geometry
   */
  export function getGeometry(): BufferGeometry | null;

  /**
   * Get current point cloud data
   */
  export function getData(): PointCloudData | null;

  /**
   * Get current color mode
   */
  export function getColorMode(): string;

  /**
   * Register callback for when point cloud loads
   */
  export function onPointCloudLoad(
    callback: (data: PointCloudData, geometry: BufferGeometry, points: Points) => void
  ): void;

  /**
   * Load a LAS/LAZ file from a URL path
   */
  export function loadFromPath(path: string): Promise<PointCloudData | null>;

  /**
   * Load initial file (first available)
   */
  export function loadInitialFile(): void;

  /**
   * Available files in /public/data/
   */
  export const availableFiles: Array<{ path: string; name: string }>;

  /**
   * LAS file loader instance
   */
  export const loader: {
    maxPoints: number;
    subsample: string | number;
    parseLAS(buffer: ArrayBuffer): PointCloudData;
    parseLAZ(buffer: ArrayBuffer): Promise<PointCloudData>;
  };

  /**
   * Optimizer instance for performance management
   */
  export const optimizer: {
    enabled: boolean;
    enable(): void;
    disable(): void;
    update(camera: PerspectiveCamera, deltaTime: number): void;
    onPointCloudLoaded(data: PointCloudData, geometry: BufferGeometry, points: Points): void;
    getStats(): {
      enabled: boolean;
      visiblePointCount: number;
      totalPointCount: number;
      currentPointCount: number;
      zoomLevel: number;
      currentFPS: number;
      downsamplingMode: string;
      downsamplingFactor: number;
    };
    setDownsamplingMode(mode: 'zoom' | 'fps'): void;
    getDownsamplingMode(): 'zoom' | 'fps';
    getZoomLevel(): number;
    setFPSSettings(settings: { targetFPS?: number; minFPS?: number; maxFPS?: number }): void;
    getFPSSettings(): { targetFPS: number; minFPS: number; maxFPS: number };
    updateColors(): void;
    dispose(): void;
  };

  /**
   * LAS loader class
   */
  export const lasLoader: typeof loader;

  /**
   * Re-exported Three.js namespace
   */
  export * as THREE from 'three';

  /**
   * CSS2DRenderer for rendering HTML labels in 3D space
   */
  export class CSS2DRenderer {
    domElement: HTMLElement;
    constructor();
    setSize(width: number, height: number): void;
    render(scene: Scene, camera: PerspectiveCamera): void;
  }

  /**
   * CSS2DObject for creating HTML elements positioned in 3D space
   */
  export class CSS2DObject {
    element: HTMLElement;
    position: {
      x: number;
      y: number;
      z: number;
      copy(v: { x: number; y: number; z: number }): CSS2DObject['position'];
      add(v: { x: number; y: number; z: number }): CSS2DObject['position'];
      clone(): { x: number; y: number; z: number };
    };
    userData: Record<string, unknown>;
    constructor(element: HTMLElement);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // ANNOTATION SYSTEM
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Annotation data structure
   */
  export interface Annotation {
    /** Unique identifier for the annotation */
    id: number;
    /** Index of the point in the point cloud */
    pointIndex: number;
    /** Annotation text content */
    text: string;
    /** 3D position of the annotation in world coordinates */
    position: { x: number; y: number; z: number };
    /** Color of the annotation marker (hex string) */
    color: string;
    /** ISO timestamp when the annotation was created */
    createdAt: string;
  }

  /**
   * Result from point picking operation
   */
  export interface PickPointResult {
    /** Index of the picked point in the point cloud */
    pointIndex: number;
    /** 3D position of the picked point in world coordinates */
    position: { x: number; y: number; z: number };
  }

  /**
   * Pick a point from the point cloud using normalized mouse coordinates
   * @param mouseX - Normalized mouse X (-1 to 1)
   * @param mouseY - Normalized mouse Y (-1 to 1)
   * @returns Pick result or null if no point found
   */
  export function pickPoint(mouseX: number, mouseY: number): PickPointResult | null;

  /**
   * Add an annotation to a point
   * @param pointIndex - Index of the point
   * @param text - Annotation text
   * @param color - Optional color (hex string, defaults to '#ff6b6b')
   * @param worldPosition - Optional world position (if not provided, calculated from geometry)
   * @returns The created annotation or null if point not found
   */
  export function addAnnotation(
    pointIndex: number,
    text: string,
    color?: string,
    worldPosition?: { x: number; y: number; z: number } | null
  ): Annotation | null;

  /**
   * Remove an annotation by point index
   * @param pointIndex - Index of the annotated point
   */
  export function removeAnnotation(pointIndex: number): void;

  /**
   * Get annotation for a specific point
   * @param pointIndex - Index of the point
   * @returns Annotation or null if not found
   */
  export function getAnnotation(pointIndex: number): Annotation | null;

  /**
   * Get all annotations
   * @returns Array of all annotation objects
   */
  export function getAllAnnotations(): Annotation[];

  /**
   * Update annotation text
   * @param pointIndex - Index of the point
   * @param text - New annotation text
   */
  export function updateAnnotation(pointIndex: number, text: string): void;

  /**
   * Clear all annotations
   */
  export function clearAnnotations(): void;

  /**
   * Update markers when point cloud changes (recreates all markers)
   */
  export function updateMarkers(): void;

  /**
   * Update annotation markers and CSS2D labels
   * Should be called every frame in the render loop
   */
  export function updateAnnotationMarkers(): void;

  /**
   * Get the CSS2D label renderer for rendering labels
   * @returns The CSS2DRenderer instance or null if not initialized
   */
  export function getLabelRenderer(): unknown | null;

  /**
   * Initialize the CSS2D label renderer for annotation overlays
   * Called automatically when first annotation is added, but can be called manually
   */
  export function initLabelRenderer(): void;

  /**
   * Set annotation mode
   * @param mode - 'add' or 'view'
   */
  export function setAnnotationMode(mode: 'add' | 'view'): void;

  /**
   * Get current annotation mode
   * @returns Current mode ('add' or 'view')
   */
  export function getAnnotationMode(): 'add' | 'view';

  /**
   * Register callback for annotation changes
   * @param callback - Called when annotations change with array of all annotations
   */
  export function onAnnotationChange(callback: (annotations: Annotation[]) => void): void;

  /**
   * Set the current file identifier for annotation persistence
   * @param fileId - File identifier (path or filename)
   */
  export function setCurrentFileId(fileId: string): void;

  /**
   * Load annotations from localStorage for the current file
   */
  export function loadAnnotations(): void;

  /**
   * Group containing annotation marker lines
   */
  export const annotationMarkers: unknown;

  /**
   * Map of point indices to annotations
   */
  export const annotations: Map<number, Annotation>;
}
