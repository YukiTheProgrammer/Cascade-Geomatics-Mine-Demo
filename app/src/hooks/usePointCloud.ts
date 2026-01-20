/**
 * usePointCloud Hook
 *
 * Description:
 * Integrates the Custom Pointcloud Renderer for displaying LAS/LAZ files in React.
 * Handles initialization, cleanup, and provides controls for color modes and camera access.
 *
 * Sample Input:
 * usePointCloud({ containerRef, lasFilePath: '/data/mine.las', colorMode: 'RGB' })
 *
 * Expected Output:
 * { isLoading, error, stats, changeColorMode, getCamera, getControls, ... }
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import type { RefObject } from 'react';
import type { ColorMode, PointCloudStats, OptimizerMode, ClassificationColorRange } from '@/types/pointcloud';

interface UsePointCloudOptions {
  containerRef: RefObject<HTMLDivElement | null>;
  lasFilePath: string;
  colorMode?: ColorMode;
  onStatsUpdate?: (stats: PointCloudStats) => void;
  enableOptimizer?: boolean;
  onRenderFrame?: () => void;
  /** Classification values to show (null = show all points) */
  classificationFilter?: number[] | null;
  /** Classification color range for filtered coloring (null = color all classifications) */
  classificationColorRange?: ClassificationColorRange | null;
}

interface UsePointCloudReturn {
  isLoading: boolean;
  error: string | null;
  stats: PointCloudStats | null;
  changeColorMode: (mode: ColorMode) => void;
  getCamera: () => unknown;
  getControls: () => unknown;
  getStats: () => PointCloudStats | null;
  setOptimizerMode: (mode: OptimizerMode) => void;
  getOptimizerMode: () => OptimizerMode;
  enableOptimizer: () => void;
  disableOptimizer: () => void;
  isOptimizerEnabled: () => boolean;
}

interface RendererModules {
  // NOTE: This module is provided by a locally bundled JS library.
  // For deployment we intentionally keep this typing loose to avoid TS build breaks
  // when the renderer API evolves.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  scene: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  camera: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  renderer: { domElement: HTMLCanvasElement; setSize: (w: number, h: number) => void; setPixelRatio: (r: number) => void; render: (s: any, c: any) => void };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  controls: { update: () => void; target: { set: (x: number, y: number, z: number) => void } };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  loadFromPath: (path: string) => Promise<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateColors: (mode: any, classificationRange?: { min: number; max: number } | null) => void;
  setClassificationColorRange?: (range: { min: number; max: number } | null) => void;
  setColorMode?: (mode: string) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onPointCloudLoad: (callback: (data: any, geometry: any, points: any) => void) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  optimizer: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  material: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateTime: (time: number) => void;
  getData: () => { pointCount: number; classifications?: Uint8Array } | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getGeometry: () => any | null;
}

const COLOR_MODE_MAP: Record<ColorMode, string> = {
  RGB: 'rgb',
  Height: 'height',
  Intensity: 'intensity',
  Classification: 'classification',
  Cracking: 'cracking',
};

const FPS_UPDATE_INTERVAL_MS = 1000;

export function usePointCloud({
  containerRef,
  lasFilePath,
  colorMode = 'RGB',
  onStatsUpdate,
  enableOptimizer = true,
  onRenderFrame,
  classificationFilter = null,
  classificationColorRange = null,
}: UsePointCloudOptions): UsePointCloudReturn {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<PointCloudStats | null>(null);

  const modulesRef = useRef<RendererModules | null>(null);
  const isMountedRef = useRef(true);
  const animationFrameRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef<number>(performance.now());
  const resizeHandlerRef = useRef<(() => void) | null>(null);

  // FPS tracking
  const fpsFrameCountRef = useRef<number>(0);
  const fpsLastUpdateRef = useRef<number>(performance.now());
  const currentFpsRef = useRef<number>(60);

  function buildCurrentStats(modules: RendererModules, fps: number): PointCloudStats {
    const data = modules.getData();
    const optimizerStats = modules.optimizer.getStats();
    return {
      totalPoints: data?.pointCount ?? 0,
      renderedPoints: optimizerStats.visiblePointCount,
      fps,
      lastUpdate: Date.now(),
    };
  }

  const animate = useCallback(() => {
    const modules = modulesRef.current;
    if (!isMountedRef.current || !modules) return;

    const now = performance.now();
    const deltaTime = (now - lastFrameTimeRef.current) / 1000;
    lastFrameTimeRef.current = now;
    fpsFrameCountRef.current++;

    modules.updateTime?.(now * 0.001);
    modules.controls.update();

    if (modules.optimizer.enabled) {
      modules.optimizer.update(modules.camera, deltaTime);
    }

    modules.renderer.render(modules.scene, modules.camera);
    onRenderFrame?.();

    // Update FPS stats periodically
    const fpsElapsed = now - fpsLastUpdateRef.current;
    if (fpsElapsed >= FPS_UPDATE_INTERVAL_MS) {
      currentFpsRef.current = Math.round((fpsFrameCountRef.current * 1000) / fpsElapsed);
      fpsFrameCountRef.current = 0;
      fpsLastUpdateRef.current = now;

      if (isMountedRef.current) {
        const currentStats = buildCurrentStats(modules, currentFpsRef.current);
        setStats(currentStats);
        onStatsUpdate?.(currentStats);
      }
    }

    animationFrameRef.current = requestAnimationFrame(animate);
  }, [onStatsUpdate, onRenderFrame]);

  useEffect(() => {
    isMountedRef.current = true;
    let cleanupCanvas: HTMLCanvasElement | null = null;

    const initializeRenderer = async () => {
      const container = containerRef.current;
      if (!container) {
        setError('Container element not found');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Dynamic import to avoid SSR issues
        // Dynamic import from locally bundled renderer. Cast to any to avoid TS
        // coupling to the renderer's JS export typing.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const rendererModule = (await import('custom-pointcloud-renderer')) as any;
        if (!isMountedRef.current) return;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { scene, camera, renderer, controls, loadFromPath, updateColors, setClassificationColorRange, setColorMode, onPointCloudLoad, optimizer, updateTime, getData, getGeometry } = rendererModule as any;

        modulesRef.current = {
          scene, camera, renderer, controls, loadFromPath, updateColors, setClassificationColorRange, setColorMode, onPointCloudLoad, optimizer, material: {}, updateTime, getData, getGeometry,
        };

        // Move canvas from document.body to our container
        const canvas = renderer.domElement;
        cleanupCanvas = canvas;
        if (canvas.parentElement) {
          canvas.parentElement.removeChild(canvas);
        }
        container.appendChild(canvas);

        // Resize handler for canvas and camera
        const resizeCanvas = () => {
          if (!container || !isMountedRef.current) return;
          const { width, height } = container.getBoundingClientRect();
          if (width <= 0 || height <= 0) return;

          renderer.setSize(width, height);
          renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
          if (camera.aspect !== undefined) {
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
          }
        };

        resizeCanvas();
        resizeHandlerRef.current = resizeCanvas;
        window.addEventListener('resize', resizeCanvas);

        const resizeObserver = new ResizeObserver(resizeCanvas);
        resizeObserver.observe(container);

        if (enableOptimizer) {
          optimizer.enable();
          optimizer.setFPSSettings({ minFPS: 60 });
        }

        onPointCloudLoad((data: unknown, geometry: unknown, points: unknown) => {
          if (!isMountedRef.current) return;
          const pointData = data as { pointCount: number };

          // Initialize optimizer with point cloud data (required for downsampling to work)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          optimizer.onPointCloudLoaded(data as any, geometry as any, points as any);

          setIsLoading(false);
          setStats({
            totalPoints: pointData.pointCount,
            renderedPoints: pointData.pointCount,
            fps: 60,
            lastUpdate: Date.now(),
          });
        });

        await loadFromPath(lasFilePath);

        lastFrameTimeRef.current = performance.now();
        animationFrameRef.current = requestAnimationFrame(animate);

        return () => {
          window.removeEventListener('resize', resizeCanvas);
          resizeObserver.disconnect();
        };
      } catch (err) {
        if (!isMountedRef.current) return;
        const errorMessage = err instanceof Error ? err.message : 'Failed to load point cloud';
        setError(errorMessage);
        setIsLoading(false);
        console.error('[usePointCloud] Error initializing renderer:', err);
      }
    };

    initializeRenderer();

    return () => {
      isMountedRef.current = false;

      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }

      if (resizeHandlerRef.current) {
        window.removeEventListener('resize', resizeHandlerRef.current);
        resizeHandlerRef.current = null;
      }

      if (cleanupCanvas?.parentElement) {
        cleanupCanvas.parentElement.removeChild(cleanupCanvas);
      }

      modulesRef.current?.optimizer?.disable();
      modulesRef.current = null;
    };
  // colorMode excluded - handled by separate useEffect to avoid reloading pointcloud
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lasFilePath, enableOptimizer, animate, containerRef]);

  // Handle color mode changes reactively
  useEffect(() => {
    if (modulesRef.current && !isLoading) {
      // Set the color mode in the renderer's state FIRST.
      // This is critical because the optimizer reads the color mode from pointCloud.js state
      // when regenerating colors for downsampled geometry.
      if (modulesRef.current.setColorMode) {
        modulesRef.current.setColorMode(COLOR_MODE_MAP[colorMode]);
      }

      // Explicitly set classification color range BEFORE updating colors.
      // The renderer maintains internal state for the classification range, and calling
      // setClassificationColorRange() ensures this state is updated before updateColors()
      // applies the coloring. This is critical for cracking (0-4) vs micro_movements (5-8)
      // to display different color mappings despite both using 'classification' mode.
      if (modulesRef.current.setClassificationColorRange) {
        modulesRef.current.setClassificationColorRange(classificationColorRange);
      }

      // CRITICAL FIX: If the optimizer is enabled and has downsampled the geometry,
      // we MUST trigger a downsampling update to regenerate colors for the downsampled points.
      // Simply calling updateColors() will try to set 2.8M colors on a 721K-point geometry,
      // which fails silently. The optimizer's updateDownsampling() method regenerates colors
      // correctly based on the current color mode and classification range.
      const optimizer = modulesRef.current.optimizer;
      if (optimizer && optimizer.enabled) {
        // Get the current downsample step from the optimizer stats (NOT visible points which is frustum-based)
        const stats = optimizer.getStats();
        const currentStep = stats.downsamplingFactor || 1;

        // Force the optimizer to regenerate colors by calling updateDownsampling with current step
        if (optimizer.updateDownsampling && typeof optimizer.updateDownsampling === 'function') {
          optimizer.updateDownsampling(currentStep);
        } else {
          // Fallback to updateColors if updateDownsampling doesn't exist
          modulesRef.current.updateColors(COLOR_MODE_MAP[colorMode], classificationColorRange);
        }
      } else {
        // If optimizer is disabled, use the standard updateColors path
        modulesRef.current.updateColors(COLOR_MODE_MAP[colorMode], classificationColorRange);
      }
    }
  }, [colorMode, isLoading, classificationColorRange]);

  // Handle classification filter changes reactively
  // Delegates to optimizer which applies the filter during downsampling (size 0 = hidden)
  useEffect(() => {
    const modules = modulesRef.current;
    if (!modules || isLoading) return;

    // Use the optimizer's classification filter method
    // This ensures the filter is applied consistently when the optimizer regenerates geometry
    const optimizer = modules.optimizer;
    if (optimizer && optimizer.setClassificationFilter) {
      optimizer.setClassificationFilter(classificationFilter ?? null);
    }
  }, [classificationFilter, isLoading]);

  const changeColorMode = useCallback((mode: ColorMode) => {
    modulesRef.current?.updateColors(COLOR_MODE_MAP[mode]);
  }, []);

  const getCamera = useCallback(() => modulesRef.current?.camera ?? null, []);

  const getControls = useCallback(() => modulesRef.current?.controls ?? null, []);

  const getStats = useCallback((): PointCloudStats | null => {
    const modules = modulesRef.current;
    if (!modules) return null;
    return buildCurrentStats(modules, Math.round(modules.optimizer.getStats().currentFPS));
  }, []);

  const setOptimizerMode = useCallback((mode: OptimizerMode) => {
    modulesRef.current?.optimizer?.setDownsamplingMode(mode);
  }, []);

  const getOptimizerMode = useCallback((): OptimizerMode => {
    return (modulesRef.current?.optimizer?.getDownsamplingMode() as OptimizerMode) ?? 'fps';
  }, []);

  const enableOptimizerFn = useCallback(() => {
    modulesRef.current?.optimizer?.enable();
  }, []);

  const disableOptimizerFn = useCallback(() => {
    modulesRef.current?.optimizer?.disable();
  }, []);

  const isOptimizerEnabledFn = useCallback((): boolean => {
    return modulesRef.current?.optimizer?.enabled ?? false;
  }, []);

  return {
    isLoading,
    error,
    stats,
    changeColorMode,
    getCamera,
    getControls,
    getStats,
    setOptimizerMode,
    getOptimizerMode,
    enableOptimizer: enableOptimizerFn,
    disableOptimizer: disableOptimizerFn,
    isOptimizerEnabled: isOptimizerEnabledFn,
  };
}

export type { UsePointCloudOptions, UsePointCloudReturn };
